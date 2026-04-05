import { Router, type IRouter } from "express";
import { db, bookingsTable, roomsTable, hotelsTable, usersTable } from "@workspace/db";
import { eq, and, or, sql, inArray } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/requireAuth";
import {
  CreateBookingBody,
  GetBookingParams,
  CancelBookingParams,
  PayBookingParams,
  PayBookingBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function bookingWithDetails(booking: typeof bookingsTable.$inferSelect) {
  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, booking.roomId));
  const [hotel] = await db.select().from(hotelsTable).where(eq(hotelsTable.id, room?.hotelId ?? 0));

  return {
    ...booking,
    room: room ?? null,
    hotel: hotel
      ? {
          id: hotel.id,
          name: hotel.name,
          description: hotel.description,
          city: hotel.city,
          address: hotel.address,
          rating: hotel.rating,
          stars: hotel.stars,
          amenities: hotel.amenities,
          images: hotel.images,
          reviewCount: 0,
          minPrice: null,
          createdAt: hotel.createdAt,
        }
      : null,
  };
}

router.get("/bookings", requireAdmin, async (_req, res): Promise<void> => {
  const bookings = await db
    .select()
    .from(bookingsTable)
    .orderBy(sql`${bookingsTable.createdAt} desc`);

  const results = await Promise.all(bookings.map(bookingWithDetails));
  res.json(results);
});

router.post("/bookings", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { roomId, checkIn, checkOut } = parsed.data;
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkInDate >= checkOutDate) {
    res.status(400).json({ error: "Check-out must be after check-in" });
    return;
  }

  // Check availability
  const overlapping = await db
    .select()
    .from(bookingsTable)
    .where(
      and(
        eq(bookingsTable.roomId, roomId),
        sql`${bookingsTable.status} != 'cancelled'`,
        sql`${bookingsTable.checkIn} < ${checkOutDate.toISOString()}::timestamptz`,
        sql`${bookingsTable.checkOut} > ${checkInDate.toISOString()}::timestamptz`
      )
    );

  if (overlapping.length > 0) {
    res.status(400).json({ error: "Room is not available for the selected dates" });
    return;
  }

  // Get room to calculate price
  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, roomId));
  if (!room) {
    res.status(400).json({ error: "Room not found" });
    return;
  }

  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalPrice = room.price * nights;

  const [booking] = await db
    .insert(bookingsTable)
    .values({
      userId: req.user!.userId,
      roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
      status: "pending",
    })
    .returning();

  res.status(201).json(booking);
});

router.get("/bookings/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetBookingParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [booking] = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.id, params.data.id));

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  if (booking.userId !== req.user!.userId && req.user!.role !== "ADMIN") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  res.json(await bookingWithDetails(booking));
});

router.post("/bookings/:id/cancel", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = CancelBookingParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [booking] = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.id, params.data.id));

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  if (booking.userId !== req.user!.userId && req.user!.role !== "ADMIN") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  if (booking.status === "cancelled") {
    res.status(400).json({ error: "Booking is already cancelled" });
    return;
  }

  const [updated] = await db
    .update(bookingsTable)
    .set({ status: "cancelled" })
    .where(eq(bookingsTable.id, params.data.id))
    .returning();

  res.json(updated);
});

router.post("/bookings/:id/pay", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = PayBookingParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = PayBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [booking] = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.id, params.data.id));

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  if (booking.userId !== req.user!.userId && req.user!.role !== "ADMIN") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  if (booking.status !== "pending") {
    res.status(400).json({ error: "Booking cannot be paid in its current state" });
    return;
  }

  const [updated] = await db
    .update(bookingsTable)
    .set({ status: "confirmed" })
    .where(eq(bookingsTable.id, params.data.id))
    .returning();

  res.json(updated);
});

export default router;

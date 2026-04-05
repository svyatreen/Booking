import { Router, type IRouter } from "express";
import { db, usersTable, bookingsTable, roomsTable, hotelsTable } from "../db";
import { eq, sql, inArray } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/requireAuth";
import { UpdateMeBody } from "../zod";

const router: IRouter = Router();

router.get("/users/me", requireAuth, async (req, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.userId));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  });
});

router.patch("/users/me", requireAuth, async (req, res): Promise<void> => {
  const parsed = UpdateMeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [user] = await db
    .update(usersTable)
    .set(parsed.data)
    .where(eq(usersTable.id, req.user!.userId))
    .returning();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  });
});

router.get("/users/me/bookings", requireAuth, async (req, res): Promise<void> => {
  const bookings = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.userId, req.user!.userId))
    .orderBy(sql`${bookingsTable.createdAt} desc`);

  const roomIds = [...new Set(bookings.map((b) => b.roomId))];
  const rooms = roomIds.length > 0
    ? await db.select().from(roomsTable).where(inArray(roomsTable.id, roomIds))
    : [];

  const hotelIds = [...new Set(rooms.map((r) => r.hotelId))];
  const hotels = hotelIds.length > 0
    ? await db.select().from(hotelsTable).where(inArray(hotelsTable.id, hotelIds))
    : [];

  const roomMap = new Map(rooms.map((r) => [r.id, r]));
  const hotelMap = new Map(hotels.map((h) => [h.id, h]));

  const result = bookings.map((b) => {
    const room = roomMap.get(b.roomId) ?? null;
    const hotel = room ? (hotelMap.get(room.hotelId) ?? null) : null;
    return {
      ...b,
      room,
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
  });

  res.json(result);
});

router.get("/admin/users", requireAdmin, async (_req, res): Promise<void> => {
  const users = await db.select({
    id: usersTable.id,
    email: usersTable.email,
    name: usersTable.name,
    role: usersTable.role,
    createdAt: usersTable.createdAt,
  }).from(usersTable).orderBy(usersTable.createdAt);

  res.json(users);
});

export default router;

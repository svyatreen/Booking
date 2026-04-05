import { Router, type IRouter } from "express";
import { db, roomsTable, bookingsTable } from "../db";
import { eq, and, or, sql } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAuth";
import {
  GetRoomsByHotelParams,
  GetRoomsByHotelQueryParams,
  CreateRoomParams,
  CreateRoomBody,
  UpdateRoomParams,
  UpdateRoomBody,
  DeleteRoomParams,
} from "../zod";

const router: IRouter = Router();

router.get("/hotels/:hotelId/rooms", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.hotelId) ? req.params.hotelId[0] : req.params.hotelId;
  const params = GetRoomsByHotelParams.safeParse({ hotelId: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const queryParams = GetRoomsByHotelQueryParams.safeParse(req.query);
  const { checkIn, checkOut } = queryParams.success ? queryParams.data : {};

  const rooms = await db
    .select()
    .from(roomsTable)
    .where(eq(roomsTable.hotelId, params.data.hotelId));

  if (!checkIn || !checkOut) {
    res.json(rooms.map((r) => ({ ...r, isAvailable: true })));
    return;
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  const roomsWithAvailability = await Promise.all(
    rooms.map(async (room) => {
      const overlapping = await db
        .select()
        .from(bookingsTable)
        .where(
          and(
            eq(bookingsTable.roomId, room.id),
            sql`${bookingsTable.status} != 'cancelled'`,
            sql`${bookingsTable.checkIn} < ${checkOutDate.toISOString()}::timestamptz`,
            sql`${bookingsTable.checkOut} > ${checkInDate.toISOString()}::timestamptz`
          )
        );

      return { ...room, isAvailable: overlapping.length === 0 };
    })
  );

  res.json(roomsWithAvailability);
});

router.post("/hotels/:hotelId/rooms", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.hotelId) ? req.params.hotelId[0] : req.params.hotelId;
  const params = CreateRoomParams.safeParse({ hotelId: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = CreateRoomBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [room] = await db
    .insert(roomsTable)
    .values({
      ...parsed.data,
      hotelId: params.data.hotelId,
      images: parsed.data.images ?? [],
    })
    .returning();

  res.status(201).json(room);
});

router.patch("/rooms/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateRoomParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateRoomBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [room] = await db
    .update(roomsTable)
    .set(parsed.data)
    .where(eq(roomsTable.id, params.data.id))
    .returning();

  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }

  res.json(room);
});

router.delete("/rooms/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteRoomParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [room] = await db.delete(roomsTable).where(eq(roomsTable.id, params.data.id)).returning();
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;

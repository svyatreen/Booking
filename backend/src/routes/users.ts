import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { db, usersTable, bookingsTable, roomsTable, hotelsTable } from "../db";
import { eq, sql, inArray } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/requireAuth";
import { hashPassword, comparePassword } from "../lib/auth";

const router: IRouter = Router();

const serializeUser = (user: typeof usersTable.$inferSelect) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  phone: user.phone,
  avatarUrl: user.avatarUrl,
  bio: user.bio,
  createdAt: user.createdAt,
});

router.get("/users/me", requireAuth, async (req, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.userId));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(serializeUser(user));
});

const UpdateProfileBody = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(40).nullable().optional(),
  avatarUrl: z.string().max(2_000_000).nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
});

router.patch("/users/me", requireAuth, async (req, res): Promise<void> => {
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.email) {
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, parsed.data.email));
    if (existing && existing.id !== req.user!.userId) {
      res.status(409).json({ error: "Email already in use" });
      return;
    }
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

  res.json(serializeUser(user));
});

const ChangePasswordBody = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6).max(200),
});

router.post("/users/me/change-password", requireAuth, async (req, res): Promise<void> => {
  const parsed = ChangePasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.userId));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const valid = await comparePassword(parsed.data.currentPassword, user.password);
  if (!valid) {
    res.status(401).json({ error: "Current password is incorrect" });
    return;
  }

  if (parsed.data.currentPassword === parsed.data.newPassword) {
    res.status(400).json({ error: "New password must be different from current password" });
    return;
  }

  const newHash = await hashPassword(parsed.data.newPassword);
  await db.update(usersTable).set({ password: newHash }).where(eq(usersTable.id, user.id));

  res.json({ success: true });
});

const DeleteAccountBody = z.object({
  password: z.string().min(1),
});

router.delete("/users/me", requireAuth, async (req, res): Promise<void> => {
  const parsed = DeleteAccountBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.userId));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const valid = await comparePassword(parsed.data.password, user.password);
  if (!valid) {
    res.status(401).json({ error: "Password is incorrect" });
    return;
  }

  await db.delete(usersTable).where(eq(usersTable.id, user.id));

  res.json({ success: true });
});

router.get("/users/me/stats", requireAuth, async (req, res): Promise<void> => {
  const userId = req.user!.userId;

  const [{ totalBookings, totalSpent, citiesCount }] = await db
    .select({
      totalBookings: sql<number>`count(*)::int`,
      totalSpent: sql<number>`coalesce(sum(case when ${bookingsTable.status} != 'cancelled' then ${bookingsTable.totalPrice} else 0 end), 0)::int`,
      citiesCount: sql<number>`count(distinct ${hotelsTable.city})::int`,
    })
    .from(bookingsTable)
    .leftJoin(roomsTable, eq(bookingsTable.roomId, roomsTable.id))
    .leftJoin(hotelsTable, eq(roomsTable.hotelId, hotelsTable.id))
    .where(eq(bookingsTable.userId, userId));

  res.json({ totalBookings, totalSpent, citiesCount });
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

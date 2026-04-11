import { Router, type IRouter } from 'express';
import {
  db,
  hotelsTable,
  roomsTable,
  bookingsTable,
  reviewsTable,
} from '../db';
import {
  eq,
  like,
  or,
  and,
  gte,
  lte,
  sql,
  desc,
  asc,
  inArray,
} from 'drizzle-orm';
import { requireAdmin } from '../middlewares/requireAuth';
import {
  ListHotelsQueryParams,
  CreateHotelBody,
  GetHotelParams,
  UpdateHotelParams,
  UpdateHotelBody,
  DeleteHotelParams,
  GetSimilarHotelsParams,
} from '../zod';

const router: IRouter = Router();

function buildHotelWithMeta(
  hotel: typeof hotelsTable.$inferSelect,
  reviewCount: number,
  minPrice: number | null,
) {
  return {
    id: hotel.id,
    name: hotel.name,
    description: hotel.description,
    city: hotel.city,
    address: hotel.address,
    rating: hotel.rating,
    stars: hotel.stars,
    amenities: hotel.amenities,
    images: hotel.images,
    reviewCount,
    minPrice,
    createdAt: hotel.createdAt,
  };
}

router.get('/hotels', async (req, res): Promise<void> => {
  const query = ListHotelsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { search, city, minRating, stars, sortBy, sortOrder } = query.data;
  const minPrice = query.data.minPrice;
  const maxPrice = query.data.maxPrice;

  const conditions = [];

  if (search) {
    conditions.push(
      or(
        like(hotelsTable.name, `%${search}%`),
        like(hotelsTable.city, `%${search}%`),
        like(hotelsTable.description, `%${search}%`),
      ),
    );
  }

  if (city) {
    conditions.push(like(hotelsTable.city, `%${city}%`));
  }

  if (minRating != null) {
    conditions.push(gte(hotelsTable.rating, Number(minRating)));
  }

  if (stars != null) {
    conditions.push(eq(hotelsTable.stars, Number(stars)));
  }

  const hotels = await db
    .select()
    .from(hotelsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const hotelIds = hotels.map((h) => h.id);

  if (hotelIds.length === 0) {
    res.json([]);
    return;
  }

  const reviewCounts = await db
    .select({
      hotelId: reviewsTable.hotelId,
      count: sql<number>`count(*)::int`,
    })
    .from(reviewsTable)
    .where(inArray(reviewsTable.hotelId, hotelIds))
    .groupBy(reviewsTable.hotelId);

  const roomPrices = await db
    .select({
      hotelId: roomsTable.hotelId,
      minPrice: sql<number>`min(${roomsTable.price})::float`,
    })
    .from(roomsTable)
    .where(inArray(roomsTable.hotelId, hotelIds))
    .groupBy(roomsTable.hotelId);

  const reviewMap = new Map(reviewCounts.map((r) => [r.hotelId, r.count]));
  const priceMap = new Map(roomPrices.map((r) => [r.hotelId, r.minPrice]));

  let result = hotels.map((h) =>
    buildHotelWithMeta(h, reviewMap.get(h.id) ?? 0, priceMap.get(h.id) ?? null),
  );

  // Filter by price range
  if (minPrice != null) {
    result = result.filter(
      (h) => h.minPrice == null || h.minPrice >= Number(minPrice),
    );
  }
  if (maxPrice != null) {
    result = result.filter(
      (h) => h.minPrice == null || h.minPrice <= Number(maxPrice),
    );
  }

  // Sorting
  if (sortBy === 'price') {
    result.sort((a, b) => {
      const ap = a.minPrice ?? Infinity;
      const bp = b.minPrice ?? Infinity;
      return sortOrder === 'desc' ? bp - ap : ap - bp;
    });
  } else if (sortBy === 'rating') {
    result.sort((a, b) =>
      sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating,
    );
  } else if (sortBy === 'popularity') {
    result.sort((a, b) =>
      sortOrder === 'desc'
        ? b.reviewCount - a.reviewCount
        : a.reviewCount - b.reviewCount,
    );
  }

  res.json(result);
});

router.get('/hotels/stats', async (_req, res): Promise<void> => {
  const [totalHotelsRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(hotelsTable);
  const [totalBookingsRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(bookingsTable);

  const cityCounts = await db
    .select({
      city: hotelsTable.city,
      count: sql<number>`count(*)::int`,
    })
    .from(hotelsTable)
    .groupBy(hotelsTable.city)
    .orderBy(desc(sql`count(*)`))
    .limit(6);

  const topHotels = await db
    .select()
    .from(hotelsTable)
    .orderBy(desc(hotelsTable.rating))
    .limit(12);

  const topHotelIds = topHotels.map((h) => h.id);
  const reviewCounts =
    topHotelIds.length > 0
      ? await db
          .select({
            hotelId: reviewsTable.hotelId,
            count: sql<number>`count(*)::int`,
          })
          .from(reviewsTable)
          .where(inArray(reviewsTable.hotelId, topHotelIds))
          .groupBy(reviewsTable.hotelId)
      : [];

  const roomPrices =
    topHotelIds.length > 0
      ? await db
          .select({
            hotelId: roomsTable.hotelId,
            minPrice: sql<number>`min(${roomsTable.price})::float`,
          })
          .from(roomsTable)
          .where(inArray(roomsTable.hotelId, topHotelIds))
          .groupBy(roomsTable.hotelId)
      : [];

  const reviewMap = new Map(reviewCounts.map((r) => [r.hotelId, r.count]));
  const priceMap = new Map(roomPrices.map((r) => [r.hotelId, r.minPrice]));

  res.json({
    totalHotels: totalHotelsRow.count,
    totalBookings: totalBookingsRow.count,
    featuredCities: cityCounts,
    topHotels: topHotels.map((h) =>
      buildHotelWithMeta(
        h,
        reviewMap.get(h.id) ?? 0,
        priceMap.get(h.id) ?? null,
      ),
    ),
  });
});

router.post('/hotels', requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateHotelBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [hotel] = await db
    .insert(hotelsTable)
    .values({
      ...parsed.data,
      amenities: parsed.data.amenities ?? [],
      images: parsed.data.images ?? [],
    })
    .returning();

  res.status(201).json(buildHotelWithMeta(hotel, 0, null));
});

router.get('/hotels/:id', async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetHotelParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [hotel] = await db
    .select()
    .from(hotelsTable)
    .where(eq(hotelsTable.id, params.data.id));
  if (!hotel) {
    res.status(404).json({ error: 'Hotel not found' });
    return;
  }

  const rooms = await db
    .select()
    .from(roomsTable)
    .where(eq(roomsTable.hotelId, hotel.id));
  const [reviewRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(reviewsTable)
    .where(eq(reviewsTable.hotelId, hotel.id));
  const [priceRow] = await db
    .select({ minPrice: sql<number>`min(${roomsTable.price})::float` })
    .from(roomsTable)
    .where(eq(roomsTable.hotelId, hotel.id));

  res.json({
    ...buildHotelWithMeta(
      hotel,
      reviewRow?.count ?? 0,
      priceRow?.minPrice ?? null,
    ),
    rooms,
  });
});

router.patch('/hotels/:id', requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateHotelParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateHotelBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [hotel] = await db
    .update(hotelsTable)
    .set(parsed.data)
    .where(eq(hotelsTable.id, params.data.id))
    .returning();

  if (!hotel) {
    res.status(404).json({ error: 'Hotel not found' });
    return;
  }

  res.json(buildHotelWithMeta(hotel, 0, null));
});

router.delete('/hotels/:id', requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteHotelParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [hotel] = await db
    .delete(hotelsTable)
    .where(eq(hotelsTable.id, params.data.id))
    .returning();
  if (!hotel) {
    res.status(404).json({ error: 'Hotel not found' });
    return;
  }

  res.sendStatus(204);
});

router.get('/hotels/:id/similar', async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetSimilarHotelsParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [hotel] = await db
    .select()
    .from(hotelsTable)
    .where(eq(hotelsTable.id, params.data.id));
  if (!hotel) {
    res.json([]);
    return;
  }

  const similar = await db
    .select()
    .from(hotelsTable)
    .where(
      and(
        eq(hotelsTable.city, hotel.city),
        sql`${hotelsTable.id} != ${params.data.id}`,
      ),
    )
    .limit(4);

  const similarIds = similar.map((h) => h.id);
  const reviewCounts =
    similarIds.length > 0
      ? await db
          .select({
            hotelId: reviewsTable.hotelId,
            count: sql<number>`count(*)::int`,
          })
          .from(reviewsTable)
          .where(inArray(reviewsTable.hotelId, similarIds))
          .groupBy(reviewsTable.hotelId)
      : [];

  const roomPrices =
    similarIds.length > 0
      ? await db
          .select({
            hotelId: roomsTable.hotelId,
            minPrice: sql<number>`min(${roomsTable.price})::float`,
          })
          .from(roomsTable)
          .where(inArray(roomsTable.hotelId, similarIds))
          .groupBy(roomsTable.hotelId)
      : [];

  const reviewMap = new Map(reviewCounts.map((r) => [r.hotelId, r.count]));
  const priceMap = new Map(roomPrices.map((r) => [r.hotelId, r.minPrice]));

  res.json(
    similar.map((h) =>
      buildHotelWithMeta(
        h,
        reviewMap.get(h.id) ?? 0,
        priceMap.get(h.id) ?? null,
      ),
    ),
  );
});

export default router;

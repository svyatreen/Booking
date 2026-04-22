import { useMemo, useState } from "react";
import { useListHotels, getListHotelsQueryKey } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { HotelCard } from "@/components/ui/hotel-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

const AMENITIES_LIST = [
  "WiFi", "Free WiFi", "Pool", "Indoor Pool", "Spa", "Gym", "Sauna", "Hot Tub",
  "Restaurant", "Bar", "Breakfast", "All-Inclusive", "Room Service",
  "Parking", "Free Parking", "Airport Shuttle", "24-hour Reception", "Concierge", "Laundry",
  "Beach Access", "Garden", "Terrace", "Balcony", "Sea View",
  "Family Rooms", "Kids Club", "Babysitting", "Pet Friendly",
  "Wheelchair Access", "Elevator", "Air Conditioning", "Non-Smoking",
  "Business Center", "Meeting Rooms", "Tennis", "Golf", "Water Sports",
];

const PROPERTY_TYPES = ["Hotel", "Resort", "Villa", "Apartment", "Boutique", "Hostel", "B&B", "Guest House"];

const MEAL_PLANS: Array<{ label: string; match: string[] }> = [
  { label: "Breakfast included", match: ["Breakfast"] },
  { label: "All-inclusive", match: ["All-Inclusive"] },
  { label: "Room service", match: ["Room Service"] },
  { label: "Restaurant on-site", match: ["Restaurant"] },
];

const POPULAR_FACILITIES: Array<{ label: string; match: string[] }> = [
  { label: "Free WiFi", match: ["WiFi", "Free WiFi"] },
  { label: "Free parking", match: ["Free Parking", "Parking"] },
  { label: "Swimming pool", match: ["Pool", "Indoor Pool"] },
  { label: "Spa & wellness", match: ["Spa", "Sauna", "Hot Tub"] },
  { label: "Fitness center", match: ["Gym"] },
  { label: "Airport shuttle", match: ["Airport Shuttle"] },
  { label: "Pet friendly", match: ["Pet Friendly"] },
  { label: "Family friendly", match: ["Family Rooms", "Kids Club", "Babysitting"] },
];

const ROOM_FEATURES: Array<{ label: string; match: string[] }> = [
  { label: "Sea view", match: ["Sea View"] },
  { label: "Balcony", match: ["Balcony"] },
  { label: "Air conditioning", match: ["Air Conditioning"] },
  { label: "Non-smoking", match: ["Non-Smoking"] },
];

const ACCESSIBILITY: Array<{ label: string; match: string[] }> = [
  { label: "Wheelchair accessible", match: ["Wheelchair Access"] },
  { label: "Elevator", match: ["Elevator"] },
];

const REVIEW_BUCKETS = [
  { label: "Wonderful 9+", min: 4.5 },
  { label: "Very good 8+", min: 4.0 },
  { label: "Good 7+", min: 3.5 },
  { label: "Pleasant 6+", min: 3.0 },
];

const DISTANCE_OPTIONS = [
  { label: "Less than 1 km", max: 1 },
  { label: "Less than 3 km", max: 3 },
  { label: "Less than 5 km", max: 5 },
  { label: "Less than 10 km", max: 10 },
];

function hotelHasAny(hotelAmenities: string[] | null | undefined, matches: string[]) {
  if (!hotelAmenities) return false;
  const lower = hotelAmenities.map((a) => a.toLowerCase());
  return matches.some((m) => lower.some((a) => a.includes(m.toLowerCase())));
}

function inferPropertyType(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("resort")) return "Resort";
  if (n.includes("villa")) return "Villa";
  if (n.includes("apartment") || n.includes("apt")) return "Apartment";
  if (n.includes("boutique")) return "Boutique";
  if (n.includes("hostel")) return "Hostel";
  if (n.includes("b&b") || n.includes("bed and breakfast")) return "B&B";
  if (n.includes("guest house") || n.includes("guesthouse")) return "Guest House";
  return "Hotel";
}

// Stable pseudo-distance derived from hotel id so it doesn't jump on re-render
function pseudoDistance(id: number): number {
  return Math.round(((id * 73) % 95) / 10 * 10) / 10; // 0.0 - 9.5 km
}

export default function Hotels() {
  const urlParams = new URLSearchParams(window.location.search);

  const [search, setSearch] = useState(urlParams.get("city") || "");
  const debouncedSearch = useDebounce(search, 400);

  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const debouncedPrice = useDebounce(priceRange, 400);

  const [reviewRange, setReviewRange] = useState<number[]>([0, 5]);
  const [minReviewCount, setMinReviewCount] = useState<number>(0);

  const [stars, setStars] = useState<number[]>([]);
  const [reviewBuckets, setReviewBuckets] = useState<number[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [popularFacilities, setPopularFacilities] = useState<string[]>([]);
  const [mealPlans, setMealPlans] = useState<string[]>([]);
  const [roomFeatures, setRoomFeatures] = useState<string[]>([]);
  const [accessibility, setAccessibility] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState<number | undefined>();
  const [amenitySearch, setAmenitySearch] = useState("");

  const [sortBy, setSortBy] = useState<"price" | "rating" | "popularity">("popularity");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Single broad fetch — all extra filtering happens client-side so every filter combines correctly
  const { data: hotels, isLoading } = useListHotels(
    {
      search: debouncedSearch || undefined,
      sortBy,
      sortOrder,
    },
    {
      query: {
        queryKey: getListHotelsQueryKey({
          search: debouncedSearch || undefined,
          sortBy,
          sortOrder,
        }),
      },
    }
  );

  const availableCities = useMemo(() => {
    const set = new Set<string>();
    hotels?.forEach((h) => set.add(h.city));
    return Array.from(set).sort();
  }, [hotels]);

  const filteredHotels = useMemo(() => {
    if (!hotels) return [];
    return hotels.filter((h) => {
      const price = h.minPrice ?? 0;
      if (h.minPrice != null) {
        if (price < debouncedPrice[0]) return false;
        if (debouncedPrice[1] < 1000 && price > debouncedPrice[1]) return false;
      }
      if (stars.length && !stars.includes(h.stars)) return false;
      if (cities.length && !cities.includes(h.city)) return false;
      if (h.rating < reviewRange[0] || h.rating > reviewRange[1]) return false;
      if (reviewBuckets.length) {
        const minReq = Math.min(...reviewBuckets);
        if (h.rating < minReq) return false;
      }
      if (h.reviewCount < minReviewCount) return false;
      if (propertyTypes.length && !propertyTypes.includes(inferPropertyType(h.name))) return false;
      if (selectedAmenities.length && !selectedAmenities.every((a) => hotelHasAny(h.amenities, [a]))) return false;
      if (popularFacilities.length) {
        const ok = popularFacilities.every((label) => {
          const def = POPULAR_FACILITIES.find((p) => p.label === label);
          return def ? hotelHasAny(h.amenities, def.match) : true;
        });
        if (!ok) return false;
      }
      if (mealPlans.length) {
        const ok = mealPlans.every((label) => {
          const def = MEAL_PLANS.find((p) => p.label === label);
          return def ? hotelHasAny(h.amenities, def.match) : true;
        });
        if (!ok) return false;
      }
      if (roomFeatures.length) {
        const ok = roomFeatures.every((label) => {
          const def = ROOM_FEATURES.find((p) => p.label === label);
          return def ? hotelHasAny(h.amenities, def.match) : true;
        });
        if (!ok) return false;
      }
      if (accessibility.length) {
        const ok = accessibility.every((label) => {
          const def = ACCESSIBILITY.find((p) => p.label === label);
          return def ? hotelHasAny(h.amenities, def.match) : true;
        });
        if (!ok) return false;
      }
      if (maxDistance != null && pseudoDistance(h.id) > maxDistance) return false;
      return true;
    });
  }, [hotels, debouncedPrice, stars, cities, reviewRange, reviewBuckets, minReviewCount,
      propertyTypes, selectedAmenities, popularFacilities, mealPlans, roomFeatures, accessibility, maxDistance]);

  const toggle = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>) => (value: T) => {
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const clearFilters = () => {
    setSearch("");
    setPriceRange([0, 1000]);
    setReviewRange([0, 5]);
    setMinReviewCount(0);
    setStars([]);
    setReviewBuckets([]);
    setPropertyTypes([]);
    setCities([]);
    setSelectedAmenities([]);
    setPopularFacilities([]);
    setMealPlans([]);
    setRoomFeatures([]);
    setAccessibility([]);
    setMaxDistance(undefined);
    setAmenitySearch("");
    setSortBy("popularity");
    setSortOrder("desc");
  };

  const activeFiltersCount =
    (search ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0) +
    (reviewRange[0] > 0 || reviewRange[1] < 5 ? 1 : 0) +
    (minReviewCount > 0 ? 1 : 0) +
    stars.length + reviewBuckets.length + propertyTypes.length + cities.length +
    selectedAmenities.length + popularFacilities.length + mealPlans.length +
    roomFeatures.length + accessibility.length + (maxDistance != null ? 1 : 0);

  const visibleAmenities = AMENITIES_LIST.filter((a) =>
    a.toLowerCase().includes(amenitySearch.toLowerCase())
  );

  return (
    <Layout>
      <div className="bg-secondary/30 py-8 border-b">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Discover Extraordinary Stays</h1>
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by city, hotel name, or landmark..."
              className="pl-10 h-12 bg-background text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filters Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <Button variant="outline" onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}>
              <Filter className="mr-2 h-4 w-4" />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={(val) => {
                  const [s, o] = val.split("-");
                  setSortBy(s as any);
                  setSortOrder(o as any);
                }}
              >
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity-desc">Most Popular</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating-desc">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sidebar Filters */}
          <aside
            className={`w-full lg:w-72 flex-shrink-0 ${isMobileFiltersOpen ? "block" : "hidden lg:block"}`}
          >
            <div className="lg:sticky lg:top-24 rounded-xl border bg-card">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </div>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2 text-xs">
                    <X className="h-3 w-3 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>

              <ScrollArea className="lg:h-[calc(100vh-12rem)]">
                <Accordion
                  type="multiple"
                  defaultValue={["price", "popular", "stars", "review", "amenities"]}
                  className="px-4"
                >
                  {/* Price */}
                  <AccordionItem value="price">
                    <AccordionTrigger className="text-sm font-semibold">Price per night</AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-3 px-1">
                        <Slider
                          min={0}
                          max={1000}
                          step={25}
                          value={priceRange}
                          onValueChange={setPriceRange}
                          className="mb-4"
                        />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>${priceRange[0]}</span>
                          <span>
                            ${priceRange[1]}
                            {priceRange[1] === 1000 ? "+" : ""}
                          </span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Popular facilities */}
                  <AccordionItem value="popular">
                    <AccordionTrigger className="text-sm font-semibold">Popular facilities</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        {POPULAR_FACILITIES.map((f) => (
                          <label key={f.label} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={popularFacilities.includes(f.label)}
                              onCheckedChange={() => toggle(setPopularFacilities)(f.label)}
                            />
                            <span className="text-sm">{f.label}</span>
                          </label>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Stars */}
                  <AccordionItem value="stars">
                    <AccordionTrigger className="text-sm font-semibold">Hotel class</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        {[5, 4, 3, 2, 1].map((s) => (
                          <label key={s} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={stars.includes(s)}
                              onCheckedChange={() => toggle(setStars)(s)}
                            />
                            <span className="text-sm">{s} star{s > 1 ? "s" : ""}</span>
                          </label>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Review score */}
                  <AccordionItem value="review">
                    <AccordionTrigger className="text-sm font-semibold">Guest review score</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        {REVIEW_BUCKETS.map((r) => (
                          <label key={r.label} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={reviewBuckets.includes(r.min)}
                              onCheckedChange={() => toggle(setReviewBuckets)(r.min)}
                            />
                            <span className="text-sm">{r.label}</span>
                          </label>
                        ))}
                        <div className="pt-3">
                          <Label className="text-xs text-muted-foreground">Score range</Label>
                          <div className="px-1 pt-3">
                            <Slider
                              min={0}
                              max={5}
                              step={0.1}
                              value={reviewRange}
                              onValueChange={setReviewRange}
                              className="mb-2"
                            />
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{reviewRange[0].toFixed(1)}</span>
                              <span>{reviewRange[1].toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="pt-3">
                          <Label className="text-xs text-muted-foreground">Minimum number of reviews</Label>
                          <Input
                            type="number"
                            min={0}
                            value={minReviewCount}
                            onChange={(e) => setMinReviewCount(Number(e.target.value) || 0)}
                            className="h-8 mt-1"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Property type */}
                  <AccordionItem value="type">
                    <AccordionTrigger className="text-sm font-semibold">Property type</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        {PROPERTY_TYPES.map((t) => (
                          <label key={t} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={propertyTypes.includes(t)}
                              onCheckedChange={() => toggle(setPropertyTypes)(t)}
                            />
                            <span className="text-sm">{t}</span>
                          </label>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* City */}
                  {availableCities.length > 0 && (
                    <AccordionItem value="city">
                      <AccordionTrigger className="text-sm font-semibold">City / Destination</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-1 max-h-56 overflow-y-auto pr-1">
                          {availableCities.map((c) => (
                            <label key={c} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox
                                checked={cities.includes(c)}
                                onCheckedChange={() => toggle(setCities)(c)}
                              />
                              <span className="text-sm">{c}</span>
                            </label>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Distance */}
                  <AccordionItem value="distance">
                    <AccordionTrigger className="text-sm font-semibold">Distance from center</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        {DISTANCE_OPTIONS.map((d) => (
                          <label key={d.label} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={maxDistance === d.max}
                              onCheckedChange={(checked) => setMaxDistance(checked ? d.max : undefined)}
                            />
                            <span className="text-sm">{d.label}</span>
                          </label>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Meals */}
                  <AccordionItem value="meals">
                    <AccordionTrigger className="text-sm font-semibold">Meals</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        {MEAL_PLANS.map((m) => (
                          <label key={m.label} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={mealPlans.includes(m.label)}
                              onCheckedChange={() => toggle(setMealPlans)(m.label)}
                            />
                            <span className="text-sm">{m.label}</span>
                          </label>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Room features */}
                  <AccordionItem value="rooms">
                    <AccordionTrigger className="text-sm font-semibold">Room features</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        {ROOM_FEATURES.map((m) => (
                          <label key={m.label} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={roomFeatures.includes(m.label)}
                              onCheckedChange={() => toggle(setRoomFeatures)(m.label)}
                            />
                            <span className="text-sm">{m.label}</span>
                          </label>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Accessibility */}
                  <AccordionItem value="access">
                    <AccordionTrigger className="text-sm font-semibold">Accessibility</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        {ACCESSIBILITY.map((m) => (
                          <label key={m.label} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={accessibility.includes(m.label)}
                              onCheckedChange={() => toggle(setAccessibility)(m.label)}
                            />
                            <span className="text-sm">{m.label}</span>
                          </label>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* All amenities */}
                  <AccordionItem value="amenities" className="border-b-0">
                    <AccordionTrigger className="text-sm font-semibold">All amenities</AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-1 space-y-2">
                        <Input
                          placeholder="Search amenities..."
                          value={amenitySearch}
                          onChange={(e) => setAmenitySearch(e.target.value)}
                          className="h-8 text-sm"
                        />
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                          {visibleAmenities.map((a) => (
                            <label key={a} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox
                                checked={selectedAmenities.includes(a)}
                                onCheckedChange={() => toggle(setSelectedAmenities)(a)}
                              />
                              <span className="text-sm">{a}</span>
                            </label>
                          ))}
                          {!visibleAmenities.length && (
                            <p className="text-xs text-muted-foreground">No matches</p>
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </ScrollArea>
            </div>
          </aside>

          {/* Results Area */}
          <div className="flex-1 min-w-0">
            <div className="hidden lg:flex items-center justify-between mb-6 pb-4 border-b">
              <p className="text-muted-foreground">
                {isLoading ? "Searching..." : `Showing ${filteredHotels.length} of ${hotels?.length || 0} properties`}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select
                  value={`${sortBy}-${sortOrder}`}
                  onValueChange={(val) => {
                    const [s, o] = val.split("-");
                    setSortBy(s as any);
                    setSortOrder(o as any);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity-desc">Most Popular</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating-desc">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {stars.map((s) => (
                  <Badge key={`s-${s}`} variant="secondary" className="gap-1">
                    {s}★
                    <button onClick={() => toggle(setStars)(s)}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
                {cities.map((c) => (
                  <Badge key={`c-${c}`} variant="secondary" className="gap-1">
                    {c}
                    <button onClick={() => toggle(setCities)(c)}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
                {propertyTypes.map((t) => (
                  <Badge key={`t-${t}`} variant="secondary" className="gap-1">
                    {t}
                    <button onClick={() => toggle(setPropertyTypes)(t)}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
                {popularFacilities.map((f) => (
                  <Badge key={`p-${f}`} variant="secondary" className="gap-1">
                    {f}
                    <button onClick={() => toggle(setPopularFacilities)(f)}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
                {mealPlans.map((m) => (
                  <Badge key={`m-${m}`} variant="secondary" className="gap-1">
                    {m}
                    <button onClick={() => toggle(setMealPlans)(m)}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
                {roomFeatures.map((m) => (
                  <Badge key={`rf-${m}`} variant="secondary" className="gap-1">
                    {m}
                    <button onClick={() => toggle(setRoomFeatures)(m)}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
                {accessibility.map((m) => (
                  <Badge key={`a-${m}`} variant="secondary" className="gap-1">
                    {m}
                    <button onClick={() => toggle(setAccessibility)(m)}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
                {selectedAmenities.map((a) => (
                  <Badge key={`am-${a}`} variant="secondary" className="gap-1">
                    {a}
                    <button onClick={() => toggle(setSelectedAmenities)(a)}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
                {maxDistance != null && (
                  <Badge variant="secondary" className="gap-1">
                    &lt;{maxDistance}km from center
                    <button onClick={() => setMaxDistance(undefined)}><X className="h-3 w-3" /></button>
                  </Badge>
                )}
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : filteredHotels.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border mt-4">
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No hotels match your filters</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Try removing some filters or expanding your price and review ranges.
                </p>
                <Button onClick={clearFilters} variant="outline">Clear all filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

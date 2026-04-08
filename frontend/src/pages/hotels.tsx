import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useListHotels, getListHotelsQueryKey } from "@/api";
import { Layout } from "@/components/layout/Layout";
import { HotelCard } from "@/components/ui/hotel-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

const AMENITIES_LIST = [
  "WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Parking", "Room Service", "Beach Access"
];

export default function Hotels() {
  const [location] = useLocation();
  const searchString = useSearch();

  const cityFromUrl = new URLSearchParams(searchString).get("city") || "";

  const [search, setSearch] = useState(cityFromUrl);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setSearch(cityFromUrl);
  }, [searchString]);
  
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const debouncedPriceRange = useDebounce(priceRange, 500);
  
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  const [sortBy, setSortBy] = useState<"price" | "rating" | "popularity">("popularity");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const apiMinRating = selectedRatings.length ? Math.min(...selectedRatings) : undefined;

  const { data: rawHotels, isLoading } = useListHotels(
    {
      search: debouncedSearch || undefined,
      minPrice: debouncedPriceRange[0],
      maxPrice: debouncedPriceRange[1] === 1000 ? undefined : debouncedPriceRange[1],
      minRating: apiMinRating,
      amenities: selectedAmenities.length ? selectedAmenities.join(",") : undefined,
      sortBy,
      sortOrder,
    },
    {
      query: {
        queryKey: getListHotelsQueryKey({
          search: debouncedSearch || undefined,
          minPrice: debouncedPriceRange[0],
          maxPrice: debouncedPriceRange[1] === 1000 ? undefined : debouncedPriceRange[1],
          minRating: apiMinRating,
          amenities: selectedAmenities.length ? selectedAmenities.join(",") : undefined,
          sortBy,
          sortOrder,
        })
      }
    }
  );

  const hotels = rawHotels?.filter(h =>
    (selectedStars.length === 0 || selectedStars.includes(h.stars)) &&
    (selectedRatings.length === 0 || selectedRatings.some(r => h.rating >= r))
  );

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const toggleStar = (star: number) => {
    setSelectedStars(prev =>
      prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
    );
  };

  const toggleRating = (rating: number) => {
    setSelectedRatings(prev =>
      prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setPriceRange([0, 1000]);
    setSelectedRatings([]);
    setSelectedStars([]);
    setSelectedAmenities([]);
    setSortBy("popularity");
    setSortOrder("desc");
  };

  const activeFiltersCount = (search ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0) + selectedRatings.length + selectedStars.length + selectedAmenities.length;

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
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(val) => {
                const [newSortBy, newSortOrder] = val.split("-");
                setSortBy(newSortBy as any);
                setSortOrder(newSortOrder as any);
              }}>
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
          <div className={`w-full lg:w-64 flex-shrink-0 space-y-8 ${isMobileFiltersOpen ? "block" : "hidden lg:block"}`}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Filters</h2>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs">
                  Clear all
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Price Range (per night)</Label>
              <div className="pt-4 px-2">
                <Slider 
                  min={0} 
                  max={1000} 
                  step={50} 
                  value={priceRange} 
                  onValueChange={setPriceRange}
                  className="mb-6"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}{priceRange[1] === 1000 ? "+" : ""}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Hotel Class</Label>
              <div className="space-y-2">
                {[5, 4, 3].map(star => (
                  <div key={star} className="flex items-center space-x-2">
                    <Checkbox
                      id={`star-${star}`}
                      checked={selectedStars.includes(star)}
                      onCheckedChange={() => toggleStar(star)}
                    />
                    <label htmlFor={`star-${star}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center">
                      {star} Stars
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Minimum Rating</Label>
              <div className="space-y-2">
                {[4.5, 4.0, 3.5].map(rating => (
                  <div key={rating} className="flex items-center space-x-2">
                    <Checkbox
                      id={`rating-${rating}`}
                      checked={selectedRatings.includes(rating)}
                      onCheckedChange={() => toggleRating(rating)}
                    />
                    <label htmlFor={`rating-${rating}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center">
                      {rating}+ Excellent
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Amenities</Label>
              <div className="space-y-2">
                {AMENITIES_LIST.map(amenity => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`amenity-${amenity}`} 
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <label htmlFor={`amenity-${amenity}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1">
            <div className="hidden lg:flex items-center justify-between mb-6 pb-4 border-b">
              <p className="text-muted-foreground">
                {isLoading ? "Searching..." : `Showing ${hotels?.length || 0} properties`}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={`${sortBy}-${sortOrder}`} onValueChange={(val) => {
                  const [newSortBy, newSortOrder] = val.split("-");
                  setSortBy(newSortBy as any);
                  setSortOrder(newSortOrder as any);
                }}>
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

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : hotels?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {hotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border mt-4">
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No hotels found</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Try adjusting your filters or searching for a different location to find available properties.
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

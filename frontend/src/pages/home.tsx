import { Layout } from "@/components/layout/Layout";
import { HotelCard } from "@/components/ui/hotel-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, CalendarDays, Users } from "lucide-react";
import { useGetHotelStats, getGetHotelStatsQueryKey } from "@/api";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: stats, isLoading } = useGetHotelStats({
    query: { queryKey: getGetHotelStatsQueryKey() }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/hotels?city=${encodeURIComponent(searchQuery)}`);
    } else {
      setLocation('/hotels');
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000"
            alt="Luxury hotel view" 
            className="w-full h-full object-cover object-center"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white mt-20">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 drop-shadow-lg">
            Find Your Next Perfect Stay
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-12 drop-shadow">
            Experience exceptional comfort and service at our handpicked selection of premium hotels worldwide.
          </p>

          <div className="max-w-4xl mx-auto bg-background/95 backdrop-blur-md p-4 rounded-2xl shadow-xl">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Where are you going?" 
                  className="pl-10 h-12 bg-white text-foreground text-lg border-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-8 text-lg w-full md:w-auto">
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border">
            <div className="px-4">
              <p className="text-4xl font-serif font-bold text-primary mb-2">
                {stats?.totalHotels || "100+"}
              </p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Premium Hotels</p>
            </div>
            <div className="px-4">
              <p className="text-4xl font-serif font-bold text-primary mb-2">
                {stats?.featuredCities?.length || "50+"}
              </p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Cities</p>
            </div>
            <div className="px-4">
              <p className="text-4xl font-serif font-bold text-primary mb-2">
                {stats?.totalBookings || "10K+"}
              </p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Happy Guests</p>
            </div>
            <div className="px-4">
              <p className="text-4xl font-serif font-bold text-primary mb-2">4.8</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-3">Popular Destinations</h2>
              <p className="text-muted-foreground">Explore hotels in our most sought-after cities</p>
            </div>
            <Button variant="outline" onClick={() => setLocation('/hotels')}>View all cities</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats?.featuredCities?.slice(0, 3).map((city, i) => (
              <div 
                key={city.city} 
                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setLocation(`/hotels?city=${encodeURIComponent(city.city)}`)}
              >
                <img 
                  src={`https://images.unsplash.com/photo-${i === 0 ? '1499856871958-5b9627545d1a' : i === 1 ? '1522083111336-66bf96287792' : '1513635269975-59663e0ac1ad'}?auto=format&fit=crop&q=80&w=800`}
                  alt={city.city}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-serif font-bold mb-1">{city.city}</h3>
                  <p className="text-white/80">{city.count} properties</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Picks */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-3">Top Rated Properties</h2>
              <p className="text-muted-foreground">Discover our guests' favorite accommodations</p>
            </div>
            <Button variant="outline" onClick={() => setLocation('/hotels')}>View all hotels</Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats?.topHotels?.slice(0, 4).map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

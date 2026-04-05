import { useState } from "react";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useGetHotel, getGetHotelQueryKey, useGetRoomsByHotel, getGetRoomsByHotelQueryKey, useGetHotelReviews, getGetHotelReviewsQueryKey, useCreateBooking, useGetSimilarHotels, getGetSimilarHotelsQueryKey, useCreateReview } from "@workspace/api-client-react";
import { useParams, Link, useLocation } from "wouter";
import { MapPin, Star, Wifi, Coffee, Dumbbell, Car, Utensils, Check, CalendarDays, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { HotelCard } from "@/components/ui/hotel-card";
import { Textarea } from "@/components/ui/textarea";

export default function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  const hotelId = parseInt(id, 10);
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  
  const [date, setDate] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(),
    to: addDays(new Date(), 3),
  });

  const { data: hotel, isLoading: isLoadingHotel } = useGetHotel(hotelId, {
    query: { enabled: !!hotelId, queryKey: getGetHotelQueryKey(hotelId) }
  });

  const checkInStr = date.from ? format(date.from, 'yyyy-MM-dd') : undefined;
  const checkOutStr = date.to ? format(date.to, 'yyyy-MM-dd') : undefined;

  const { data: rooms, isLoading: isLoadingRooms } = useGetRoomsByHotel(hotelId, {
    checkIn: checkInStr,
    checkOut: checkOutStr,
  }, {
    query: { enabled: !!hotelId, queryKey: getGetRoomsByHotelQueryKey(hotelId, { checkIn: checkInStr, checkOut: checkOutStr }) }
  });

  const { data: reviews } = useGetHotelReviews(hotelId, {
    query: { enabled: !!hotelId, queryKey: getGetHotelReviewsQueryKey(hotelId) }
  });

  const { data: similarHotels } = useGetSimilarHotels(hotelId, {
    query: { enabled: !!hotelId, queryKey: getGetSimilarHotelsQueryKey(hotelId) }
  });

  const createBooking = useCreateBooking();
  const createReview = useCreateReview();
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleBookRoom = (roomId: number) => {
    if (!isAuthenticated) {
      toast.error("Please log in to book a room");
      setLocation("/login");
      return;
    }

    if (!date.from || !date.to) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    createBooking.mutate({
      data: {
        roomId,
        checkIn: format(date.from, 'yyyy-MM-dd'),
        checkOut: format(date.to, 'yyyy-MM-dd'),
      }
    }, {
      onSuccess: (booking) => {
        setLocation(`/booking/${booking.id}`);
      },
      onError: (error) => {
        toast.error(error?.error || "Failed to initiate booking");
      }
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    
    createReview.mutate({
      data: {
        rating: reviewRating,
        comment: reviewComment,
      }
    }, {
      onSuccess: () => {
        toast.success("Review submitted successfully");
        setReviewComment("");
        setReviewRating(5);
        // Should invalidate query, but no helper for path param only, rely on user refresh or query cache
      },
      onError: (error) => {
        toast.error(error?.error || "Failed to submit review");
      }
    });
  };

  if (isLoadingHotel || !hotel) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 animate-pulse">
          <div className="h-10 w-2/3 bg-muted rounded mb-4"></div>
          <div className="h-6 w-1/3 bg-muted rounded mb-8"></div>
          <div className="aspect-[21/9] w-full bg-muted rounded-xl mb-8"></div>
        </div>
      </Layout>
    );
  }

  const getAmenityIcon = (name: string) => {
    const l = name.toLowerCase();
    if (l.includes("wifi")) return <Wifi className="h-5 w-5" />;
    if (l.includes("pool")) return <Wifi className="h-5 w-5" />; // Placeholder
    if (l.includes("spa")) return <Heart className="h-5 w-5" />;
    if (l.includes("gym") || l.includes("fitness")) return <Dumbbell className="h-5 w-5" />;
    if (l.includes("restaurant") || l.includes("dining")) return <Utensils className="h-5 w-5" />;
    if (l.includes("bar")) return <Coffee className="h-5 w-5" />;
    if (l.includes("parking")) return <Car className="h-5 w-5" />;
    return <Check className="h-5 w-5" />;
  };

  const nights = date.from && date.to ? Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <Layout>
      {/* Header & Gallery */}
      <div className="bg-background pb-12">
        <div className="container mx-auto px-4 pt-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  {hotel.stars} Star Hotel
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium">{hotel.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground text-sm">({hotel.reviewCount} reviews)</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 tracking-tight">
                {hotel.name}
              </h1>
              <div className="flex items-center text-muted-foreground text-lg">
                <MapPin className="mr-2 h-5 w-5" />
                <span>{hotel.address}, {hotel.city}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-3 bg-secondary/50 p-4 rounded-xl border border-border">
              <div className="text-sm text-muted-foreground">Starting from</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">${hotel.minPrice || 0}</span>
                <span className="text-muted-foreground">/night</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[60vh] min-h-[400px] mb-12">
            <div className="md:col-span-3 h-full rounded-2xl overflow-hidden relative group">
              <img 
                src={hotel.images[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80"} 
                alt={hotel.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="hidden md:flex flex-col gap-4 h-full">
              {hotel.images.slice(1, 3).map((img, i) => (
                <div key={i} className="flex-1 rounded-2xl overflow-hidden relative group">
                  <img 
                    src={img || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80"} 
                    alt={`${hotel.name} detail ${i+1}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ))}
              {hotel.images.length <= 1 && (
                <>
                  <div className="flex-1 rounded-2xl overflow-hidden relative bg-muted"></div>
                  <div className="flex-1 rounded-2xl overflow-hidden relative bg-muted"></div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* About */}
              <section>
                <h2 className="text-2xl font-serif font-bold mb-4">About this property</h2>
                <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                  {hotel.description}
                </p>
              </section>

              {/* Amenities */}
              <section>
                <h2 className="text-2xl font-serif font-bold mb-6">Popular Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                  {hotel.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center gap-3 text-foreground">
                      <div className="bg-secondary p-2 rounded-lg text-primary">
                        {getAmenityIcon(amenity)}
                      </div>
                      <span className="font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Reviews */}
              <section className="pt-8 border-t">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-serif font-bold">Guest Reviews</h2>
                  <div className="flex items-center gap-2">
                    <Star className="h-6 w-6 fill-primary text-primary" />
                    <span className="text-2xl font-bold">{hotel.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground ml-1">/ 5</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {reviews?.map(review => (
                    <div key={review.id} className="bg-secondary/30 p-6 rounded-xl border border-border/50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {review.user?.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="font-semibold">{review.user?.name}</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(review.createdAt), 'MMM d, yyyy')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-background px-2 py-1 rounded-md shadow-sm">
                          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                          <span className="text-sm font-medium">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                  {!reviews?.length && (
                    <p className="text-muted-foreground italic">No reviews yet. Be the first to leave a review!</p>
                  )}
                </div>

                {isAuthenticated && (
                  <div className="mt-8 bg-secondary/20 p-6 rounded-xl border border-border">
                    <h3 className="font-semibold mb-4">Leave a review</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button 
                              key={star} 
                              type="button" 
                              onClick={() => setReviewRating(star)}
                              className="focus:outline-none"
                            >
                              <Star className={`h-6 w-6 ${reviewRating >= star ? 'fill-primary text-primary' : 'text-muted'}`} />
                            </button>
                          ))}
                        </div>
                        <Textarea 
                          placeholder="Tell us about your experience..." 
                          value={reviewComment}
                          onChange={e => setReviewComment(e.target.value)}
                          className="resize-none"
                        />
                      </div>
                      <Button type="submit" disabled={createReview.isPending || !reviewComment.trim()}>
                        {createReview.isPending ? "Submitting..." : "Submit Review"}
                      </Button>
                    </form>
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar / Room Picker */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card border border-border rounded-2xl shadow-lg p-6 flex flex-col gap-6">
                <h3 className="text-xl font-serif font-bold">Select Dates</h3>
                
                <div className="grid gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal h-12 bg-background",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarDays className="mr-2 h-5 w-5 text-primary" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick your dates</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date as any}
                        onSelect={setDate as any}
                        numberOfMonths={1}
                        disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-xl font-serif font-bold">Available Rooms</h3>
                  {nights > 0 ? (
                    <p className="text-sm text-muted-foreground mb-4">Prices shown for {nights} night{nights > 1 ? 's' : ''}</p>
                  ) : null}

                  {isLoadingRooms ? (
                    <div className="space-y-4">
                      <div className="h-32 bg-muted rounded-xl animate-pulse"></div>
                      <div className="h-32 bg-muted rounded-xl animate-pulse"></div>
                    </div>
                  ) : rooms?.length ? (
                    <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                      {rooms.map(room => (
                        <div key={room.id} className={cn(
                          "border rounded-xl p-4 transition-all",
                          room.isAvailable ? "bg-background hover:border-primary/50" : "bg-muted/50 opacity-60"
                        )}>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold capitalize text-lg">{room.type} Room</h4>
                            <div className="text-right">
                              <span className="font-bold text-lg">${room.price * (nights || 1)}</span>
                              {nights > 0 && <div className="text-xs text-muted-foreground">${room.price}/night</div>}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <Users className="h-4 w-4" />
                            <span>Up to {room.guests} guests</span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {room.description}
                          </p>
                          
                          <Button 
                            className="w-full" 
                            disabled={!room.isAvailable || !date.from || !date.to || createBooking.isPending}
                            onClick={() => handleBookRoom(room.id)}
                            variant={room.isAvailable ? "default" : "secondary"}
                          >
                            {createBooking.isPending ? "Processing..." : room.isAvailable ? "Book Now" : "Unavailable"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No rooms available for selected dates.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Hotels */}
      {similarHotels && similarHotels.length > 0 && (
        <section className="py-16 bg-secondary/30 border-t">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-serif font-bold mb-8">You might also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarHotels.slice(0, 3).map((similarHotel) => (
                <HotelCard key={similarHotel.id} hotel={similarHotel} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

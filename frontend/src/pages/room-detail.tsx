import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import {
  useGetRoom, getGetRoomQueryKey,
  useGetHotel, getGetHotelQueryKey,
  useGetRoomsByHotel, getGetRoomsByHotelQueryKey,
  useCreateBooking,
} from "@/api";
import { format, addDays, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, Star, Users, BedDouble, Bath, Maximize2, Wifi, Coffee,
  Tv, Wind, Check, CalendarDays, ChevronLeft, ChevronRight, Shield,
  Clock, CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DateRangePopover } from "@/components/ui/date-range-popover";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ROOM_TYPE_INFO: Record<string, {
  label: string;
  size: string;
  beds: string;
  bathroom: string;
  floor: string;
  color: string;
  features: string[];
}> = {
  single: {
    label: "Single Room",
    size: "22–28 m²",
    beds: "1 Single Bed",
    bathroom: "Private bathroom with shower",
    floor: "Standard floor",
    color: "bg-blue-500/10 text-blue-700 border-blue-200",
    features: [
      "Work desk & ergonomic chair",
      "High-speed Wi-Fi",
      "Flat-screen TV with streaming",
      "Mini-fridge",
      "Electronic safe",
      "Premium toiletries",
      "Daily housekeeping",
      "Tea & coffee facilities",
    ],
  },
  double: {
    label: "Double Room",
    size: "32–40 m²",
    beds: "1 King or 2 Twin Beds",
    bathroom: "Ensuite bathroom with bath & shower",
    floor: "Standard or upper floor",
    color: "bg-green-500/10 text-green-700 border-green-200",
    features: [
      "Sitting area with sofa",
      "High-speed Wi-Fi",
      "55\" flat-screen TV",
      "Mini-bar",
      "Electronic safe",
      "Pillow menu",
      "Bathrobes & slippers",
      "Tea & coffee facilities",
      "Daily housekeeping",
    ],
  },
  deluxe: {
    label: "Deluxe Room",
    size: "45–55 m²",
    beds: "1 King Bed",
    bathroom: "Luxury marble bathroom with rain shower & bathtub",
    floor: "Upper floor with city/garden views",
    color: "bg-amber-500/10 text-amber-700 border-amber-200",
    features: [
      "Separate sitting lounge",
      "Ultra-fast Wi-Fi",
      "65\" OLED flat-screen TV",
      "Premium mini-bar",
      "Nespresso machine",
      "Electronic safe",
      "Plush bathrobes & slippers",
      "Luxury pillow menu",
      "Evening turndown service",
      "Daily housekeeping",
      "Welcome fruit basket",
    ],
  },
  suite: {
    label: "Suite",
    size: "80–150 m²",
    beds: "1 King Bed + Sofa Bed",
    bathroom: "Dual marble bathrooms with jacuzzi",
    floor: "Top floor or exclusive suite wing",
    color: "bg-purple-500/10 text-purple-700 border-purple-200",
    features: [
      "Separate bedroom & living room",
      "Private dining area",
      "Dedicated butler service",
      "Ultra-fast Wi-Fi throughout",
      "Multiple 65\" OLED TVs",
      "Full-size premium bar",
      "Nespresso & premium teas",
      "Jacuzzi & rain shower",
      "Plush bathrobes & designer slippers",
      "Signature turndown service",
      "Complimentary breakfast & evening cocktails",
      "Airport transfers included",
    ],
  },
};

export default function RoomDetail() {
  const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const hId = parseInt(hotelId, 10);
  const rId = parseInt(roomId, 10);

  const [activeImage, setActiveImage] = useState(0);
  const [date, setDate] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(),
    to: addDays(new Date(), 3),
  });

  useEffect(() => { window.scrollTo(0, 0); }, [roomId]);

  const checkInStr = date.from ? format(date.from, "yyyy-MM-dd") : undefined;
  const checkOutStr = date.to ? format(date.to, "yyyy-MM-dd") : undefined;

  const { data: room, isLoading: isLoadingRoom } = useGetRoom(
    rId,
    { checkIn: checkInStr, checkOut: checkOutStr },
    { query: { enabled: !!rId, queryKey: getGetRoomQueryKey(rId, { checkIn: checkInStr, checkOut: checkOutStr }) } }
  );

  const { data: hotel, isLoading: isLoadingHotel } = useGetHotel(hId, {
    query: { enabled: !!hId, queryKey: getGetHotelQueryKey(hId) }
  });

  const { data: allRooms } = useGetRoomsByHotel(hId, {}, {
    query: { enabled: !!hId, queryKey: getGetRoomsByHotelQueryKey(hId, {}) }
  });

  const createBooking = useCreateBooking();
  const nights = date.from && date.to ? differenceInDays(date.to, date.from) : 0;

  const handleBook = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to book a room");
      setLocation("/login");
      return;
    }
    if (!date.from || !date.to) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    createBooking.mutate(
      { data: { roomId: rId, checkIn: format(date.from, "yyyy-MM-dd"), checkOut: format(date.to, "yyyy-MM-dd") } },
      {
        onSuccess: (booking) => { setLocation(`/booking/${booking.id}`); },
        onError: (err: any) => { toast.error(err?.error || "Failed to create booking"); },
      }
    );
  };

  if (isLoadingRoom || isLoadingHotel || !room || !hotel) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-7xl animate-pulse space-y-6">
          <div className="h-6 w-1/3 bg-muted rounded" />
          <div className="aspect-[16/7] w-full bg-muted rounded-2xl" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-muted rounded-xl" />)}
          </div>
        </div>
      </Layout>
    );
  }

  const typeInfo = ROOM_TYPE_INFO[room.type] || ROOM_TYPE_INFO.single;
  const images = room.images?.length ? room.images : [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80",
  ];
  const totalPrice = room.price * (nights || 1);
  const taxes = totalPrice * 0.1;

  const otherRooms = allRooms?.filter((r) => r.id !== rId).slice(0, 3) || [];

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 max-w-7xl py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/hotels" className="hover:text-foreground transition-colors">Hotels</Link>
            <span>/</span>
            <Link href={`/hotels/${hId}`} className="hover:text-foreground transition-colors">{hotel.name}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{typeInfo.label}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back button + title */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <Button variant="ghost" size="sm" className="-ml-2 mb-3 text-muted-foreground" onClick={() => setLocation(`/hotels/${hId}`)}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to {hotel.name}
            </Button>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <Badge variant="outline" className={`${typeInfo.color} font-semibold px-3 py-1`}>
                {typeInfo.label}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-medium">{hotel.rating.toFixed(1)}</span>
                <span>({hotel.reviewCount} reviews)</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              {typeInfo.label} — {hotel.name}
            </h1>
            <p className="text-muted-foreground mt-1">{hotel.city}, {hotel.address}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-muted-foreground">Per night from</span>
            <span className="text-4xl font-bold text-primary">${room.price}</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-10">
          <div className="relative aspect-[16/7] rounded-2xl overflow-hidden group mb-3 bg-muted shadow-lg">
            <img
              src={images[activeImage]}
              alt={`${typeInfo.label} photo ${activeImage + 1}`}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage((p) => (p - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setActiveImage((p) => (p + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {activeImage + 1} / {images.length}
            </div>
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "flex-shrink-0 h-20 w-32 rounded-xl overflow-hidden border-2 transition-all",
                    i === activeImage ? "border-primary shadow-md scale-105" : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Room Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-secondary/40 rounded-xl p-4 text-center">
                <BedDouble className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Bed Type</p>
                <p className="font-semibold text-sm">{typeInfo.beds}</p>
              </div>
              <div className="bg-secondary/40 rounded-xl p-4 text-center">
                <Maximize2 className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Room Size</p>
                <p className="font-semibold text-sm">{typeInfo.size}</p>
              </div>
              <div className="bg-secondary/40 rounded-xl p-4 text-center">
                <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Max Guests</p>
                <p className="font-semibold text-sm">Up to {room.guests}</p>
              </div>
              <div className="bg-secondary/40 rounded-xl p-4 text-center">
                <Bath className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Bathroom</p>
                <p className="font-semibold text-sm">Private</p>
              </div>
            </div>

            {/* Description */}
            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">About this room</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{room.description}</p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                {typeInfo.bathroom}. Located on the {typeInfo.floor}.
                Perfect for guests seeking {room.type === 'suite' ? 'the ultimate luxury experience' : room.type === 'deluxe' ? 'elevated comfort and style' : 'comfortable and well-appointed accommodation'} during their stay at {hotel.name}.
              </p>
            </section>

            {/* What's Included */}
            <section>
              <h2 className="text-2xl font-serif font-bold mb-6">What's included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {typeInfo.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 bg-secondary/30 rounded-lg px-4 py-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* In-room Amenities Icons */}
            <section>
              <h2 className="text-2xl font-serif font-bold mb-6">In-Room Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: <Wifi className="h-6 w-6" />, label: "Free Wi-Fi" },
                  { icon: <Tv className="h-6 w-6" />, label: "Smart TV" },
                  { icon: <Wind className="h-6 w-6" />, label: "Air Conditioning" },
                  { icon: <Coffee className="h-6 w-6" />, label: "Coffee Maker" },
                  { icon: <Bath className="h-6 w-6" />, label: "Luxury Bathroom" },
                  { icon: <Shield className="h-6 w-6" />, label: "Electronic Safe" },
                  { icon: <Clock className="h-6 w-6" />, label: "24h Room Service" },
                  { icon: <CreditCard className="h-6 w-6" />, label: "Express Checkout" },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-2 text-center">
                    <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-primary">
                      {icon}
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Policies */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-serif font-bold mb-6">Policies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" /> Check-in / Check-out
                  </h3>
                  <p className="text-sm text-muted-foreground">Check-in: from 3:00 PM</p>
                  <p className="text-sm text-muted-foreground">Check-out: by 11:00 AM</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" /> Cancellation Policy
                  </h3>
                  <p className="text-sm text-muted-foreground">Free cancellation up to 48 hours before check-in. Late cancellations are charged one night.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right: Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-primary p-6 text-white">
                <div className="text-sm opacity-80 mb-1">Starting from</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold">${room.price}</span>
                  <span className="opacity-80">/ night</span>
                </div>
                {!room.isAvailable && (
                  <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200 mt-2">
                    Not available for selected dates
                  </Badge>
                )}
                {room.isAvailable && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 mt-2">
                    Available
                  </Badge>
                )}
              </div>

              <div className="p-6 space-y-5">
                {/* Date Picker */}
                <div>
                  <p className="text-sm font-semibold mb-2">Select Dates</p>
                  <DateRangePopover value={date} onChange={setDate} />
                </div>

                {/* Price Breakdown */}
                {nights > 0 && (
                  <div className="bg-secondary/30 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${room.price} × {nights} night{nights !== 1 ? "s" : ""}</span>
                      <span>${totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Taxes & Fees (10%)</span>
                      <span>${taxes.toFixed(2)}</span>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-primary">${(totalPrice + taxes).toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full h-12 text-base font-semibold"
                  disabled={!room.isAvailable || !date.from || !date.to || createBooking.isPending}
                  onClick={handleBook}
                >
                  {createBooking.isPending
                    ? "Processing…"
                    : !date.from || !date.to
                    ? "Select dates to book"
                    : room.isAvailable
                    ? `Reserve — $${(totalPrice + taxes).toFixed(2)}`
                    : "Not Available"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  You won't be charged yet · Free cancellation available
                </p>

                <div className="flex items-center justify-center gap-6 pt-2 border-t text-xs text-muted-foreground">
                  <div className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> Secure payment</div>
                  <div className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Best price guarantee</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Rooms in Hotel */}
        {otherRooms.length > 0 && (
          <section className="mt-16 pt-10 border-t">
            <h2 className="text-2xl font-serif font-bold mb-6">Other rooms at {hotel.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherRooms.map((r) => {
                const info = ROOM_TYPE_INFO[r.type] || ROOM_TYPE_INFO.single;
                return (
                  <Link key={r.id} href={`/hotels/${hId}/rooms/${r.id}`}>
                    <div className="group border rounded-2xl overflow-hidden bg-card hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={r.images?.[0] || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80"}
                          alt={info.label}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Badge variant="outline" className={`${info.color} text-xs mb-1`}>{info.label}</Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" /> Up to {r.guests} guests
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">${r.price}</p>
                            <p className="text-xs text-muted-foreground">/ night</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{r.description}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}

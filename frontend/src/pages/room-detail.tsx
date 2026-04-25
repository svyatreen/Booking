import { useState, useEffect } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { ru as ruLocale } from "date-fns/locale";
import { Layout } from "@/components/layout/Layout";
import {
  useGetRoom, getGetRoomQueryKey,
  useGetHotel, getGetHotelQueryKey,
  useGetRoomsByHotel, getGetRoomsByHotelQueryKey,
  useCreateBooking,
} from "@/api";
import { format, differenceInCalendarDays } from "date-fns";
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
import { useCurrency } from "@/contexts/CurrencyContext";
import { useStayDates } from "@/hooks/use-stay-dates";
import { toast } from "sonner";

const ROOM_TYPE_COLORS: Record<string, string> = {
  single: "bg-blue-500/10 text-blue-700 border-blue-200",
  double: "bg-green-500/10 text-green-700 border-green-200",
  deluxe: "bg-amber-500/10 text-amber-700 border-amber-200",
  suite: "bg-purple-500/10 text-purple-700 border-purple-200",
};

export default function RoomDetail() {
  const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { formatPrice } = useCurrency();
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.resolvedLanguage === "ru" ? ruLocale : undefined;
  const hId = parseInt(hotelId, 10);
  const rId = parseInt(roomId, 10);

  const [activeImage, setActiveImage] = useState(0);
  const [date, setDate] = useStayDates();

  useEffect(() => { window.scrollTo(0, 0); }, [roomId]);

  const checkInStr = date.from ? format(date.from, "yyyy-MM-dd") : undefined;
  const checkOutStr = date.to ? format(date.to, "yyyy-MM-dd") : undefined;

  const { data: room, isLoading: isLoadingRoom } = useGetRoom(
    rId,
    { checkIn: checkInStr, checkOut: checkOutStr },
    {
      query: {
        enabled: !!rId,
        queryKey: getGetRoomQueryKey(rId, { checkIn: checkInStr, checkOut: checkOutStr }),
        placeholderData: keepPreviousData,
      },
    }
  );

  const { data: hotel, isLoading: isLoadingHotel } = useGetHotel(hId, {
    query: { enabled: !!hId, queryKey: getGetHotelQueryKey(hId) }
  });

  const { data: allRooms } = useGetRoomsByHotel(hId, {}, {
    query: { enabled: !!hId, queryKey: getGetRoomsByHotelQueryKey(hId, {}) }
  });

  const createBooking = useCreateBooking();
  const nights = date.from && date.to ? differenceInCalendarDays(date.to, date.from) : 0;

  const handleBook = () => {
    if (!isAuthenticated) {
      toast.error(t("room.loginToBook"));
      setLocation("/login");
      return;
    }
    if (!date.from || !date.to) {
      toast.error(t("room.selectDatesError"));
      return;
    }
    createBooking.mutate(
      { data: { roomId: rId, checkIn: format(date.from, "yyyy-MM-dd"), checkOut: format(date.to, "yyyy-MM-dd") } },
      {
        onSuccess: (booking) => { setLocation(`/booking/${booking.id}`); },
        onError: (err: any) => { toast.error(err?.error || t("room.bookingFailed")); },
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

  const roomType = room.type in ROOM_TYPE_COLORS ? room.type : "single";
  const typeColor = ROOM_TYPE_COLORS[roomType];
  const typeLabel = t(`room.type.${roomType}`);
  const typeSize = t(`room.info.${roomType}.size`);
  const typeBeds = t(`room.info.${roomType}.beds`);
  const typeBathroom = t(`room.info.${roomType}.bathroom`);
  const typeFloor = t(`room.info.${roomType}.floor`);
  const typeFeatures = t(`room.info.${roomType}.features`, { returnObjects: true }) as string[];
  const typePurpose = t(`room.purpose.${roomType}`);

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
            <Link href="/hotels" className="hover:text-foreground transition-colors">{t("room.hotelsBreadcrumb")}</Link>
            <span>/</span>
            <Link href={`/hotels/${hId}`} className="hover:text-foreground transition-colors">{hotel.name}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{typeLabel}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back button + title */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <Button variant="ghost" size="sm" className="-ml-2 mb-3 text-muted-foreground" onClick={() => setLocation(`/hotels/${hId}`)}>
              <ArrowLeft className="mr-1 h-4 w-4" /> {t("room.back", { hotel: hotel.name })}
            </Button>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <Badge variant="outline" className={`${typeColor} font-semibold px-3 py-1`}>
                {typeLabel}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-medium">{hotel.rating.toFixed(1)}</span>
                <span>({t("hotel.reviewsCount", { count: hotel.reviewCount })})</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              {typeLabel} — {hotel.name}
            </h1>
            <p className="text-muted-foreground mt-1">{hotel.city}, {hotel.address}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-muted-foreground">{t("room.perNightFrom")}</span>
            <span className="text-4xl font-bold text-primary">{formatPrice(room.price)}</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-10">
          <div className="relative aspect-[16/7] rounded-2xl overflow-hidden group mb-3 bg-muted shadow-lg">
            <img
              src={images[activeImage]}
              alt={`${typeLabel} ${activeImage + 1}`}
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
                  <img src={img} alt={`${typeLabel} ${i + 1}`} className="w-full h-full object-cover" />
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
                <p className="text-xs text-muted-foreground mb-1">{t("room.bedType")}</p>
                <p className="font-semibold text-sm">{typeBeds}</p>
              </div>
              <div className="bg-secondary/40 rounded-xl p-4 text-center">
                <Maximize2 className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">{t("room.roomSize")}</p>
                <p className="font-semibold text-sm">{typeSize}</p>
              </div>
              <div className="bg-secondary/40 rounded-xl p-4 text-center">
                <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">{t("room.maxGuests")}</p>
                <p className="font-semibold text-sm">{t("room.upToGuestsShort", { count: room.guests })}</p>
              </div>
              <div className="bg-secondary/40 rounded-xl p-4 text-center">
                <Bath className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">{t("room.bathroom")}</p>
                <p className="font-semibold text-sm">{t("room.private")}</p>
              </div>
            </div>

            {/* Description */}
            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">{t("room.aboutRoom")}</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{room.description}</p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                {t("room.aboutFloorAndBath", { bathroom: typeBathroom, floor: typeFloor })}{" "}
                {t("room.perfectFor", { purpose: typePurpose, hotel: hotel.name })}
              </p>
            </section>

            {/* What's Included */}
            <section>
              <h2 className="text-2xl font-serif font-bold mb-6">{t("room.whatsIncluded")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {typeFeatures.map((feature) => (
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
              <h2 className="text-2xl font-serif font-bold mb-6">{t("room.inRoomAmenities")}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: <Wifi className="h-6 w-6" />, key: "wifi" },
                  { icon: <Tv className="h-6 w-6" />, key: "tv" },
                  { icon: <Wind className="h-6 w-6" />, key: "ac" },
                  { icon: <Coffee className="h-6 w-6" />, key: "coffee" },
                  { icon: <Bath className="h-6 w-6" />, key: "bath" },
                  { icon: <Shield className="h-6 w-6" />, key: "safe" },
                  { icon: <Clock className="h-6 w-6" />, key: "service" },
                  { icon: <CreditCard className="h-6 w-6" />, key: "checkout" },
                ].map(({ icon, key }) => (
                  <div key={key} className="flex flex-col items-center gap-2 text-center">
                    <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-primary">
                      {icon}
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{t(`room.amenity.${key}`)}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Policies */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-serif font-bold mb-6">{t("room.policies")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" /> {t("room.checkInOut")}
                  </h3>
                  <p className="text-sm text-muted-foreground">{t("room.checkInTime")}</p>
                  <p className="text-sm text-muted-foreground">{t("room.checkOutTime")}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" /> {t("room.cancellationPolicy")}
                  </h3>
                  <p className="text-sm text-muted-foreground">{t("room.cancellationText")}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right: Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-primary p-6 text-white">
                <div className="text-sm opacity-80 mb-1">{t("hotel.startingFrom")}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold">{formatPrice(room.price)}</span>
                  <span className="opacity-80">{t("room.perNightSlash")}</span>
                </div>
                {!room.isAvailable && (
                  <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200 mt-2">
                    {t("room.notAvailable")}
                  </Badge>
                )}
                {room.isAvailable && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 mt-2">
                    {t("room.available")}
                  </Badge>
                )}
              </div>

              <div className="p-6 space-y-5">
                {/* Date Picker */}
                <div>
                  <p className="text-sm font-semibold mb-2">{t("room.selectDates")}</p>
                  <DateRangePopover value={date} onChange={setDate} pricePerNight={room.price} />
                </div>

                {/* Price Breakdown */}
                {nights > 0 && (
                  <div className="bg-secondary/30 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t("room.perNights", { count: nights, price: formatPrice(room.price) })}</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t("room.taxesFees")}</span>
                      <span>{formatPrice(taxes)}</span>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex justify-between font-bold">
                      <span>{t("room.total")}</span>
                      <span className="text-primary">{formatPrice(totalPrice + taxes)}</span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full h-12 text-base font-semibold"
                  disabled={!room.isAvailable || !date.from || !date.to || createBooking.isPending}
                  onClick={handleBook}
                >
                  {createBooking.isPending
                    ? t("room.processing")
                    : !date.from || !date.to
                    ? t("room.selectToBook")
                    : room.isAvailable
                    ? t("room.reserve", { price: formatPrice(totalPrice + taxes) })
                    : t("room.notAvailableShort")}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  {t("room.noChargeYet")}
                </p>

                <div className="flex items-center justify-center gap-6 pt-2 border-t text-xs text-muted-foreground">
                  <div className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> {t("room.securePayment")}</div>
                  <div className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> {t("room.bestPriceGuarantee")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Rooms in Hotel */}
        {otherRooms.length > 0 && (
          <section className="mt-16 pt-10 border-t">
            <h2 className="text-2xl font-serif font-bold mb-6">{t("room.otherRooms", { hotel: hotel.name })}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherRooms.map((r) => {
                const rType = r.type in ROOM_TYPE_COLORS ? r.type : "single";
                const rColor = ROOM_TYPE_COLORS[rType];
                const rLabel = t(`room.type.${rType}`);
                return (
                  <Link key={r.id} href={`/hotels/${hId}/rooms/${r.id}`}>
                    <div className="group border rounded-2xl overflow-hidden bg-card hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={r.images?.[0] || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80"}
                          alt={rLabel}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Badge variant="outline" className={`${rColor} text-xs mb-1`}>{rLabel}</Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" /> {t("room.upToGuests", { count: r.guests })}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{formatPrice(r.price)}</p>
                            <p className="text-xs text-muted-foreground">{t("room.perNightSlash")}</p>
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

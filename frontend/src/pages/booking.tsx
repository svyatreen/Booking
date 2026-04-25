import { useMemo, useState, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { ru as ruLocale } from "date-fns/locale";
import { Layout } from "@/components/layout/Layout";
import { useGetBooking, getGetBookingQueryKey, usePayBooking, useCancelBooking } from "@/api";
import { usePaymentMethods } from "@/api/payment-methods";
import { buildCardColorMap } from "@/lib/card-colors";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CardForm, emptyCardForm, type CardFormValue } from "@/components/payment/CardForm";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CreditCard, CalendarDays, MapPin, CheckCircle2, AlertCircle, Building2, Users, Plus, Check } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrency } from "@/contexts/CurrencyContext";

const NEW_CARD = "__new__";

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const bookingId = parseInt(id, 10);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { formatPrice } = useCurrency();
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.resolvedLanguage === "ru" ? ruLocale : undefined;

  const [cancelOpen, setCancelOpen] = useState(false);
  const [cardForm, setCardForm] = useState<CardFormValue>(emptyCardForm);
  const [selectedCardId, setSelectedCardId] = useState<string>(NEW_CARD);

  const { data: booking, isLoading } = useGetBooking(bookingId, {
    query: { enabled: !!bookingId, queryKey: getGetBookingQueryKey(bookingId) }
  });
  const { data: savedCards = [] } = usePaymentMethods(!!booking && booking.status === "pending");
  const cardColorMap = buildCardColorMap(savedCards);

  // Auto-select default saved card on initial load
  useEffect(() => {
    if (savedCards.length > 0 && selectedCardId === NEW_CARD) {
      const def = savedCards.find((c) => c.isDefault) ?? savedCards[0];
      setSelectedCardId(String(def.id));
    }
  }, [savedCards.length]);

  const payBooking = usePayBooking();
  const cancelBooking = useCancelBooking();

  const usingSavedCard = selectedCardId !== NEW_CARD;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();

    let payload: any;
    if (usingSavedCard) {
      payload = { savedCardId: parseInt(selectedCardId, 10) };
    } else {
      if (!cardForm.cardholderName.trim() || !cardForm.cardNumber || !cardForm.expiryDate || !cardForm.cvv) {
        toast.error(t("booking.fillCardDetails"));
        return;
      }
      payload = {
        cardNumber: cardForm.cardNumber,
        expiryDate: cardForm.expiryDate,
        cvv: cardForm.cvv,
        cardholderName: cardForm.cardholderName,
        saveCard: cardForm.saveCard,
      };
    }

    payBooking.mutate({ id: bookingId, data: payload as any }, {
      onSuccess: () => {
        toast.success(t("booking.paymentSuccess"));
        queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(bookingId) });
        queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
        setCardForm(emptyCardForm);
      },
      onError: (error: any) => {
        toast.error(error?.data?.error || error?.message || t("booking.paymentFailed"));
      }
    });
  };

  const handleCancel = () => {
    cancelBooking.mutate({ id: bookingId }, {
      onSuccess: () => {
        toast.success(t("booking.cancelSuccess"));
        queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(bookingId) });
        setCancelOpen(false);
      },
      onError: (error: any) => {
        toast.error(error?.data?.error || error?.message || t("booking.cancelFailed"));
        setCancelOpen(false);
      }
    });
  };

  const nights = booking
    ? differenceInDays(new Date(booking.checkOut), new Date(booking.checkIn))
    : 0;
  const grandTotal = useMemo(
    () => ((booking?.room?.price || 0) * nights) * 1.1,
    [booking, nights]
  );

  if (isLoading || !booking) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-1/3 bg-muted rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 h-96 bg-muted rounded-xl"></div>
              <div className="h-96 bg-muted rounded-xl"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-secondary/30 border-b py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
                {t("booking.reference", { id: booking.id })}
                {booking.status === 'confirmed' && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                {booking.status === 'cancelled' && <AlertCircle className="h-6 w-6 text-red-500" />}
              </h1>
              <p className="text-muted-foreground mt-1">{t("booking.createdOn", { date: format(new Date(booking.createdAt), 'MMMM dd, yyyy', { locale: dateLocale }) })}</p>
            </div>
            <Badge
              variant="outline"
              className={`text-sm px-4 py-1.5 uppercase tracking-wider font-semibold ${
                booking.status === 'confirmed' ? 'bg-green-500/10 text-green-700 border-green-200' :
                booking.status === 'cancelled' ? 'bg-red-500/10 text-red-700 border-red-200' :
                'bg-yellow-500/10 text-yellow-700 border-yellow-200'
              }`}
            >
              {t(`booking.status.${booking.status}`, { defaultValue: booking.status })}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-[1040px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-border/50">
              <div className="h-48 md:h-64 relative">
                <img
                  src={booking.hotel?.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"}
                  alt={booking.hotel?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <h2 className="text-2xl font-serif font-bold mb-1">{booking.hotel?.name}</h2>
                  <div className="flex items-center text-white/90">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>{booking.hotel?.address}, {booking.hotel?.city}</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground uppercase tracking-wider">{t("booking.checkIn")}</span>
                    <p className="font-semibold">{format(new Date(booking.checkIn), 'MMM dd, yyyy', { locale: dateLocale })}</p>
                    <p className="text-sm text-muted-foreground">{t("booking.after3pm")}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground uppercase tracking-wider">{t("booking.checkOut")}</span>
                    <p className="font-semibold">{format(new Date(booking.checkOut), 'MMM dd, yyyy', { locale: dateLocale })}</p>
                    <p className="text-sm text-muted-foreground">{t("booking.before11am")}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground uppercase tracking-wider">{t("booking.roomType")}</span>
                    <p className="font-semibold">{booking.room?.type ? t(`room.type.${booking.room.type}`, { defaultValue: booking.room.type }) : ""}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-1 h-3.5 w-3.5" />
                      {t("room.upToGuests", { count: booking.room?.guests || 0 })}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground uppercase tracking-wider">{t("booking.duration")}</span>
                    <p className="font-semibold">{t("booking.nights", { count: nights })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>{t("booking.cancellationPolicy")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {t("booking.cancellationFull")}
                </p>
                {booking.status === 'confirmed' && (
                  <p className="mt-3 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3">
                    {t("booking.alreadyPaid")}
                  </p>
                )}
              </CardContent>
              {(booking.status === 'pending' || booking.status === 'confirmed') && (
                <CardFooter className="bg-secondary/30 border-t flex justify-end p-4">
                  <Button variant="destructive" onClick={() => setCancelOpen(true)} disabled={cancelBooking.isPending}>
                    {cancelBooking.isPending ? t("booking.cancelling") : t("booking.cancelReservation")}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>

          {/* Payment & Summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border/50 bg-secondary/10">
              <CardHeader>
                <CardTitle>{t("booking.priceSummary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const pricePerNight = booking.room?.price || 0;
                  const subtotal = pricePerNight * nights;
                  const taxes = subtotal * 0.1;
                  return (
                    <>
                      <div className="flex justify-between text-muted-foreground">
                        <span>{t("room.perNights", { count: nights, price: formatPrice(pricePerNight) })}</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>{t("booking.taxesFees")}</span>
                        <span>{formatPrice(taxes)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold text-lg text-foreground">
                        <span>{t("booking.total")}</span>
                        <span className="text-primary">{formatPrice(grandTotal)}</span>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>

            {booking.status === 'pending' && (
              <Card className="border-primary/20 shadow-md">
                <CardHeader className="bg-primary/5 border-b pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    {t("booking.paymentDetails")}
                  </CardTitle>
                  <CardDescription>{t("booking.paymentSubtitle")}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handlePayment} className="space-y-4">
                    {savedCards.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-foreground">{t("booking.choosePayment")}</div>
                        <div className="space-y-2">
                          {savedCards.map((card) => {
                            const isSel = selectedCardId === String(card.id);
                            return (
                              <button
                                type="button"
                                key={card.id}
                                onClick={() => setSelectedCardId(String(card.id))}
                                className={`w-full text-left rounded-lg border p-3 flex items-center gap-3 transition-all ${
                                  isSel ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border hover:border-primary/40"
                                }`}
                              >
                                <div className={`h-9 w-12 rounded-md text-[10px] font-bold flex items-center justify-center shadow-sm ${cardColorMap[card.id]}`}>
                                  {card.brand.toUpperCase().slice(0, 4)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-semibold whitespace-nowrap">
                                    {card.brand} •••• {card.last4}
                                    {card.isDefault && (
                                      <span className="ml-2 text-[10px] font-medium text-primary uppercase tracking-wider">
                                        {t("booking.default")}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground truncate">
                                    {card.cardholderName} · Exp {String(card.expMonth).padStart(2, "0")}/{String(card.expYear).slice(-2)}
                                  </div>
                                </div>
                                {isSel && <Check className="h-4 w-4 text-primary shrink-0" />}
                              </button>
                            );
                          })}

                          <button
                            type="button"
                            onClick={() => setSelectedCardId(NEW_CARD)}
                            className={`w-full text-left rounded-lg border border-dashed p-3 flex items-center gap-3 transition-all ${
                              selectedCardId === NEW_CARD ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border hover:border-primary/40"
                            }`}
                          >
                            <div className="h-9 w-12 rounded-md bg-secondary flex items-center justify-center">
                              <Plus className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 text-sm font-medium">{t("booking.useNewCard")}</div>
                            {selectedCardId === NEW_CARD && <Check className="h-4 w-4 text-primary" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {!usingSavedCard && (
                      <div className="pt-2">
                        <CardForm value={cardForm} onChange={setCardForm} showSaveOption />
                      </div>
                    )}

                    <Button type="submit" className="w-full mt-4 h-12 text-lg" disabled={payBooking.isPending}>
                      {payBooking.isPending ? t("booking.processing") : t("booking.pay", { amount: formatPrice(grandTotal) })}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {booking.status === 'confirmed' && (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t("booking.completed")}</h3>
                <p className="text-sm opacity-90 mb-4">{t("booking.completedBody")}</p>
                <Button variant="outline" className="w-full bg-white border-green-200 text-green-700 hover:bg-green-50" asChild>
                  <Link href="/profile">{t("booking.viewAllBookings")}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("booking.cancelDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("booking.cancelDialog.body")}
              {booking.status === 'confirmed' && t("booking.cancelDialog.refundNote")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelBooking.isPending}>{t("booking.cancelDialog.keep")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); handleCancel(); }}
              disabled={cancelBooking.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelBooking.isPending ? t("booking.cancelling") : t("booking.cancelDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}

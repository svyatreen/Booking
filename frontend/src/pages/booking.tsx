import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { useGetBooking, getGetBookingQueryKey, usePayBooking, useCancelBooking } from "@/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, CalendarDays, MapPin, CheckCircle2, AlertCircle, Building2, Users } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const bookingId = parseInt(id, 10);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const { data: booking, isLoading } = useGetBooking(bookingId, {
    query: { enabled: !!bookingId, queryKey: getGetBookingQueryKey(bookingId) }
  });

  const payBooking = usePayBooking();
  const cancelBooking = useCancelBooking();

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !expiryDate || !cvv) {
      toast.error("Please fill in all payment fields");
      return;
    }

    payBooking.mutate({
      id: bookingId,
      data: { cardNumber, expiryDate, cvv }
    }, {
      onSuccess: () => {
        toast.success("Payment successful! Your booking is confirmed.");
        queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(bookingId) });
      },
      onError: (error) => {
        toast.error(error?.error || "Payment failed. Please try again.");
      }
    });
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      cancelBooking.mutate({ id: bookingId }, {
        onSuccess: () => {
          toast.success("Booking cancelled successfully.");
          queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(bookingId) });
        },
        onError: (error) => {
          toast.error(error?.error || "Failed to cancel booking.");
        }
      });
    }
  };

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

  const nights = differenceInDays(new Date(booking.checkOut), new Date(booking.checkIn));

  return (
    <Layout>
      <div className="bg-secondary/30 border-b py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
                Booking Reference #{booking.id}
                {booking.status === 'confirmed' && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                {booking.status === 'cancelled' && <AlertCircle className="h-6 w-6 text-red-500" />}
              </h1>
              <p className="text-muted-foreground mt-1">Created on {format(new Date(booking.createdAt), 'MMMM dd, yyyy')}</p>
            </div>
            <Badge 
              variant="outline" 
              className={`text-sm px-4 py-1.5 uppercase tracking-wider font-semibold ${
                booking.status === 'confirmed' ? 'bg-green-500/10 text-green-700 border-green-200' :
                booking.status === 'cancelled' ? 'bg-red-500/10 text-red-700 border-red-200' :
                'bg-yellow-500/10 text-yellow-700 border-yellow-200'
              }`}
            >
              {booking.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
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
                    <span className="text-sm text-muted-foreground uppercase tracking-wider">Check In</span>
                    <p className="font-semibold">{format(new Date(booking.checkIn), 'MMM dd, yyyy')}</p>
                    <p className="text-sm text-muted-foreground">After 3:00 PM</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground uppercase tracking-wider">Check Out</span>
                    <p className="font-semibold">{format(new Date(booking.checkOut), 'MMM dd, yyyy')}</p>
                    <p className="text-sm text-muted-foreground">Before 11:00 AM</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground uppercase tracking-wider">Room Type</span>
                    <p className="font-semibold capitalize">{booking.room?.type}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-1 h-3.5 w-3.5" />
                      Up to {booking.room?.guests} guests
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground uppercase tracking-wider">Duration</span>
                    <p className="font-semibold">{nights} Night{nights !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Cancellation Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Free cancellation up to 48 hours before check-in. Cancellations made within 48 hours of check-in will be subject to a one-night fee. If you fail to check in (no-show), you will be charged the full amount of your reservation.
                </p>
                {booking.status === 'confirmed' && (
                  <p className="mt-3 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3">
                    This booking has already been paid. Cancellation may result in a partial or full refund depending on the timing.
                  </p>
                )}
              </CardContent>
              {(booking.status === 'pending' || booking.status === 'confirmed') && (
                <CardFooter className="bg-secondary/30 border-t flex justify-end p-4">
                  <Button variant="destructive" onClick={handleCancel} disabled={cancelBooking.isPending}>
                    {cancelBooking.isPending ? "Cancelling..." : "Cancel Reservation"}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>

          {/* Payment & Summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border/50 bg-secondary/10">
              <CardHeader>
                <CardTitle>Price Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>${booking.room?.price} × {nights} nights</span>
                  <span>${(booking.room?.price || 0) * nights}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxes & Fees (10%)</span>
                  <span>${((booking.room?.price || 0) * nights * 0.1).toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg text-foreground">
                  <span>Total</span>
                  <span className="text-primary">${booking.totalPrice}</span>
                </div>
              </CardContent>
            </Card>

            {booking.status === 'pending' && (
              <Card className="border-primary/20 shadow-md">
                <CardHeader className="bg-primary/5 border-b pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Details
                  </CardTitle>
                  <CardDescription>Complete your booking securely</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handlePayment} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input 
                        id="cardNumber" 
                        placeholder="0000 0000 0000 0000" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                        <Input 
                          id="expiry" 
                          placeholder="MM/YY" 
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input 
                          id="cvv" 
                          placeholder="123" 
                          type="password"
                          maxLength={4}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full mt-6 h-12 text-lg" disabled={payBooking.isPending}>
                      {payBooking.isPending ? "Processing..." : `Pay $${booking.totalPrice}`}
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
                <h3 className="font-bold text-lg mb-2">Payment Completed</h3>
                <p className="text-sm opacity-90 mb-4">A confirmation email has been sent to your inbox with your itinerary.</p>
                <Button variant="outline" className="w-full bg-white border-green-200 text-green-700 hover:bg-green-50" asChild>
                  <Link href="/profile">View All Bookings</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

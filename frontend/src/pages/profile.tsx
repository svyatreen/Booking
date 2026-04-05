import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useGetMyBookings, getGetMyBookingsQueryKey, useUpdateMe } from "@/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, CreditCard, Building2, User, Mail, Shield } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const updateMe = useUpdateMe();
  
  const { data: bookings, isLoading } = useGetMyBookings({
    query: { queryKey: getGetMyBookingsQueryKey() }
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateMe.mutate({
      data: { name }
    }, {
      onSuccess: () => {
        toast.success("Profile updated successfully");
      },
      onError: () => {
        toast.error("Failed to update profile");
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-200';
      case 'pending': return 'bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 border-yellow-200';
      case 'cancelled': return 'bg-red-500/10 text-red-700 hover:bg-red-500/20 border-red-200';
      default: return '';
    }
  };

  return (
    <Layout>
      <div className="bg-secondary/30 py-12 border-b">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-serif font-bold shadow-lg">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Hello, {user?.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                {user?.role === 'ADMIN' && (
                  <Badge variant="outline" className="border-primary/50 text-primary">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="h-40"></CardContent>
                  </Card>
                ))}
              </div>
            ) : bookings?.length ? (
              <div className="space-y-6">
                {bookings.map(booking => (
                  <Card key={booking.id} className="overflow-hidden border-border/50 transition-all hover:shadow-md">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-64 h-48 md:h-auto shrink-0 relative">
                        <img 
                          src={booking.hotel?.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"} 
                          alt={booking.hotel?.name} 
                          className="w-full h-full object-cover"
                        />
                        <Badge className={`absolute top-3 left-3 ${getStatusColor(booking.status)} capitalize`}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-serif text-xl font-bold mb-1">
                              <Link href={`/hotels/${booking.hotel?.id}`} className="hover:text-primary transition-colors">
                                {booking.hotel?.name}
                              </Link>
                            </h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-1 h-3.5 w-3.5" />
                              {booking.hotel?.city}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">${booking.totalPrice}</div>
                            <div className="text-sm text-muted-foreground capitalize">{booking.room?.type} Room</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 bg-secondary/30 p-4 rounded-lg">
                          <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Check-in</div>
                            <div className="font-medium flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              {format(new Date(booking.checkIn), 'MMM dd, yyyy')}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Check-out</div>
                            <div className="font-medium flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
                            </div>
                          </div>
                        </div>

                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-border/50">
                          <span className="text-sm text-muted-foreground">
                            Booked {formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true })}
                          </span>
                          <Button variant={booking.status === 'pending' ? 'default' : 'outline'} asChild>
                            <Link href={`/booking/${booking.id}`}>
                              {booking.status === 'pending' ? 'Complete Payment' : 'View Details'}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-dashed border-border">
                <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  When you book a hotel, your itinerary and details will appear here.
                </p>
                <Button asChild>
                  <Link href="/hotels">Find a Hotel</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        value={user?.email || ""} 
                        disabled 
                        className="pl-10 bg-muted/50 text-muted-foreground"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
                  </div>
                  <Button type="submit" disabled={updateMe.isPending}>
                    {updateMe.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

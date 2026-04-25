import { Layout } from "@/components/layout/Layout";
import { useTranslation } from "react-i18next";
import { ru as ruLocale } from "date-fns/locale";
import { useListHotels, getListHotelsQueryKey, useListAllBookings, getListAllBookingsQueryKey, useListUsers, getListUsersQueryKey } from "@/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, CalendarDays, DollarSign, Plus } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";

export default function Admin() {
  const { formatPrice } = useCurrency();
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.resolvedLanguage === "ru" ? ruLocale : undefined;
  const { data: hotels, isLoading: isLoadingHotels } = useListHotels({}, {
    query: { queryKey: getListHotelsQueryKey({}) }
  });

  const { data: bookings, isLoading: isLoadingBookings } = useListAllBookings({
    query: { queryKey: getListAllBookingsQueryKey() }
  });

  const { data: users, isLoading: isLoadingUsers } = useListUsers({
    query: { queryKey: getListUsersQueryKey() }
  });

  const totalRevenue = bookings?.reduce((acc, booking) => 
    booking.status === 'confirmed' ? acc + booking.totalPrice : acc, 0
  ) || 0;

  return (
    <Layout>
      <div className="bg-secondary/30 border-b py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-3xl font-serif font-bold text-foreground">{t("admin.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("admin.subtitle")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("admin.totalRevenue")}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(totalRevenue, { decimals: 0 })}</div>
              <p className="text-xs text-muted-foreground mt-1">{t("admin.fromConfirmed")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("admin.activeHotels")}</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hotels?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("admin.totalBookings")}</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("admin.registeredUsers")}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="hotels" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="hotels">{t("admin.tabs.hotels")}</TabsTrigger>
            <TabsTrigger value="bookings">{t("admin.tabs.bookings")}</TabsTrigger>
            <TabsTrigger value="users">{t("admin.tabs.users")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hotels" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t("admin.hotels.title")}</CardTitle>
                  <CardDescription>{t("admin.hotels.subtitle")}</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("admin.hotels.addHotel")}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("admin.hotels.col.hotel")}</TableHead>
                        <TableHead>{t("admin.hotels.col.location")}</TableHead>
                        <TableHead>{t("admin.hotels.col.rating")}</TableHead>
                        <TableHead>{t("admin.hotels.col.minPrice")}</TableHead>
                        <TableHead className="text-right">{t("admin.hotels.col.actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingHotels ? (
                        <TableRow><TableCell colSpan={5} className="text-center">{t("admin.loading")}</TableCell></TableRow>
                      ) : hotels?.map((hotel) => (
                        <TableRow key={hotel.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-primary/5">{hotel.stars}★</Badge>
                              {hotel.name}
                            </div>
                          </TableCell>
                          <TableCell>{hotel.city}</TableCell>
                          <TableCell>{hotel.rating.toFixed(1)} ({hotel.reviewCount})</TableCell>
                          <TableCell>{formatPrice(hotel.minPrice || 0)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">{t("admin.hotels.edit")}</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.bookings.title")}</CardTitle>
                <CardDescription>{t("admin.bookings.subtitle")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("admin.bookings.col.id")}</TableHead>
                        <TableHead>{t("admin.bookings.col.hotel")}</TableHead>
                        <TableHead>{t("admin.bookings.col.dates")}</TableHead>
                        <TableHead>{t("admin.bookings.col.value")}</TableHead>
                        <TableHead>{t("admin.bookings.col.status")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingBookings ? (
                        <TableRow><TableCell colSpan={5} className="text-center">{t("admin.loading")}</TableCell></TableRow>
                      ) : bookings?.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">#{booking.id}</TableCell>
                          <TableCell>{booking.hotel?.name}</TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(booking.checkIn), 'MMM d', { locale: dateLocale })} - {format(new Date(booking.checkOut), 'MMM d, yyyy', { locale: dateLocale })}
                            </span>
                          </TableCell>
                          <TableCell className="font-semibold">{formatPrice(booking.totalPrice)}</TableCell>
                          <TableCell>
                            <Badge variant={
                              booking.status === 'confirmed' ? 'default' : 
                              booking.status === 'cancelled' ? 'destructive' : 'secondary'
                            } className="capitalize">
                              {t(`booking.status.${booking.status}`, { defaultValue: booking.status })}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.users.title")}</CardTitle>
                <CardDescription>{t("admin.users.subtitle")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("admin.users.col.name")}</TableHead>
                        <TableHead>{t("admin.users.col.email")}</TableHead>
                        <TableHead>{t("admin.users.col.role")}</TableHead>
                        <TableHead>{t("admin.users.col.joined")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingUsers ? (
                        <TableRow><TableCell colSpan={4} className="text-center">{t("admin.loading")}</TableCell></TableRow>
                      ) : users?.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.name}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>
                            <Badge variant={u.role === 'ADMIN' ? 'default' : 'outline'}>
                              {u.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(u.createdAt), 'MMM dd, yyyy', { locale: dateLocale })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

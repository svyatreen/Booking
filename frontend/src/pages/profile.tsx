import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useGetMyBookings, getGetMyBookingsQueryKey, useUpdateMe, getGetMeQueryKey } from "@/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin, Calendar, Building2, User, Mail, Shield,
  Sun, Moon, Lock, LogOut, Hotel,
  BedDouble, DollarSign, Eye, EyeOff, CheckCircle2,
} from "lucide-react";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function Profile() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const updateMe = useUpdateMe();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const { data: bookings, isLoading } = useGetMyBookings({
    query: { queryKey: getGetMyBookingsQueryKey() },
  });

  const confirmedBookings = bookings?.filter((b) => b.status === "confirmed") ?? [];
  const totalSpent = confirmedBookings.reduce((sum, b) => sum + Number(b.totalPrice), 0);
  const totalNights = confirmedBookings.reduce((sum, b) => {
    return sum + differenceInDays(new Date(b.checkOut), new Date(b.checkIn));
  }, 0);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: { name?: string; email?: string } = {};
    if (name !== user?.name) updates.name = name;
    if (email !== user?.email) updates.email = email;

    if (Object.keys(updates).length === 0) {
      toast.info("No changes to save.");
      return;
    }

    updateMe.mutate(
      { data: updates },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          toast.success("Profile updated successfully");
        },
        onError: () => {
          toast.error("Failed to update profile");
        },
      }
    );
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setIsChangingPassword(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/users/me/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to change password");
      } else {
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-200";
      case "pending": return "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 border-yellow-200";
      case "cancelled": return "bg-red-500/10 text-red-700 hover:bg-red-500/20 border-red-200";
      default: return "";
    }
  };

  const avatarColors = [
    "from-orange-400 to-amber-500",
    "from-blue-500 to-indigo-600",
    "from-emerald-400 to-teal-500",
    "from-rose-400 to-pink-500",
    "from-violet-500 to-purple-600",
  ];
  const avatarGradient = avatarColors[(user?.id ?? 0) % avatarColors.length];

  return (
    <Layout>
      <div className="bg-gradient-to-br from-secondary/40 to-secondary/10 py-12 border-b">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-6">
            <div className={`h-24 w-24 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white text-3xl font-serif font-bold shadow-lg ring-4 ring-white dark:ring-gray-900`}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                {user?.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                <div className="flex items-center gap-1.5 text-sm">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{user?.email}</span>
                </div>
                <span className="text-border">·</span>
                <div className="flex items-center gap-1.5 text-sm">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Member since {user?.createdAt ? format(new Date(user.createdAt), "MMMM yyyy") : "—"}</span>
                </div>
                {user?.role === "ADMIN" && (
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

          {/* ── BOOKINGS TAB ── */}
          <TabsContent value="bookings" className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="h-40" />
                  </Card>
                ))}
              </div>
            ) : bookings?.length ? (
              <div className="space-y-6">
                {bookings.map((booking) => (
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
                              {format(new Date(booking.checkIn), "MMM dd, yyyy")}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Check-out</div>
                            <div className="font-medium flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              {format(new Date(booking.checkOut), "MMM dd, yyyy")}
                            </div>
                          </div>
                        </div>
                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-border/50">
                          <span className="text-sm text-muted-foreground">
                            Booked {formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true })}
                          </span>
                          <Button variant={booking.status === "pending" ? "default" : "outline"} asChild>
                            <Link href={`/booking/${booking.id}`}>
                              {booking.status === "pending" ? "Complete Payment" : "View Details"}
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

          {/* ── SETTINGS TAB ── */}
          <TabsContent value="settings" className="space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: <Hotel className="h-5 w-5 text-blue-500" />,
                  bg: "bg-blue-50 dark:bg-blue-900/20",
                  label: "Total Trips",
                  value: bookings?.length ?? 0,
                },
                {
                  icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
                  bg: "bg-green-50 dark:bg-green-900/20",
                  label: "Confirmed",
                  value: confirmedBookings.length,
                },
                {
                  icon: <NightShelter className="h-5 w-5 text-violet-500" />,
                  bg: "bg-violet-50 dark:bg-violet-900/20",
                  label: "Nights Stayed",
                  value: totalNights,
                },
                {
                  icon: <DollarSign className="h-5 w-5 text-amber-500" />,
                  bg: "bg-amber-50 dark:bg-amber-900/20",
                  label: "Total Spent",
                  value: `$${totalSpent.toLocaleString()}`,
                },
              ].map((stat) => (
                <Card key={stat.label} className="border-border/50">
                  <CardContent className="p-5">
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Profile Information */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your name and email address.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-5 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={updateMe.isPending}>
                    {updateMe.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {theme === "dark" ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
                  Appearance
                </CardTitle>
                <CardDescription>Choose how StayLux looks for you.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between max-w-md p-4 rounded-xl border border-border/60 bg-secondary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      {theme === "dark" ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{theme === "dark" ? "Dark Mode" : "Light Mode"}</div>
                      <div className="text-xs text-muted-foreground">
                        {theme === "dark" ? "Easier on the eyes at night" : "Bright and clear"}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      theme === "dark" ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                    aria-label="Toggle theme"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                        theme === "dark" ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Password & Security */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Password & Security
                </CardTitle>
                <CardDescription>Change your password to keep your account safe.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="currentPassword"
                        type={showCurrentPw ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="pl-10 pr-10"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type={showNewPw ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10 pr-10"
                        placeholder="Min. 6 characters"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {newPassword.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              newPassword.length >= level * 2
                                ? level <= 1 ? "bg-red-400"
                                  : level <= 2 ? "bg-amber-400"
                                  : level <= 3 ? "bg-blue-400"
                                  : "bg-green-400"
                                : "bg-border"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`pl-10 ${confirmPassword && newPassword !== confirmPassword ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                        placeholder="Repeat new password"
                        required
                      />
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-500">Passwords do not match</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={isChangingPassword || (!!confirmPassword && newPassword !== confirmPassword)}
                  >
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200 dark:border-red-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </CardTitle>
                <CardDescription>
                  You'll need to log in again to access your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out of StayLux
                </Button>
              </CardContent>
            </Card>

          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

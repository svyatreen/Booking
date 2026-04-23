import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import {
  useGetMyBookings,
  getGetMyBookingsQueryKey,
  useUpdateMe,
  getGetMeQueryKey,
} from "@/api";
import { customFetch } from "@/api/custom-fetch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  MapPin,
  Calendar,
  Building2,
  User,
  Mail,
  Shield,
  Camera,
  Phone,
  Lock,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  DollarSign,
  Compass,
  CalendarCheck,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const MAX_AVATAR_SIZE = 256;
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

async function resizeImageFile(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const size = Math.min(img.width, img.height);
      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;
      const canvas = document.createElement("canvas");
      canvas.width = MAX_AVATAR_SIZE;
      canvas.height = MAX_AVATAR_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }
      ctx.drawImage(img, sx, sy, size, size, 0, 0, MAX_AVATAR_SIZE, MAX_AVATAR_SIZE);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

interface UserStats {
  totalBookings: number;
  totalSpent: number;
  citiesCount: number;
}

export default function Profile() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState(user?.bio || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwSubmitting, setPwSubmitting] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateMe = useUpdateMe();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const { data: bookings, isLoading } = useGetMyBookings({
    query: { queryKey: getGetMyBookingsQueryKey() },
  });

  const { data: stats } = useQuery<UserStats>({
    queryKey: ["users", "me", "stats"],
    queryFn: async () => {
      return await customFetch<UserStats>("/api/users/me/stats", { method: "GET" });
    },
    enabled: !!user,
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: {
      name?: string;
      email?: string;
      phone?: string | null;
      bio?: string | null;
    } = {};
    if (name !== user?.name) updates.name = name;
    if (email !== user?.email) updates.email = email;
    if ((phone || "") !== (user?.phone || "")) updates.phone = phone || null;
    if ((bio || "") !== (user?.bio || "")) updates.bio = bio || null;

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
        onError: (err: any) => {
          const msg = err?.payload?.error || err?.message || "Failed to update profile";
          toast.error(msg);
        },
      }
    );
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error("Image is too large (max 5MB)");
      return;
    }
    setAvatarUploading(true);
    try {
      const dataUrl = await resizeImageFile(file);
      await new Promise<void>((resolve, reject) => {
        updateMe.mutate(
          { data: { avatarUrl: dataUrl } },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
              toast.success("Avatar updated");
              resolve();
            },
            onError: (err: any) => {
              const msg = err?.payload?.error || err?.message || "Failed to upload avatar";
              toast.error(msg);
              reject(err);
            },
          }
        );
      });
    } catch {
      // toast already handled
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    updateMe.mutate(
      { data: { avatarUrl: null } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          toast.success("Avatar removed");
        },
        onError: () => toast.error("Failed to remove avatar"),
      }
    );
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (currentPassword === newPassword) {
      toast.error("New password must be different from current");
      return;
    }
    setPwSubmitting(true);
    try {
      await customFetch("/api/users/me/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      toast.success("Password changed. Please sign in again.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        logout();
        navigate("/login");
      }, 800);
    } catch (err: any) {
      const msg = err?.payload?.error || err?.message || "Failed to change password";
      toast.error(msg);
    } finally {
      setPwSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Please enter your password to confirm");
      return;
    }
    setDeleteSubmitting(true);
    try {
      await customFetch("/api/users/me", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });
      toast.success("Your account has been deleted");
      setDeleteOpen(false);
      setTimeout(() => {
        logout();
        navigate("/");
      }, 500);
    } catch (err: any) {
      const msg = err?.payload?.error || err?.message || "Failed to delete account";
      toast.error(msg);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-200";
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 border-yellow-200";
      case "cancelled":
        return "bg-red-500/10 text-red-700 hover:bg-red-500/20 border-red-200";
      default:
        return "";
    }
  };

  return (
    <Layout>
      <div className="bg-secondary/30 py-12 border-b">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative group">
              <Avatar
                key={user?.avatarUrl || "no-avatar-hero"}
                className="h-28 w-28 border-4 border-background shadow-lg"
              >
                {user?.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                ) : null}
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="h-12 w-12" strokeWidth={1.75} />
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-105 transition-transform disabled:opacity-60"
                aria-label="Change avatar"
              >
                {avatarUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                Hello, {user?.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user?.role === "ADMIN" && (
                  <Badge variant="outline" className="border-primary/50 text-primary">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
              {user?.bio && (
                <p className="mt-3 text-sm text-muted-foreground max-w-xl">
                  {user.bio}
                </p>
              )}
              <div className="mt-5 grid grid-cols-3 gap-3 max-w-md mx-auto md:mx-0">
                <div className="bg-background rounded-lg p-3 border text-center">
                  <CalendarCheck className="h-4 w-4 text-primary mx-auto mb-1" />
                  <div className="text-xl font-bold">{stats?.totalBookings ?? 0}</div>
                  <div className="text-xs text-muted-foreground">Bookings</div>
                </div>
                <div className="bg-background rounded-lg p-3 border text-center">
                  <DollarSign className="h-4 w-4 text-primary mx-auto mb-1" />
                  <div className="text-xl font-bold">${stats?.totalSpent ?? 0}</div>
                  <div className="text-xs text-muted-foreground">Spent</div>
                </div>
                <div className="bg-background rounded-lg p-3 border text-center">
                  <Compass className="h-4 w-4 text-primary mx-auto mb-1" />
                  <div className="text-xl font-bold">{stats?.citiesCount ?? 0}</div>
                  <div className="text-xs text-muted-foreground">Cities</div>
                </div>
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
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="h-40"></CardContent>
                  </Card>
                ))}
              </div>
            ) : bookings?.length ? (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <Card
                    key={booking.id}
                    className="overflow-hidden border-border/50 transition-all hover:shadow-md"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-64 h-48 md:h-auto shrink-0 relative">
                        <img
                          src={
                            booking.hotel?.images?.[0] ||
                            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
                          }
                          alt={booking.hotel?.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge
                          className={`absolute top-3 left-3 ${getStatusColor(booking.status)} capitalize`}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-serif text-xl font-bold mb-1">
                              <Link
                                href={`/hotels/${booking.hotel?.id}`}
                                className="hover:text-primary transition-colors"
                              >
                                {booking.hotel?.name}
                              </Link>
                            </h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-1 h-3.5 w-3.5" />
                              {booking.hotel?.city}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              ${booking.totalPrice}
                            </div>
                            <div className="text-sm text-muted-foreground capitalize">
                              {booking.room?.type} Room
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 bg-secondary/30 p-4 rounded-lg">
                          <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              Check-in
                            </div>
                            <div className="font-medium flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              {format(new Date(booking.checkIn), "MMM dd, yyyy")}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              Check-out
                            </div>
                            <div className="font-medium flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              {format(new Date(booking.checkOut), "MMM dd, yyyy")}
                            </div>
                          </div>
                        </div>

                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-border/50">
                          <span className="text-sm text-muted-foreground">
                            Booked{" "}
                            {formatDistanceToNow(new Date(booking.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                          <Button
                            variant={booking.status === "pending" ? "default" : "outline"}
                            asChild
                          >
                            <Link href={`/booking/${booking.id}`}>
                              {booking.status === "pending"
                                ? "Complete Payment"
                                : "View Details"}
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

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  Upload a photo from your computer. It will be cropped to a square.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <Avatar
                    key={user?.avatarUrl || "no-avatar-card"}
                    className="h-20 w-20"
                  >
                    {user?.avatarUrl ? (
                      <AvatarImage src={user.avatarUrl} alt={user?.name} />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <User className="h-9 w-9" strokeWidth={1.75} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={avatarUploading}
                    >
                      {avatarUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                        </>
                      ) : (
                        <>
                          <Camera className="mr-2 h-4 w-4" /> Upload Photo
                        </>
                      )}
                    </Button>
                    {user?.avatarUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveAvatar}
                        disabled={updateMe.isPending}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your name, contact details, and a short bio.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">About You</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        maxLength={500}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us a little about yourself and your travel preferences..."
                        rows={4}
                      />
                      <div className="text-xs text-muted-foreground text-right">
                        {bio.length}/500
                      </div>
                    </div>
                  </div>
                  <Button type="submit" disabled={updateMe.isPending}>
                    {updateMe.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>


            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" /> Change Password
                </CardTitle>
                <CardDescription>
                  After changing your password you will be signed out and must sign in again.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrent ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="pr-10"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNew ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pr-10"
                        placeholder="At least 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type={showNew ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                    />
                  </div>
                  <Button type="submit" disabled={pwSubmitting}>
                    {pwSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-destructive/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" /> Delete Account
                </CardTitle>
                <CardDescription>
                  Permanently delete your account, bookings, reviews, favorites and all
                  associated data. This action cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Separator className="mb-4" />
                <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete My Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove your profile, bookings, reviews and
                        favorites. Enter your password to confirm.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-2 py-2">
                      <Label htmlFor="deletePassword">Password</Label>
                      <Input
                        id="deletePassword"
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Enter your password"
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => {
                          setDeletePassword("");
                        }}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteAccount();
                        }}
                        disabled={deleteSubmitting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {deleteSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                          </>
                        ) : (
                          "Delete Account"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

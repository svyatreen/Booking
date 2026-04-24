import { Link, useLocation } from "wouter";
import { MapPin, Star, Heart } from "lucide-react";
import { Hotel } from "@/api/generated/api.schemas";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAddFavorite, useRemoveFavorite, useGetFavorites, getGetFavoritesQueryKey } from "@/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface HotelCardProps {
  hotel: Hotel;
}

const FAVORITE_PALETTE = [
  { bg: "bg-orange-100/90 dark:bg-orange-500/20 hover:bg-orange-100 dark:hover:bg-orange-500/30", icon: "text-orange-600 dark:text-orange-300" },
  { bg: "bg-rose-100/90 dark:bg-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/30", icon: "text-rose-600 dark:text-rose-300" },
  { bg: "bg-amber-100/90 dark:bg-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/30", icon: "text-amber-600 dark:text-amber-300" },
  { bg: "bg-emerald-100/90 dark:bg-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/30", icon: "text-emerald-600 dark:text-emerald-300" },
  { bg: "bg-sky-100/90 dark:bg-sky-500/20 hover:bg-sky-100 dark:hover:bg-sky-500/30", icon: "text-sky-600 dark:text-sky-300" },
  { bg: "bg-violet-100/90 dark:bg-violet-500/20 hover:bg-violet-100 dark:hover:bg-violet-500/30", icon: "text-violet-600 dark:text-violet-300" },
  { bg: "bg-fuchsia-100/90 dark:bg-fuchsia-500/20 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-500/30", icon: "text-fuchsia-600 dark:text-fuchsia-300" },
  { bg: "bg-teal-100/90 dark:bg-teal-500/20 hover:bg-teal-100 dark:hover:bg-teal-500/30", icon: "text-teal-600 dark:text-teal-300" },
];

export function HotelCard({ hotel }: HotelCardProps) {
  const palette = FAVORITE_PALETTE[Math.abs(hotel.id) % FAVORITE_PALETTE.length];
  const { isAuthenticated } = useAuth();
  const { formatPrice } = useCurrency();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  
  const { data: favorites } = useGetFavorites({
    query: {
      enabled: isAuthenticated,
      queryKey: getGetFavoritesQueryKey()
    }
  });

  const isFavorite = favorites?.some((f: any) => (f.hotelId ?? f.id) === hotel.id);

  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }

    if (isFavorite) {
      removeFavorite.mutate({ hotelId: hotel.id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetFavoritesQueryKey() });
          toast.success("Removed from favorites");
        }
      });
    } else {
      addFavorite.mutate({ hotelId: hotel.id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetFavoritesQueryKey() });
          toast.success("Added to favorites");
        }
      });
    }
  };

  return (
    <Link href={`/hotels/${hotel.id}`}>
      <Card className="group overflow-hidden rounded-xl border-border/50 bg-card transition-all hover:shadow-md cursor-pointer h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={hotel.images[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"}
            alt={hotel.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              className={`h-8 w-8 rounded-full backdrop-blur-sm ${palette.bg}`}
              onClick={toggleFavorite}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-destructive text-destructive" : `${palette.icon} stroke-2`}`} />
            </Button>
          </div>
          {hotel.stars >= 4 && (
            <Badge className="absolute top-3 left-3 bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur-sm">
              Luxury
            </Badge>
          )}
        </div>
        <CardContent className="p-5 flex flex-col flex-grow">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="font-serif text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {hotel.name}
            </h3>
            <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span className="text-sm font-medium">{hotel.stars}</span>
            </div>
          </div>
          
          <div className="flex items-center text-muted-foreground mb-4">
            <MapPin className="mr-1 h-3.5 w-3.5" />
            <span className="text-sm truncate">{hotel.city}</span>
          </div>

          <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Starting from</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold">{formatPrice(hotel.minPrice || 0)}</span>
                <span className="text-sm text-muted-foreground">/night</span>
              </div>
            </div>
            <span className="text-sm font-medium text-primary flex items-center group-hover:translate-x-1 transition-transform">
              View details →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

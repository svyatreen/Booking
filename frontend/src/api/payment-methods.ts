import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "./custom-fetch";

export interface PaymentMethod {
  id: number;
  userId: number;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  cardholderName: string;
  isDefault: boolean;
  createdAt: string;
}

export interface CreatePaymentMethodInput {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  isDefault?: boolean;
}

export const paymentMethodsQueryKey = ["payment-methods"] as const;

export function usePaymentMethods(enabled = true) {
  return useQuery<PaymentMethod[]>({
    queryKey: paymentMethodsQueryKey,
    queryFn: () => customFetch<PaymentMethod[]>("/api/payment-methods", { method: "GET" }),
    enabled,
  });
}

export function useCreatePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePaymentMethodInput) =>
      customFetch<PaymentMethod>("/api/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: paymentMethodsQueryKey }),
  });
}

export function useDeletePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      customFetch<{ ok: true }>(`/api/payment-methods/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: paymentMethodsQueryKey }),
  });
}

export function useSetDefaultPaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      customFetch<PaymentMethod>(`/api/payment-methods/${id}/default`, { method: "PATCH" }),
    onSuccess: (_data, id) => {
      // Optimistic cache update so the badge moves immediately
      qc.setQueryData<PaymentMethod[]>(paymentMethodsQueryKey, (prev) => {
        if (!prev) return prev;
        return prev
          .map((c) => ({ ...c, isDefault: c.id === id }))
          .sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
      });
      qc.invalidateQueries({ queryKey: paymentMethodsQueryKey });
    },
  });
}

export function toTitleCase(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ""))
    .join(" ");
}

export function brandIcon(brand: string): string {
  const b = brand.toLowerCase();
  if (b.includes("visa")) return "VISA";
  if (b.includes("master")) return "MC";
  if (b.includes("amex")) return "AMEX";
  if (b.includes("discover")) return "DISC";
  if (b.includes("jcb")) return "JCB";
  if (b.includes("diners")) return "DC";
  return "CARD";
}

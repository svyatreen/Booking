import { Router, type IRouter } from "express";
import { db, paymentMethodsTable } from "../db";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

const CreatePaymentMethodBody = z.object({
  cardNumber: z.string().min(12).max(23),
  expiryDate: z.string().regex(/^\d{2}\s*\/\s*\d{2,4}$/, "Expected MM/YY"),
  cvv: z.string().min(3).max(4),
  cardholderName: z.string().min(2).max(80),
  isDefault: z.boolean().optional(),
});

function detectBrand(cardNumber: string): string {
  const n = cardNumber.replace(/\D/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "Amex";
  if (/^6(?:011|5)/.test(n)) return "Discover";
  if (/^(?:2131|1800|35)/.test(n)) return "JCB";
  if (/^3(?:0[0-5]|[68])/.test(n)) return "Diners";
  return "Card";
}

function toTitleCase(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ""))
    .join(" ");
}

function parseExpiry(expiryDate: string): { expMonth: number; expYear: number } | null {
  const m = expiryDate.replace(/\s/g, "").match(/^(\d{2})\/(\d{2,4})$/);
  if (!m) return null;
  const expMonth = parseInt(m[1], 10);
  let expYear = parseInt(m[2], 10);
  if (expYear < 100) expYear += 2000;
  if (expMonth < 1 || expMonth > 12) return null;
  return { expMonth, expYear };
}

router.get("/payment-methods", requireAuth, async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(paymentMethodsTable)
    .where(eq(paymentMethodsTable.userId, req.user!.userId))
    .orderBy(sql`${paymentMethodsTable.isDefault} desc, ${paymentMethodsTable.createdAt} desc`);
  res.json(rows);
});

router.post("/payment-methods", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreatePaymentMethodBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { cardNumber, expiryDate, cardholderName } = parsed.data;
  const exp = parseExpiry(expiryDate);
  if (!exp) {
    res.status(400).json({ error: "Invalid expiry date" });
    return;
  }
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 12) {
    res.status(400).json({ error: "Invalid card number" });
    return;
  }
  const last4 = digits.slice(-4);
  const brand = detectBrand(digits);

  // Determine default status: first card auto-default
  const existing = await db
    .select({ id: paymentMethodsTable.id })
    .from(paymentMethodsTable)
    .where(eq(paymentMethodsTable.userId, req.user!.userId));
  const isDefault = parsed.data.isDefault ?? existing.length === 0;

  if (isDefault && existing.length > 0) {
    await db
      .update(paymentMethodsTable)
      .set({ isDefault: false })
      .where(eq(paymentMethodsTable.userId, req.user!.userId));
  }

  const [created] = await db
    .insert(paymentMethodsTable)
    .values({
      userId: req.user!.userId,
      brand,
      last4,
      expMonth: exp.expMonth,
      expYear: exp.expYear,
      cardholderName: toTitleCase(cardholderName),
      isDefault,
    })
    .returning();

  res.status(201).json(created);
});

router.delete("/payment-methods/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [existing] = await db
    .select()
    .from(paymentMethodsTable)
    .where(and(eq(paymentMethodsTable.id, id), eq(paymentMethodsTable.userId, req.user!.userId)));
  if (!existing) {
    res.status(404).json({ error: "Payment method not found" });
    return;
  }
  await db.delete(paymentMethodsTable).where(eq(paymentMethodsTable.id, id));

  if (existing.isDefault) {
    const [next] = await db
      .select()
      .from(paymentMethodsTable)
      .where(eq(paymentMethodsTable.userId, req.user!.userId))
      .orderBy(sql`${paymentMethodsTable.createdAt} desc`)
      .limit(1);
    if (next) {
      await db
        .update(paymentMethodsTable)
        .set({ isDefault: true })
        .where(eq(paymentMethodsTable.id, next.id));
    }
  }
  res.json({ ok: true });
});

router.patch("/payment-methods/:id/default", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [existing] = await db
    .select()
    .from(paymentMethodsTable)
    .where(and(eq(paymentMethodsTable.id, id), eq(paymentMethodsTable.userId, req.user!.userId)));
  if (!existing) {
    res.status(404).json({ error: "Payment method not found" });
    return;
  }
  await db
    .update(paymentMethodsTable)
    .set({ isDefault: false })
    .where(eq(paymentMethodsTable.userId, req.user!.userId));
  const [updated] = await db
    .update(paymentMethodsTable)
    .set({ isDefault: true })
    .where(eq(paymentMethodsTable.id, id))
    .returning();
  res.json(updated);
});

export default router;

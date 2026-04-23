import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, CreditCard, Calendar as CalIcon, Lock } from "lucide-react";

export interface CardFormValue {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
}

interface Props {
  value: CardFormValue;
  onChange: (next: CardFormValue) => void;
  showSaveOption?: boolean;
  saveLabel?: string;
}

function formatCardNumber(s: string): string {
  const digits = s.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(s: string): string {
  const digits = s.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function CardForm({ value, onChange, showSaveOption = false, saveLabel = "Save this card to my profile" }: Props) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  const update = (patch: Partial<CardFormValue>) => {
    const next = { ...local, ...patch };
    setLocal(next);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardholderName">Cardholder Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="cardholderName"
            placeholder="JOHN DOE"
            className="pl-10 uppercase"
            autoComplete="cc-name"
            value={local.cardholderName}
            onChange={(e) => update({ cardholderName: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="cardNumber"
            placeholder="0000 0000 0000 0000"
            inputMode="numeric"
            autoComplete="cc-number"
            className="pl-10 tracking-wider"
            value={local.cardNumber}
            onChange={(e) => update({ cardNumber: formatCardNumber(e.target.value) })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry">Expiry (MM/YY)</Label>
          <div className="relative">
            <CalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="expiry"
              placeholder="MM/YY"
              inputMode="numeric"
              autoComplete="cc-exp"
              className="pl-10"
              value={local.expiryDate}
              onChange={(e) => update({ expiryDate: formatExpiry(e.target.value) })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="cvv"
              placeholder="123"
              type="password"
              inputMode="numeric"
              autoComplete="cc-csc"
              maxLength={4}
              className="pl-10"
              value={local.cvv}
              onChange={(e) => update({ cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
            />
          </div>
        </div>
      </div>

      {showSaveOption && (
        <label className="flex items-center gap-2 pt-1 cursor-pointer text-sm">
          <Checkbox
            checked={local.saveCard}
            onCheckedChange={(v) => update({ saveCard: v === true })}
          />
          <span className="text-muted-foreground">{saveLabel}</span>
        </label>
      )}
    </div>
  );
}

export const emptyCardForm: CardFormValue = {
  cardholderName: "",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  saveCard: false,
};

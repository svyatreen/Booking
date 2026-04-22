import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type DateRange = { from: Date | undefined; to: Date | undefined };

interface DateRangePopoverProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  triggerClassName?: string;
  align?: "start" | "center" | "end";
}

export function DateRangePopover({ value, onChange, triggerClassName, align = "center" }: DateRangePopoverProps) {
  const [open, setOpen] = useState(false);
  const nights = value.from && value.to ? differenceInDays(value.to, value.from) : 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-12 bg-background",
            !value.from && "text-muted-foreground",
            triggerClassName
          )}
        >
          <CalendarDays className="mr-2 h-5 w-5 text-primary" />
          {value.from ? (
            value.to ? (
              <>{format(value.from, "LLL dd, y")} — {format(value.to, "LLL dd, y")}</>
            ) : (
              format(value.from, "LLL dd, y")
            )
          ) : (
            <span>Pick your dates</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl border-border" align={align}>
        <div className="p-5 border-b bg-secondary/30 rounded-t-2xl">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground uppercase text-[10px] tracking-wider mb-1">Check-in</p>
              <p className="font-semibold text-base">
                {value.from ? format(value.from, "EEE, LLL dd") : "Select date"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground uppercase text-[10px] tracking-wider mb-1">Check-out</p>
              <p className="font-semibold text-base">
                {value.to ? format(value.to, "EEE, LLL dd") : "Select date"}
              </p>
            </div>
          </div>
          {nights > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              {nights} night{nights > 1 ? "s" : ""} stay
            </p>
          )}
        </div>
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={value.from}
          selected={value as any}
          onSelect={(v: any) => onChange(v ?? { from: undefined, to: undefined })}
          numberOfMonths={2}
          showOutsideDays={false}
          weekStartsOn={1}
          disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
          className="[--cell-size:3.25rem] p-5"
        />
        <div className="flex items-center justify-between gap-2 p-3 border-t bg-secondary/20 rounded-b-2xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange({ from: undefined, to: undefined })}
          >
            Clear
          </Button>
          <Button size="sm" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

import { useCallback, useEffect, useState } from "react";
import { addDays, startOfDay } from "date-fns";

const STORAGE_KEY = "staylux:stay-dates";

export type StayDateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

function getDefaults(): StayDateRange {
  const today = startOfDay(new Date());
  return { from: today, to: addDays(today, 1) };
}

function readFromStorage(): StayDateRange {
  if (typeof window === "undefined") return getDefaults();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaults();
    const parsed = JSON.parse(raw) as { from?: string; to?: string };
    const today = startOfDay(new Date());
    const from = parsed.from ? startOfDay(new Date(parsed.from)) : undefined;
    const to = parsed.to ? startOfDay(new Date(parsed.to)) : undefined;

    if (!from || isNaN(from.getTime()) || !to || isNaN(to.getTime())) {
      return getDefaults();
    }
    if (from < today) {
      return getDefaults();
    }
    return { from, to };
  } catch {
    return getDefaults();
  }
}

function writeToStorage(range: StayDateRange) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        from: range.from ? range.from.toISOString() : undefined,
        to: range.to ? range.to.toISOString() : undefined,
      }),
    );
  } catch {
    /* ignore */
  }
}

export function useStayDates(): [StayDateRange, (range: StayDateRange) => void] {
  const [date, setDateState] = useState<StayDateRange>(() => readFromStorage());

  useEffect(() => {
    writeToStorage(date);
  }, [date]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setDateState(readFromStorage());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setDate = useCallback((range: StayDateRange) => {
    setDateState(range);
  }, []);

  return [date, setDate];
}

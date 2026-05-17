"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

interface DatePickerProps {
  value: string; // "YYYY-MM-DD"
  onChange: (value: string) => void;
}

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
const DAYS_FR = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const parseDate = (iso: string) => iso ? new Date(iso + "T12:00:00") : new Date();
  const [viewDate, setViewDate] = useState(() => parseDate(value));

  useEffect(() => setMounted(true), []);

  // Sync view when value changes externally
  useEffect(() => {
    if (value) setViewDate(parseDate(value));
  }, [value]);

  const openCalendar = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopoverPos({ top: rect.bottom + 6, left: rect.left, width: rect.width });
    }
    setIsOpen(true);
  };

  const selectedDate = value ? parseDate(value) : null;
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Monday-first grid
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isSelected = (day: number) =>
    selectedDate &&
    selectedDate.getFullYear() === year &&
    selectedDate.getMonth() === month &&
    selectedDate.getDate() === day;

  const isToday = (day: number) =>
    todayDate.getFullYear() === year &&
    todayDate.getMonth() === month &&
    todayDate.getDate() === day;

  const handleDay = (day: number) => {
    const d = new Date(year, month, day);
    onChange(d.toISOString().split("T")[0]);
    setIsOpen(false);
  };

  const handleToday = () => {
    const iso = todayDate.toISOString().split("T")[0];
    onChange(iso);
    setIsOpen(false);
  };

  const formatDisplay = (iso: string) =>
    new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={openCalendar}
        className="w-full bg-background border border-border/50 rounded-xl px-4 py-2 text-sm text-left flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all hover:border-border"
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value ? formatDisplay(value) : "Sélectionner une date"}
        </span>
        <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
      </button>

      {mounted && isOpen &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => setIsOpen(false)}
            />

            {/* Calendar popover */}
            <div
              className="fixed z-[9999] bg-card border border-border/50 rounded-2xl shadow-2xl p-4 w-72"
              style={{ top: popoverPos.top, left: popoverPos.left }}
            >
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setViewDate(new Date(year, month - 1, 1))}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-semibold text-foreground">
                  {MONTHS_FR[month]} {year}
                </span>
                <button
                  type="button"
                  onClick={() => setViewDate(new Date(year, month + 1, 1))}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day labels */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS_FR.map((d) => (
                  <div key={d} className="text-center text-[11px] text-muted-foreground font-medium py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-y-0.5">
                {cells.map((day, i) => (
                  <div key={i} className="flex items-center justify-center aspect-square">
                    {day !== null && (
                      <button
                        type="button"
                        onClick={() => handleDay(day)}
                        className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
                          isSelected(day)
                            ? "bg-primary text-white shadow-sm shadow-primary/30"
                            : isToday(day)
                            ? "border border-primary/60 text-primary"
                            : "text-foreground hover:bg-white/10"
                        }`}
                      >
                        {day}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Today shortcut */}
              <div className="mt-3 pt-3 border-t border-border/50 text-center">
                <button
                  type="button"
                  onClick={handleToday}
                  className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Aujourd'hui
                </button>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}

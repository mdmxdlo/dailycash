"use client";

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/currency';
import { ChevronDown, Check } from 'lucide-react';

const OPTIONS = [
  { label: "Cette année", value: 0 },
  { label: "L'année dernière", value: -1 },
];

export function RevenueChart() {
  const revenues = useStore(state => state.revenues);
  const user = useStore(state => state.user);
  const [yearOffset, setYearOffset] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const processChartData = () => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const targetYear = new Date().getFullYear() + yearOffset;

    const monthlyData = months.map(month => ({ name: month, revenue: 0 }));

    revenues.forEach(revenue => {
      if (revenue.status !== "Payé") return;
      const date = new Date(revenue.date);
      if (date.getFullYear() !== targetYear) return;
      monthlyData[date.getMonth()].revenue += revenue.amount;
    });

    return monthlyData;
  };

  const data = processChartData();
  const selected = OPTIONS.find(o => o.value === yearOffset)!;

  return (
    <div id="tour-chart" className="bg-card border border-border/50 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-semibold">Aperçu des Revenus</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Évolution sur les 12 mois</p>
        </div>

        {/* Custom dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-background border border-border/50 text-sm rounded-xl px-3 py-1.5 hover:border-border transition-colors focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            <span className="text-foreground">{selected.label}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 bg-card border border-border/50 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-100">
              {OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setYearOffset(opt.value); setIsOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white/5 transition-colors text-left"
                >
                  <span className={opt.value === yearOffset ? "text-primary font-medium" : "text-foreground"}>
                    {opt.label}
                  </span>
                  {opt.value === yearOffset && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="h-[220px] sm:h-[300px] w-full mt-2 sm:mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              tickFormatter={(value) => value >= 1000 ? `${Math.round(value / 1000)}k` : `${value}`}
              dx={-5}
              width={35}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
              itemStyle={{ color: 'hsl(var(--primary))' }}
              formatter={(value: number) => [formatCurrency(value, user?.currency), 'Revenu']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

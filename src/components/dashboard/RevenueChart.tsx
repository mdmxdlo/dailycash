"use client";

import { useStore } from '@/store/useStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/currency';

export function RevenueChart() {
  const revenues = useStore(state => state.revenues);
  const user = useStore(state => state.user);

  // Process data for the chart (Group by month for the current year)
  const processChartData = () => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const currentYear = new Date().getFullYear();
    
    // Initialize array with all months at 0
    const monthlyData = months.map(month => ({
      name: month,
      revenue: 0
    }));

    revenues.forEach(revenue => {
      // Only count paid revenues
      if (revenue.status !== "Payé") return;

      const date = new Date(revenue.date);
      // If we want to show all data regardless of year, we could remove the year check
      // For now, let's include all data for demonstration, but map it to the month index
      const monthIndex = date.getMonth();
      
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyData[monthIndex].revenue += revenue.amount;
      }
    });

    return monthlyData;
  };

  const data = processChartData();

  return (
    <div id="tour-chart" className="bg-card border border-border/50 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-semibold">Aperçu des Revenus</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Évolution sur les 12 mois</p>
        </div>
        <select className="bg-background border border-border/50 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50">
          <option>Cette année</option>
          <option>L'année dernière</option>
        </select>
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

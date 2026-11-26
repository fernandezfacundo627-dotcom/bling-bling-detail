import React, { useState, useMemo } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Car, 
  CreditCard, 
  Banknote, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { formatCurrency, filterTransactionsByPeriod, getWeekendRange } from '../utils/date';
import { VEHICLE_CATEGORIES } from '../data/initialData';

export default function Dashboard({ transactions, onNavigateTo }) {
  const [period, setPeriod] = useState('total'); // 'finde' | 'mes' | 'total'

  // Filtered transactions for the current period
  const filtered = useMemo(() => {
    return filterTransactionsByPeriod(transactions, period);
  }, [transactions, period]);

  // Financial calculations
  const stats = useMemo(() => {
    let income = 0;
    let expenses = 0;
    let washedCarsCount = 0;
    let cashTotal = 0;
    let transferTotal = 0;

    const categoryStats = {
      Auto: { count: 0, total: 0 },
      SUV: { count: 0, total: 0 },
      Camioneta: { count: 0, total: 0 },
    };

    const serviceStats = {};

    filtered.forEach((tx) => {
      if (tx.type === 'wash') {
        const amt = Number(tx.amount) || 0;
        income += amt;
        washedCarsCount += 1;

        if (tx.paymentMethod === 'Efectivo') cashTotal += amt;
        if (tx.paymentMethod === 'Transferencia') transferTotal += amt;

        if (categoryStats[tx.category]) {
          categoryStats[tx.category].count += 1;
          categoryStats[tx.category].total += amt;
        }

        if (tx.service) {
          serviceStats[tx.service] = (serviceStats[tx.service] || 0) + 1;
        }
      } else if (tx.type === 'expense') {
        expenses += Number(tx.amount) || 0;
      }
    });

    const netProfit = income - expenses;
    const margin = income > 0 ? ((netProfit / income) * 100) : 0;

    return {
      income,
      expenses,
      netProfit,
      margin: Math.max(-100, Math.min(100, margin)),
      washedCarsCount,
      categoryStats,
      serviceStats,
      cashTotal,
      transferTotal,
    };
  }, [filtered]);

  const periodLabel = useMemo(() => {
    if (period === 'finde') {
      const { start, end } = getWeekendRange(new Date());
      const formatSimple = (s) => {
        const [, m, d] = s.split('-');
        return `${d}/${m}`;
      };
      return `Fin de semana (${formatSimple(start)} - ${formatSimple(end)})`;
    }
    if (period === 'mes') {
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const now = new Date();
      return `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    }
    return 'Histórico Completo';
  }, [period]);

  // Income vs Expense ratio calculation for visual minimalist bar
  const totalFlow = stats.income + stats.expenses;
  const incomeRatio = totalFlow > 0 ? (stats.income / totalFlow) * 100 : 0;
  const expenseRatio = totalFlow > 0 ? (stats.expenses / totalFlow) * 100 : 0;

  return (
    <div className="space-y-4 pb-20">
      {/* Top Segmented Control (Píldora) */}
      <div className="flex items-center justify-center p-1 rounded-2xl bg-[#121215] border border-white/[0.08]">
        <button
          onClick={() => setPeriod('finde')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 ${
            period === 'finde'
              ? 'bg-[#FAFAFA] text-zinc-950 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Finde
        </button>
        <button
          onClick={() => setPeriod('mes')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 ${
            period === 'mes'
              ? 'bg-[#FAFAFA] text-zinc-950 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Mes
        </button>
        <button
          onClick={() => setPeriod('total')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 ${
            period === 'total'
              ? 'bg-[#FAFAFA] text-zinc-950 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Total
        </button>
      </div>

      {/* Hero KPI Card: Ganancia Neta */}
      <div className="relative overflow-hidden rounded-2xl bg-[#121215] border border-white/[0.08] p-5 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
            Ganancia Neta
          </span>
          <span className="text-[11px] text-zinc-400 font-medium">
            {periodLabel}
          </span>
        </div>

        <div className="flex items-baseline gap-2 my-1">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-[#FAFAFA]">
            {formatCurrency(stats.netProfit)}
          </span>
        </div>

        {/* Profit margin badge & car count */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-400">Margen:</span>
            <span className={`text-xs font-bold tabular-nums ${
              stats.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {stats.margin.toFixed(1)}%
            </span>
          </div>
          <span className="text-zinc-600">•</span>
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
            <Car className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.75} />
            <span className="text-zinc-300 font-medium tabular-nums">{stats.washedCarsCount}</span>
            <span className="text-zinc-400">{stats.washedCarsCount === 1 ? 'auto lavado' : 'autos lavados'}</span>
          </div>
        </div>
      </div>

      {/* Two Compact KPI Cards: Facturado & Insumos */}
      <div className="grid grid-cols-2 gap-3">
        {/* Facturado (Ingresos) */}
        <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Facturado</span>
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl font-bold tracking-tight text-[#FAFAFA] tabular-nums">
              {formatCurrency(stats.income)}
            </p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Total cobrado</p>
          </div>
        </div>

        {/* Insumos / Gastos */}
        <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Insumos/Gastos</span>
            <div className="w-6 h-6 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" strokeWidth={2} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl font-bold tracking-tight text-[#FAFAFA] tabular-nums">
              {formatCurrency(stats.expenses)}
            </p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Productos y traslados</p>
          </div>
        </div>
      </div>

      {/* Minimalist Bar Chart: Ingresos vs Gastos */}
      <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-zinc-300">Balance de Flujo</span>
          <span className="text-[11px] text-zinc-400 tabular-nums">
            {stats.income > 0 ? `${((stats.expenses / stats.income) * 100).toFixed(0)}% costo/ingreso` : '0%'}
          </span>
        </div>

        {/* Split progress bar */}
        <div className="w-full h-2.5 rounded-full bg-white/[0.05] overflow-hidden flex">
          <div 
            style={{ width: `${incomeRatio}%` }} 
            className="h-full bg-emerald-400/80 transition-all duration-300"
            title="Ingresos"
          />
          <div 
            style={{ width: `${expenseRatio}%` }} 
            className="h-full bg-rose-400/80 transition-all duration-300"
            title="Gastos"
          />
        </div>

        <div className="flex items-center justify-between mt-2.5 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
            <span className="text-zinc-400">Ingresos:</span>
            <span className="font-semibold text-zinc-200 tabular-nums">{formatCurrency(stats.income)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400/80" />
            <span className="text-zinc-400">Gastos:</span>
            <span className="font-semibold text-zinc-200 tabular-nums">{formatCurrency(stats.expenses)}</span>
          </div>
        </div>
      </div>

      {/* Desglose por Tipo de Vehículo */}
      <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Desglose por Vehículo
          </h3>
          <span className="text-[11px] text-zinc-400 tabular-nums">
            {stats.washedCarsCount} {stats.washedCarsCount === 1 ? 'unidad' : 'unidades'}
          </span>
        </div>

        <div className="space-y-3">
          {VEHICLE_CATEGORIES.map((cat) => {
            const catData = stats.categoryStats[cat] || { count: 0, total: 0 };
            const pct = stats.income > 0 ? (catData.total / stats.income) * 100 : 0;

            return (
              <div key={cat} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-200">{cat}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.06] text-zinc-400 border border-white/[0.04] tabular-nums">
                      {catData.count} {catData.count === 1 ? 'lavado' : 'lavados'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 text-[11px] tabular-nums">{pct.toFixed(0)}%</span>
                    <span className="font-semibold text-white tabular-nums">{formatCurrency(catData.total)}</span>
                  </div>
                </div>

                {/* Minimalist thin horizontal bar */}
                <div className="w-full h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-white/70 rounded-full transition-all duration-300"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Métodos de Pago & Accesos Rápidos */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-3.5">
          <div className="flex items-center gap-2 text-zinc-400 mb-1.5">
            <Banknote className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.75} />
            <span className="text-xs">Efectivo</span>
          </div>
          <p className="text-sm font-semibold text-white tabular-nums">
            {formatCurrency(stats.cashTotal)}
          </p>
        </div>

        <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-3.5">
          <div className="flex items-center gap-2 text-zinc-400 mb-1.5">
            <CreditCard className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.75} />
            <span className="text-xs">Transferencia</span>
          </div>
          <p className="text-sm font-semibold text-white tabular-nums">
            {formatCurrency(stats.transferTotal)}
          </p>
        </div>
      </div>

      {/* Quick Action Button to Add Wash */}
      <div className="pt-1">
        <button
          onClick={() => onNavigateTo('wash')}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#FAFAFA] text-zinc-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-white active:scale-[0.99] transition"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>Registrar Nuevo Lavado</span>
        </button>
      </div>
    </div>
  );
}

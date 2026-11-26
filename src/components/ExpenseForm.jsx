import React, { useState } from 'react';
import { ShoppingBag, Calendar, DollarSign, Tag, Check } from 'lucide-react';
import { getTodayString } from '../utils/date';

const QUICK_EXPENSE_AMOUNTS = [5000, 10000, 15000, 20000, 30000, 50000];

const POPULAR_PRODUCT_CHIPS = [
  "Shampoo",
  "Cera",
  "Microfibras",
  "Nafta",
  "Desengrasante",
  "Revividor"
];

export default function ExpenseForm({ onAddTransaction, onShowToast, onFinished }) {
  const [date, setDate] = useState(getTodayString());
  const [productName, setProductName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!productName.trim()) {
      alert("Por favor ingresá el nombre del producto o insumo");
      return;
    }

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      alert("Por favor ingresá un monto válido de gasto");
      return;
    }

    setIsSubmitting(true);

    const newTx = {
      id: `exp-${Date.now()}`,
      type: 'expense',
      date: date || getTodayString(),
      description: productName.trim(),
      category: 'Insumo',
      amount: numericAmount,
      note: note.trim(),
      createdAt: new Date().toISOString()
    };

    onAddTransaction(newTx);
    onShowToast(`Gasto anotado: ${productName.trim()} ($${numericAmount.toLocaleString('es-AR')})`);

    // Reset fields
    setProductName('');
    setAmount('');
    setNote('');
    setIsSubmitting(false);

    if (onFinished) {
      onFinished();
    }
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">Nuevo Gasto / Insumo</h2>
        <p className="text-xs text-zinc-400">Anotá compras de productos, nafta o equipamiento</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre del Producto / Insumo */}
        <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-3.5 space-y-2.5">
          <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.75} />
            Nombre del producto o insumo
          </label>
          <input
            type="text"
            placeholder="ej. Shampoo Vonixx 5L, Microfibras 40x40, Nafta YPF..."
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full bg-[#18181C] text-white placeholder-zinc-500 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-white/30"
            required
            autoFocus
          />

          {/* Quick chip suggestions to fill quickly with one tap */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {POPULAR_PRODUCT_CHIPS.map((chip) => (
              <button
                type="button"
                key={chip}
                onClick={() => setProductName(chip)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                  productName === chip
                    ? 'bg-white text-zinc-950 border-white font-medium'
                    : 'bg-[#18181C] text-zinc-400 border-white/[0.06] hover:text-zinc-200'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Monto Gastado ($ ARS) */}
        <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-3.5 space-y-2.5">
          <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-rose-400" strokeWidth={1.75} />
            Monto gastado ($ ARS)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-semibold">
              $
            </span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#18181C] text-white placeholder-zinc-600 pl-8 pr-3 py-2.5 text-lg font-bold tabular-nums border border-white/[0.08] rounded-xl focus:outline-none focus:border-white/30"
              required
            />
          </div>

          {/* Quick preset amount chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {QUICK_EXPENSE_AMOUNTS.map((amt) => (
              <button
                type="button"
                key={amt}
                onClick={() => setAmount(amt.toString())}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[#18181C] text-zinc-400 border border-white/[0.06] hover:text-white tabular-nums transition"
              >
                ${(amt / 1000).toFixed(0)}k
              </button>
            ))}
          </div>
        </div>

        {/* Fecha de compra */}
        <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-3.5 space-y-2">
          <label className="text-xs font-medium text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.75} />
              Fecha de compra
            </span>
            {date !== getTodayString() && (
              <button
                type="button"
                onClick={() => setDate(getTodayString())}
                className="text-[11px] text-emerald-400 font-semibold hover:underline"
              >
                Poner Hoy
              </button>
            )}
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-[#18181C] text-white border border-white/[0.08] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-white/30"
          />
        </div>

        {/* Nota corta opcional */}
        <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-3.5 space-y-1.5">
          <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.75} />
            Nota u observación (opcional)
          </label>
          <input
            type="text"
            placeholder="ej. Comprado en distribuidora, pagado en efectivo..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-[#18181C] text-white placeholder-zinc-600 border border-white/[0.08] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-white/30"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-4 rounded-2xl bg-[#FAFAFA] text-zinc-950 font-bold text-sm tracking-wide shadow-md hover:bg-white active:scale-[0.98] transition flex items-center justify-center gap-2 mt-2"
        >
          <Check className="w-4 h-4 text-zinc-950" strokeWidth={2.5} />
          <span>Registrar Gasto</span>
        </button>
      </form>
    </div>
  );
}

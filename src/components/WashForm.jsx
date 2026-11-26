import React, { useState } from 'react';
import { Car, Calendar, DollarSign, CreditCard, Banknote, Sparkles, Check, Tag } from 'lucide-react';
import { getTodayString } from '../utils/date';
import { VEHICLE_CATEGORIES, WASH_SERVICES, PAYMENT_METHODS } from '../data/initialData';

const QUICK_CAR_PRESETS = [
  "Gol Trend",
  "Hilux",
  "Peugeot 208",
  "Cronos",
  "Amarok",
  "Renegade"
];

const QUICK_AMOUNTS = [15000, 20000, 25000, 30000, 40000, 50000];

export default function WashForm({ onAddTransaction, onShowToast, onFinished }) {
  const [date, setDate] = useState(getTodayString());
  const [vehicle, setVehicle] = useState('');
  const [category, setCategory] = useState('Auto');
  const [service, setService] = useState('Lavado Full');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Transferencia');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!vehicle.trim()) {
      alert("Por favor ingresá el modelo o vehículo");
      return;
    }

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      alert("Por favor ingresá un monto válido");
      return;
    }

    setIsSubmitting(true);

    const newTx = {
      id: `wash-${Date.now()}`,
      type: 'wash',
      date: date || getTodayString(),
      vehicle: vehicle.trim(),
      category,
      service,
      amount: numericAmount,
      paymentMethod,
      note: note.trim(),
      createdAt: new Date().toISOString()
    };

    onAddTransaction(newTx);
    onShowToast(`Lavado registrado: ${vehicle.trim()} ($${numericAmount.toLocaleString('es-AR')})`);

    // Reset fields
    setVehicle('');
    setAmount('');
    setNote('');
    setIsSubmitting(false);

    if (onFinished) {
      onFinished();
    }
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Form Title & Subtitle */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">Nuevo Lavado</h2>
        <p className="text-xs text-zinc-400">Registrá un servicio cobrado en segundos</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Fecha & Hoy shortcut */}
        <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-3.5 space-y-2">
          <label className="text-xs font-medium text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.75} />
              Fecha del servicio
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

        {/* Vehículo / Modelo */}
        <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-3.5 space-y-2.5">
          <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.75} />
            Vehículo / Modelo
          </label>
          <input
            type="text"
            placeholder="ej. VW Gol Trend, Toyota Hilux..."
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            className="w-full bg-[#18181C] text-white placeholder-zinc-500 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-white/30"
            required
          />

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {QUICK_CAR_PRESETS.map((car) => (
              <button
                type="button"
                key={car}
                onClick={() => setVehicle(car)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                  vehicle === car
                    ? 'bg-white text-zinc-950 border-white font-medium'
                    : 'bg-[#18181C] text-zinc-400 border-white/[0.06] hover:text-zinc-200'
                }`}
              >
                {car}
              </button>
            ))}
          </div>
        </div>

        {/* Categoría (Chips: Auto, SUV, Camioneta) */}
        <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-3.5 space-y-2">
          <label className="text-xs font-medium text-zinc-400">Categoría del vehículo</label>
          <div className="grid grid-cols-3 gap-2">
            {VEHICLE_CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setCategory(cat)}
                className={`py-2 px-1 text-xs font-medium rounded-xl border transition flex items-center justify-center gap-1 ${
                  category === cat
                    ? 'bg-white text-zinc-950 border-white font-semibold'
                    : 'bg-[#18181C] text-zinc-400 border-white/[0.06] hover:text-zinc-200'
                }`}
              >
                {category === cat && <Check className="w-3 h-3 text-zinc-950" strokeWidth={2.5} />}
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Servicio Realizado */}
        <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-3.5 space-y-2">
          <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.75} />
            Servicio realizado
          </label>
          <div className="grid grid-cols-2 gap-2">
            {WASH_SERVICES.map((srv) => (
              <button
                type="button"
                key={srv}
                onClick={() => setService(srv)}
                className={`py-2 px-3 text-xs rounded-xl border text-left transition flex items-center justify-between ${
                  service === srv
                    ? 'bg-white text-zinc-950 border-white font-semibold'
                    : 'bg-[#18181C] text-zinc-400 border-white/[0.06] hover:text-zinc-200'
                }`}
              >
                <span>{srv}</span>
                {service === srv && <Check className="w-3 h-3 text-zinc-950" strokeWidth={2.5} />}
              </button>
            ))}
          </div>
        </div>

        {/* Monto cobrado ($ ARS) */}
        <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-3.5 space-y-2.5">
          <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.75} />
            Monto cobrado ($ ARS)
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
            {QUICK_AMOUNTS.map((amt) => (
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

        {/* Método de Pago */}
        <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-3.5 space-y-2">
          <label className="text-xs font-medium text-zinc-400">Método de cobro</label>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map((method) => {
              const isCash = method === 'Efectivo';
              const Icon = isCash ? Banknote : CreditCard;
              const isSelected = paymentMethod === method;
              return (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 px-3 text-xs rounded-xl border transition flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-white text-zinc-950 border-white font-semibold'
                      : 'bg-[#18181C] text-zinc-400 border-white/[0.06] hover:text-zinc-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-zinc-950' : 'text-zinc-400'}`} strokeWidth={1.75} />
                  <span>{method}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nota corta opcional */}
        <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-3.5 space-y-1.5">
          <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.75} />
            Nota u observación (opcional)
          </label>
          <input
            type="text"
            placeholder="ej. Muy embarrado, cliente de Instagram..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-[#18181C] text-white placeholder-zinc-600 border border-white/[0.08] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-white/30"
          />
        </div>

        {/* Botón Principal Guardar */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-4 rounded-2xl bg-[#FAFAFA] text-zinc-950 font-bold text-sm tracking-wide shadow-md hover:bg-white active:scale-[0.98] transition flex items-center justify-center gap-2 mt-2"
        >
          <Check className="w-4 h-4 text-zinc-950" strokeWidth={2.5} />
          <span>Registrar Lavado</span>
        </button>
      </form>
    </div>
  );
}

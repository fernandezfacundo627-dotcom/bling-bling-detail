import React, { useState, useEffect } from 'react';
import { X, Check, Trash2 } from 'lucide-react';
import { VEHICLE_CATEGORIES, WASH_SERVICES, EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../data/initialData';

export default function EditModal({ transaction, onClose, onSave, onDelete }) {
  if (!transaction) return null;

  const isWash = transaction.type === 'wash';

  const [date, setDate] = useState(transaction.date || '');
  const [amount, setAmount] = useState(transaction.amount || '');
  const [category, setCategory] = useState(transaction.category || (isWash ? 'Auto' : 'Shampoo'));
  const [vehicle, setVehicle] = useState(transaction.vehicle || '');
  const [service, setService] = useState(transaction.service || 'Lavado Full');
  const [paymentMethod, setPaymentMethod] = useState(transaction.paymentMethod || 'Transferencia');
  const [note, setNote] = useState(transaction.note || '');
  const [description, setDescription] = useState(transaction.description || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmt = Number(amount);
    if (!numAmt || numAmt <= 0) {
      alert("Ingresá un monto válido");
      return;
    }

    const updated = {
      ...transaction,
      date,
      amount: numAmt,
      category,
      ...(isWash ? {
        vehicle: vehicle.trim(),
        service,
        paymentMethod,
        note: note.trim()
      } : {
        description: description.trim()
      })
    };

    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#121215] border border-white/[0.12] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
              isWash ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {isWash ? 'Editar Lavado' : 'Editar Gasto'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Fecha */}
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#18181C] text-white border border-white/[0.08] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-white/30"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Monto ($ ARS)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#18181C] text-white border border-white/[0.08] rounded-xl px-3 py-2 text-sm font-semibold tabular-nums focus:outline-none focus:border-white/30"
              required
            />
          </div>

          {/* Wash specific fields */}
          {isWash ? (
            <>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Vehículo / Modelo</label>
                <input
                  type="text"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full bg-[#18181C] text-white border border-white/[0.08] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-white/30"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#18181C] text-white border border-white/[0.08] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-white/30"
                >
                  {VEHICLE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Servicio</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-[#18181C] text-white border border-white/[0.08] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-white/30"
                >
                  {WASH_SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Método de cobro</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-[#18181C] text-white border border-white/[0.08] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-white/30"
                >
                  {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Nota</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-[#18181C] text-white border border-white/[0.08] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-white/30"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Categoría de Gasto</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#18181C] text-white border border-white/[0.08] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-white/30"
                >
                  {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Descripción</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#18181C] text-white border border-white/[0.08] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-white/30"
                  required
                />
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                if (window.confirm("¿Seguro que deseás borrar este registro?")) {
                  onDelete(transaction.id);
                }
              }}
              className="py-3 px-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold flex items-center justify-center transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-white text-zinc-950 font-bold text-xs tracking-wide hover:bg-zinc-200 transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" strokeWidth={2.5} />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

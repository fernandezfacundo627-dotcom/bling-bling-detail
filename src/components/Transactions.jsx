import React, { useState, useMemo, useRef } from 'react';
import { 
  Car, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Pencil, 
  Trash2, 
  FileSpreadsheet, 
  Download, 
  Upload, 
  RotateCcw,
  Sparkles,
  Filter
} from 'lucide-react';
import { formatCurrency, formatFriendlyDate } from '../utils/date';
import { exportToCSV, exportToJSON, importFromJSON, resetToSampleData, clearAllTransactions } from '../utils/storage';

export default function Transactions({ 
  transactions, 
  onEditTransaction, 
  onDeleteTransaction, 
  setTransactions, 
  onImportToCloud,
  onShowToast 
}) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'wash' | 'expense'
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);

  // Filtered and sorted transactions
  const filteredList = useMemo(() => {
    let list = [...transactions];

    // Filter by type
    if (filterType === 'wash') {
      list = list.filter(t => t.type === 'wash');
    } else if (filterType === 'expense') {
      list = list.filter(t => t.type === 'expense');
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(t => {
        if (t.type === 'wash') {
          return (
            (t.vehicle && t.vehicle.toLowerCase().includes(q)) ||
            (t.category && t.category.toLowerCase().includes(q)) ||
            (t.service && t.service.toLowerCase().includes(q)) ||
            (t.paymentMethod && t.paymentMethod.toLowerCase().includes(q)) ||
            (t.note && t.note.toLowerCase().includes(q))
          );
        } else {
          return (
            (t.category && t.category.toLowerCase().includes(q)) ||
            (t.description && t.description.toLowerCase().includes(q))
          );
        }
      });
    }

    // Sort descending by date and creation time
    return list.sort((a, b) => {
      const dateA = a.date || '';
      const dateB = b.date || '';
      if (dateA !== dateB) return dateB.localeCompare(dateA);
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
  }, [transactions, filterType, searchQuery]);

  const counts = useMemo(() => {
    const washes = transactions.filter(t => t.type === 'wash').length;
    const expenses = transactions.filter(t => t.type === 'expense').length;
    return {
      all: transactions.length,
      wash: washes,
      expense: expenses
    };
  }, [transactions]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    importFromJSON(
      file,
      async (importedData) => {
        if (onImportToCloud) {
          await onImportToCloud(importedData);
        } else {
          setTransactions(importedData);
        }
        onShowToast(`Respaldo restaurado: ${importedData.length} registros`);
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      (errorMsg) => {
        alert(errorMsg);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    );
  };

  const handleResetSample = async () => {
    if (window.confirm("¿Cargar los datos de ejemplo de detailing e insumos?")) {
      const sample = resetToSampleData();
      if (onImportToCloud) {
        await onImportToCloud(sample);
      } else {
        setTransactions(sample);
      }
      onShowToast("Datos de prueba restaurados en la nube");
    }
  };

  const handleClearSample = () => {
    if (window.confirm("¿Limpiar todos los datos para empezar tu control en cero?")) {
      const empty = clearAllTransactions();
      setTransactions(empty);
      onShowToast("Base de datos limpia. ¡Listo para empezar!");
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Title & Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Movimientos</h2>
          <p className="text-xs text-zinc-400">Extracto histórico de lavados e insumos</p>
        </div>
        <span className="text-xs font-semibold text-zinc-400 tabular-nums bg-white/[0.05] border border-white/[0.08] px-2.5 py-1 rounded-xl">
          {filteredList.length} {filteredList.length === 1 ? 'registro' : 'registros'}
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
        <input
          type="text"
          placeholder="Buscar vehículo, servicio, gasto o nota..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#121215] text-white placeholder-zinc-500 pl-10 pr-4 py-2.5 rounded-2xl text-xs border border-white/[0.08] focus:outline-none focus:border-white/30 transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Filter Tabs (Todos / Lavados / Gastos) */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#121215] border border-white/[0.08]">
        <button
          onClick={() => setFilterType('all')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition ${
            filterType === 'all'
              ? 'bg-white text-zinc-950 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Todos <span className="text-[10px] opacity-75 tabular-nums">({counts.all})</span>
        </button>
        <button
          onClick={() => setFilterType('wash')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition ${
            filterType === 'wash'
              ? 'bg-white text-zinc-950 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Lavados <span className="text-[10px] opacity-75 tabular-nums">({counts.wash})</span>
        </button>
        <button
          onClick={() => setFilterType('expense')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition ${
            filterType === 'expense'
              ? 'bg-white text-zinc-950 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Gastos <span className="text-[10px] opacity-75 tabular-nums">({counts.expense})</span>
        </button>
      </div>

      {/* List of Movements */}
      <div className="space-y-2.5">
        {filteredList.length === 0 ? (
          <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-8 text-center space-y-2">
            <p className="text-zinc-400 text-xs">No se encontraron movimientos con este criterio</p>
            {transactions.length === 0 && (
              <button
                onClick={handleResetSample}
                className="text-xs text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1 mt-2"
              >
                <RotateCcw className="w-3 h-3" />
                Cargar datos de prueba
              </button>
            )}
          </div>
        ) : (
          filteredList.map((tx) => {
            const isWash = tx.type === 'wash';
            return (
              <div
                key={tx.id}
                className="group relative rounded-2xl bg-[#121215] border border-white/[0.08] p-3.5 hover:border-white/[0.16] transition flex items-center justify-between gap-3 shadow-sm"
              >
                {/* Left side icon & details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isWash 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {isWash ? (
                      <Car className="w-4 h-4" strokeWidth={1.75} />
                    ) : (
                      <ShoppingBag className="w-4 h-4" strokeWidth={1.75} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-white truncate max-w-[170px]">
                        {isWash ? tx.vehicle : tx.description}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border ${
                        isWash 
                          ? 'bg-white/[0.06] text-zinc-400 border-white/[0.04]' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {isWash ? tx.category : 'Insumo'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-400">
                      <span>{formatFriendlyDate(tx.date)}</span>
                      {isWash && (
                        <>
                          <span>•</span>
                          <span>{tx.service}</span>
                        </>
                      )}
                      {isWash && tx.paymentMethod && (
                        <>
                          <span>•</span>
                          <span className="text-zinc-400">{tx.paymentMethod}</span>
                        </>
                      )}
                    </div>

                    {tx.note && (
                      <p className="text-[10px] text-zinc-500 italic mt-0.5 truncate max-w-[200px]">
                        "{tx.note}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right side Amount and Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <span className={`text-sm font-bold tabular-nums block ${
                      isWash ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {isWash ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </div>

                  {/* Edit and Delete Buttons */}
                  <div className="flex items-center gap-1 pl-1">
                    <button
                      onClick={() => onEditTransaction(tx)}
                      className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-zinc-400 hover:text-white flex items-center justify-center transition"
                      title="Editar movimiento"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("¿Seguro que deseás borrar este registro?")) {
                          onDeleteTransaction(tx.id);
                        }
                      }}
                      className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 flex items-center justify-center transition"
                      title="Borrar movimiento"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Respaldo y Herramientas */}
      <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-4 space-y-3 mt-6">
        <div>
          <h3 className="text-xs font-bold text-white tracking-wide uppercase">
            Respaldo y Exportación
          </h3>
          <p className="text-[11px] text-zinc-400">
            Descargá tus datos para Excel o guardá copias de seguridad
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* CSV Export */}
          <button
            onClick={() => exportToCSV(transactions)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-white transition active:scale-95"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.75} />
            <span>Exportar CSV</span>
          </button>

          {/* JSON Export */}
          <button
            onClick={() => exportToJSON(transactions)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-white transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-zinc-300" strokeWidth={1.75} />
            <span>Backup JSON</span>
          </button>
        </div>

        {/* Restore JSON */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json,application/json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#18181C] hover:bg-[#202026] border border-white/[0.06] text-xs text-zinc-300 transition"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.75} />
            <span>Restaurar Copia de Seguridad (JSON)</span>
          </button>
        </div>

        {/* Discreet sample data reset / clean actions */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
          <button
            onClick={handleClearSample}
            className="text-zinc-500 hover:text-rose-400 transition"
          >
            Limpiar datos de prueba
          </button>
          <button
            onClick={handleResetSample}
            className="text-zinc-500 hover:text-zinc-300 transition"
          >
            Restaurar ejemplos
          </button>
        </div>
      </div>
    </div>
  );
}

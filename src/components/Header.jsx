import React, { useState } from 'react';
import { Sparkles, Download, FileSpreadsheet, RotateCcw, Trash2, HelpCircle, Cloud, CloudOff } from 'lucide-react';
import { exportToCSV, exportToJSON, resetToSampleData } from '../utils/storage';

export default function Header({ 
  transactions, 
  setTransactions, 
  isCloudSynced, 
  onClearAllCloud, 
  onImportToCloud, 
  onShowToast 
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleResetSample = async () => {
    if (window.confirm("¿Restaurar los datos de ejemplo iniciales en la nube?")) {
      const sample = resetToSampleData();
      if (onImportToCloud) {
        await onImportToCloud(sample);
      } else {
        setTransactions(sample);
      }
      onShowToast("Datos de ejemplo cargados en la nube");
      setMenuOpen(false);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm("¿Seguro que querés borrar TODOS los registros? Esta acción los eliminará también de la nube.")) {
      if (onClearAllCloud) {
        await onClearAllCloud();
      } else {
        setTransactions([]);
      }
      setMenuOpen(false);
    }
  };

  const handleExportCSV = () => {
    exportToCSV(transactions);
    setMenuOpen(false);
    onShowToast("CSV exportado con éxito");
  };

  const handleExportJSON = () => {
    exportToJSON(transactions);
    setMenuOpen(false);
    onShowToast("Backup JSON descargado");
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#09090B]/90 backdrop-blur-md border-b border-white/[0.08] px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white shadow-inner">
            <Sparkles className="w-4 h-4 text-emerald-400" strokeWidth={2} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-[#FAFAFA]">Bling Bling</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-white/[0.07] text-zinc-400 border border-white/[0.05]">Detail</span>
            </div>
            <p className="text-[11px] text-zinc-400 tracking-tight">Control Financiero</p>
          </div>
        </div>

        {/* Cloud Status & Menu */}
        <div className="flex items-center gap-2">
          {/* Cloud Sync Status Indicator */}
          <div 
            className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white/[0.04] border border-white/[0.07] text-[10px] text-zinc-400"
            title={isCloudSynced ? "Sincronizado en tiempo real con Firebase" : "Guardado en caché local"}
          >
            {isCloudSynced ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <Cloud className="w-3 h-3 text-emerald-400" />
                <span className="hidden xs:inline text-zinc-300 font-medium">Nube</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <CloudOff className="w-3 h-3 text-zinc-500" />
                <span className="hidden xs:inline text-zinc-400">Local</span>
              </>
            )}
          </div>

          {/* Quick Menu Button */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition active:scale-95"
              aria-label="Opciones y Respaldo"
            >
              <HelpCircle className="w-4 h-4" strokeWidth={1.75} />
            </button>

            {menuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" 
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-10 z-50 w-60 p-1.5 rounded-2xl bg-[#121215] border border-white/[0.12] shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-white/[0.06]">
                    <p className="text-xs font-semibold text-white">Bling Bling Detail</p>
                    <p className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isCloudSynced ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      {isCloudSynced ? 'Conectado a Firebase (Nube)' : 'Almacenamiento Local'}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={handleExportCSV}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition text-left"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.75} />
                      <span>Exportar Excel (CSV)</span>
                    </button>
                    <button
                      onClick={handleExportJSON}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition text-left"
                    >
                      <Download className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.75} />
                      <span>Descargar Backup JSON</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-white/[0.06]">
                    <button
                      onClick={handleResetSample}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] rounded-xl transition text-left"
                    >
                      <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
                      <span>Cargar datos de ejemplo</span>
                    </button>
                    <button
                      onClick={handleClearAll}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition text-left"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                      <span>Borrar todos los datos</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

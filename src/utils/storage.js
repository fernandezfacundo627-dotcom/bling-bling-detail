import { INITIAL_TRANSACTIONS, SAMPLE_TRANSACTIONS } from '../data/initialData';

const STORAGE_KEY = 'bling_bling_transactions_clean_v1';

/**
 * Loads transactions from localStorage or initializes empty list
 */
export function loadTransactions() {
  try {
    // Clear old sample cache if present
    localStorage.removeItem('bling_bling_transactions_v1');
    localStorage.removeItem('bling_bling_transactions_v2');

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error reading localStorage", err);
    return [];
  }
}

/**
 * Saves transactions array to localStorage
 */
export function saveTransactions(transactions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (err) {
    console.error("Error saving to localStorage", err);
  }
}

/**
 * Resets data to initial sample data (optional testing tool)
 */
export function resetToSampleData() {
  saveTransactions(SAMPLE_TRANSACTIONS);
  return SAMPLE_TRANSACTIONS;
}

/**
 * Clears all data to an empty list
 */
export function clearAllTransactions() {
  saveTransactions([]);
  return [];
}

/**
 * Exports transactions as CSV with Excel UTF-8 BOM
 */
export function exportToCSV(transactions) {
  if (!transactions || !transactions.length) {
    alert("No hay transacciones registradas para exportar.");
    return;
  }

  const headers = [
    "ID",
    "Tipo",
    "Fecha",
    "Vehículo / Concepto",
    "Categoría",
    "Servicio / Detalle",
    "Método de Pago",
    "Monto ($ ARS)",
    "Nota"
  ];

  const escapeCSV = (val) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = transactions.map(t => {
    const isWash = t.type === 'wash';
    return [
      escapeCSV(t.id),
      escapeCSV(isWash ? 'Lavado' : 'Gasto'),
      escapeCSV(t.date),
      escapeCSV(isWash ? t.vehicle : t.description),
      escapeCSV(t.category),
      escapeCSV(isWash ? t.service : t.category),
      escapeCSV(isWash ? (t.paymentMethod || 'Efectivo') : 'Gasto Insumo'),
      escapeCSV(isWash ? t.amount : -t.amount),
      escapeCSV(t.note || '')
    ].join(';');
  });

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `bling_bling_extracto_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports full JSON backup file
 */
export function exportToJSON(transactions) {
  const data = {
    appName: "Bling Bling Detail",
    version: "1.0",
    exportedAt: new Date().toISOString(),
    totalRecords: transactions.length,
    transactions
  };

  const jsonString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const link = document.createElement('a');
  link.setAttribute("href", jsonString);
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute("download", `bling_bling_backup_${dateStr}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Imports and validates JSON backup file
 */
export function importFromJSON(file, onSuccess, onError) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      let list = [];
      if (Array.isArray(parsed)) {
        list = parsed;
      } else if (parsed && Array.isArray(parsed.transactions)) {
        list = parsed.transactions;
      } else {
        throw new Error("Estructura de archivo de respaldo no válida.");
      }
      saveTransactions(list);
      onSuccess(list);
    } catch (err) {
      console.error(err);
      onError(err.message || "Error al procesar el archivo JSON.");
    }
  };
  reader.onerror = () => {
    onError("Error al leer el archivo.");
  };
  reader.readAsText(file);
}

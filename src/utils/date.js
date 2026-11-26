/**
 * Formats a number as Argentine Pesos (ARS)
 */
export function formatCurrency(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) return '$ 0';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount).replace('ARS', '$').trim();
}

/**
 * Returns formatted date string: '25 nov 2026' or 'Hoy', 'Ayer'
 */
export function formatFriendlyDate(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const today = new Date();
  const isToday = today.getFullYear() === year && today.getMonth() === (month - 1) && today.getDate() === day;
  
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const isYesterday = yesterday.getFullYear() === year && yesterday.getMonth() === (month - 1) && yesterday.getDate() === day;
  
  if (isToday) return 'Hoy';
  if (isYesterday) return 'Ayer';
  
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Get start and end dates for the most recent weekend (Friday to Sunday)
 */
export function getWeekendRange(referenceDate = new Date()) {
  const current = new Date(referenceDate);
  const dayOfWeek = current.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
  
  let fri = new Date(current);
  let sun = new Date(current);
  
  if (dayOfWeek === 0) { // Sunday
    fri.setDate(current.getDate() - 2);
    sun.setDate(current.getDate());
  } else if (dayOfWeek === 6) { // Saturday
    fri.setDate(current.getDate() - 1);
    sun.setDate(current.getDate() + 1);
  } else if (dayOfWeek === 5) { // Friday
    fri.setDate(current.getDate());
    sun.setDate(current.getDate() + 2);
  } else {
    // Mon-Thu: calculate the preceding weekend
    fri.setDate(current.getDate() - (dayOfWeek + 2));
    sun.setDate(current.getDate() - (dayOfWeek - 0));
  }
  
  const toYMD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  
  return {
    start: toYMD(fri),
    end: toYMD(sun),
  };
}

/**
 * Filters transactions based on time frame: 'finde', 'mes', 'total'
 */
export function filterTransactionsByPeriod(transactions, period) {
  if (!Array.isArray(transactions)) return [];
  if (period === 'total') return transactions;

  const today = new Date();
  const currentYearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  if (period === 'mes') {
    return transactions.filter(t => t.date && t.date.startsWith(currentYearMonth));
  }

  if (period === 'finde') {
    const { start, end } = getWeekendRange(today);
    return transactions.filter(t => t.date >= start && t.date <= end);
  }

  return transactions;
}

/**
 * Get today in YYYY-MM-DD
 */
export function getTodayString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Initial state: empty so the user can start from scratch
export const INITIAL_TRANSACTIONS = [];

// Sample data kept only for the optional "Restaurar ejemplos" button
export const SAMPLE_TRANSACTIONS = [
  {
    id: "tx-1",
    type: "wash",
    date: "2026-11-25",
    vehicle: "VW Gol Trend",
    category: "Auto",
    service: "Lavado Full",
    amount: 18000,
    paymentMethod: "Transferencia",
    note: "Limpieza profunda de llantas y pasarruedas",
    createdAt: "2026-11-25T11:30:00.000Z"
  },
  {
    id: "tx-2",
    type: "wash",
    date: "2026-11-24",
    vehicle: "Toyota Hilux GR",
    category: "Camioneta",
    service: "Cera / Sellado",
    amount: 42000,
    paymentMethod: "Efectivo",
    note: "Sellado cerámico rápido Menzerna",
    createdAt: "2026-11-24T16:15:00.000Z"
  },
  {
    id: "tx-3",
    type: "expense",
    date: "2026-11-23",
    category: "Microfibras",
    amount: 14500,
    description: "Pack 6 microfibras 40x40 600gsm",
    createdAt: "2026-11-23T18:00:00.000Z"
  },
  {
    id: "tx-4",
    type: "wash",
    date: "2026-11-22",
    vehicle: "Jeep Renegade",
    category: "SUV",
    service: "Interior",
    amount: 26000,
    paymentMethod: "Transferencia",
    note: "Nutrición de plásticos y cueros",
    createdAt: "2026-11-22T14:20:00.000Z"
  },
  {
    id: "tx-5",
    type: "wash",
    date: "2026-11-21",
    vehicle: "Peugeot 208 GT",
    category: "Auto",
    service: "Lavado Full",
    amount: 20000,
    paymentMethod: "Efectivo",
    note: "Descontaminado férrico",
    createdAt: "2026-11-21T10:45:00.000Z"
  },
  {
    id: "tx-6",
    type: "expense",
    date: "2026-11-20",
    category: "Shampoo",
    amount: 22000,
    description: "Bidón 5L Vonixx V-Floc ph neutro",
    createdAt: "2026-11-20T09:30:00.000Z"
  }
];

export const VEHICLE_CATEGORIES = ["Auto", "SUV", "Camioneta"];

export const WASH_SERVICES = [
  "Lavado Full",
  "Interior",
  "Cera / Sellado",
  "Motor"
];

export const EXPENSE_CATEGORIES = [
  "Shampoo",
  "Cera",
  "Microfibras",
  "Nafta / Traslado",
  "Equipamiento",
  "Otros"
];

export const PAYMENT_METHODS = ["Efectivo", "Transferencia"];

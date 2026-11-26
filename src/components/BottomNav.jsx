import React from 'react';
import { LayoutDashboard, Car, Receipt, ArrowLeftRight } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
    { id: 'wash', label: '+ Lavado', icon: Car },
    { id: 'expense', label: '+ Gasto', icon: Receipt },
    { id: 'transactions', label: 'Movimientos', icon: ArrowLeftRight },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#09090B]/90 backdrop-blur-md border-t border-white/[0.08] pb-safe">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-white' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-white/[0.06] rounded-xl -z-10 animate-in fade-in duration-150" />
              )}
              <Icon 
                className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-white' : ''}`} 
                strokeWidth={1.75} 
              />
              <span className={`text-[11px] mt-1 font-medium tracking-tight ${isActive ? 'font-semibold text-white' : 'text-zinc-400'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

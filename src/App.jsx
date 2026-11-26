import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import WashForm from './components/WashForm';
import ExpenseForm from './components/ExpenseForm';
import Transactions from './components/Transactions';
import EditModal from './components/EditModal';
import SpotifyPlayer from './components/SpotifyPlayer';
import { loadTransactions, saveTransactions } from './utils/storage';
import { 
  subscribeToTransactions, 
  saveTransactionToCloud, 
  deleteTransactionFromCloud, 
  clearAllTransactionsInCloud, 
  importTransactionsToCloud 
} from './firebase';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [transactions, setTransactions] = useState(() => loadTransactions());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  // Real-time Firestore sync
  useEffect(() => {
    const unsubscribe = subscribeToTransactions(
      (cloudList) => {
        setTransactions(cloudList);
        saveTransactions(cloudList);
        setIsCloudSynced(true);
      },
      (error) => {
        console.warn("Could not connect to Firestore, falling back to local storage:", error);
        setIsCloudSynced(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3200);
  };

  const handleAddTransaction = async (newTx) => {
    // Optimistic local update
    setTransactions((prev) => [newTx, ...prev]);
    saveTransactions([newTx, ...transactions]);

    // Cloud update
    try {
      await saveTransactionToCloud(newTx);
    } catch (err) {
      console.error("Cloud save error:", err);
    }
  };

  const handleSaveEditedTransaction = async (updatedTx) => {
    // Optimistic local update
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTx.id ? updatedTx : t))
    );
    setEditingTransaction(null);
    showToast("Movimiento actualizado");

    // Cloud update
    try {
      await saveTransactionToCloud(updatedTx);
    } catch (err) {
      console.error("Cloud update error:", err);
    }
  };

  const handleDeleteTransaction = async (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    if (editingTransaction?.id === id) {
      setEditingTransaction(null);
    }
    showToast("Registro eliminado");

    // Cloud delete
    try {
      await deleteTransactionFromCloud(id);
    } catch (err) {
      console.error("Cloud delete error:", err);
    }
  };

  const handleClearAll = async () => {
    setTransactions([]);
    saveTransactions([]);
    try {
      await clearAllTransactionsInCloud();
      showToast("Todos los datos fueron borrados en la nube");
    } catch (err) {
      console.error(err);
    }
  };

  const handleImportToCloud = async (importedList) => {
    setTransactions(importedList);
    saveTransactions(importedList);
    try {
      await importTransactionsToCloud(importedList);
      showToast("Datos sincronizados en la nube");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex flex-col selection:bg-zinc-800">
      {/* App Header with Cloud status */}
      <Header
        transactions={transactions}
        setTransactions={setTransactions}
        isCloudSynced={isCloudSynced}
        onClearAllCloud={handleClearAll}
        onImportToCloud={handleImportToCloud}
        onShowToast={showToast}
      />

      {/* Main Content Area constrained to mobile width */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-3">
        {/* Spotify Official Playlist Player */}
        <SpotifyPlayer />

        {activeTab === 'dashboard' && (
          <Dashboard
            transactions={transactions}
            onNavigateTo={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'wash' && (
          <WashForm
            onAddTransaction={handleAddTransaction}
            onShowToast={showToast}
            onFinished={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'expense' && (
          <ExpenseForm
            onAddTransaction={handleAddTransaction}
            onShowToast={showToast}
            onFinished={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'transactions' && (
          <Transactions
            transactions={transactions}
            onEditTransaction={(tx) => setEditingTransaction(tx)}
            onDeleteTransaction={handleDeleteTransaction}
            setTransactions={setTransactions}
            onImportToCloud={handleImportToCloud}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Edit Modal */}
      {editingTransaction && (
        <EditModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSave={handleSaveEditedTransaction}
          onDelete={handleDeleteTransaction}
        />
      )}

      {/* Mobile-first Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-xs w-[90%] pointer-events-none animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="bg-[#18181C] border border-white/[0.14] text-white text-xs px-3.5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="font-medium truncate">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

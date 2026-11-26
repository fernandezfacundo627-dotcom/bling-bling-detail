import { initializeApp } from "firebase/app";
import { 
  initializeFirestore,
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  writeBatch,
  getDocs 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWvc1U9ot4Tn6zlOZncMtU6BJkkfV2sYU",
  authDomain: "bling-bling-detail.firebaseapp.com",
  projectId: "bling-bling-detail",
  storageBucket: "bling-bling-detail.firebasestorage.app",
  messagingSenderId: "9298929805",
  appId: "1:9298929805:web:ba4c6b9d45a35383845ac4",
  measurementId: "G-1RML1S502B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use experimentalForceLongPolling to avoid hanging/aborted WebChannel streams across mobile and desktop
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});

const COLLECTION_NAME = "transactions";

/**
 * Subscribes to live real-time updates from Firestore
 */
export function subscribeToTransactions(onSuccess, onError) {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const list = [];
        snapshot.forEach((doc) => {
          list.push(doc.data());
        });
        // Sort descending by date and createdAt
        list.sort((a, b) => {
          const dateA = a.date || '';
          const dateB = b.date || '';
          if (dateA !== dateB) return dateB.localeCompare(dateA);
          return (b.createdAt || '').localeCompare(a.createdAt || '');
        });
        onSuccess(list);
      },
      (error) => {
        console.error("Firestore sync error:", error);
        if (onError) onError(error);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.error("Failed to setup listener:", err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Saves or updates a transaction in Firestore
 */
export async function saveTransactionToCloud(transaction) {
  if (!transaction || !transaction.id) return;
  const docRef = doc(db, COLLECTION_NAME, transaction.id);
  await setDoc(docRef, transaction, { merge: true });
}

/**
 * Deletes a transaction from Firestore
 */
export async function deleteTransactionFromCloud(id) {
  if (!id) return;
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

/**
 * Clears all transactions in Firestore using batching
 */
export async function clearAllTransactionsInCloud() {
  const colRef = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(colRef);
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => {
    batch.delete(d.ref);
  });
  await batch.commit();
}

/**
 * Imports an array of transactions to Firestore
 */
export async function importTransactionsToCloud(list) {
  if (!Array.isArray(list) || list.length === 0) return;
  const batch = writeBatch(db);
  list.forEach((item) => {
    if (item && item.id) {
      const docRef = doc(db, COLLECTION_NAME, item.id);
      batch.set(docRef, item, { merge: true });
    }
  });
  await batch.commit();
}

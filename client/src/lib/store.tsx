import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UNITS, 
  TENANTS, 
  MOCK_BANK_INCOME, 
  MOCK_CARD_EXPENSES, 
  MOCK_CASH_INTENTS,
  type Unit, 
  type Tenant, 
  type BankTransaction 
} from './mockData';

interface AppState {
  units: Unit[];
  tenants: Tenant[];
  incomeTransactions: BankTransaction[];
  expenseTransactions: BankTransaction[];
  cashIntents: any[];
  
  updateIncomeTransaction: (id: string, updates: Partial<BankTransaction>) => void;
  updateExpenseTransaction: (id: string, updates: Partial<BankTransaction>) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [incomeTransactions, setIncomeTransactions] = useState<BankTransaction[]>(MOCK_BANK_INCOME);
  const [expenseTransactions, setExpenseTransactions] = useState<BankTransaction[]>(MOCK_CARD_EXPENSES);
  const [cashIntents, setCashIntents] = useState<any[]>(MOCK_CASH_INTENTS);

  // Auto-match logic (Simulated for "Flujo de trabajo 1: Banco")
  useEffect(() => {
    // Run once on mount to simulate the "Auto-detect" feature
    setIncomeTransactions(prev => prev.map(tx => {
      if (tx.status !== 'pending') return tx;

      // Simple heuristic matching
      const foundTenant = TENANTS.find(t => 
        tx.description.toUpperCase().includes(t.name.toUpperCase().split(' ')[0]) || // Match first name
        tx.amount === t.monthlyRent
      );

      if (foundTenant) {
        return {
          ...tx,
          status: tx.amount === foundTenant.monthlyRent ? 'matched' : 'review',
          matchId: foundTenant.unitId,
          note: tx.amount === foundTenant.monthlyRent ? 'Coincidencia exacta' : 'Monto difiere de renta base'
        };
      }
      return tx;
    }));
  }, []);

  const updateIncomeTransaction = (id: string, updates: Partial<BankTransaction>) => {
    setIncomeTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...updates } : tx));
  };

  const updateExpenseTransaction = (id: string, updates: Partial<BankTransaction>) => {
    setExpenseTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...updates } : tx));
  };

  return (
    <AppContext.Provider value={{
      units: UNITS,
      tenants: TENANTS,
      incomeTransactions,
      expenseTransactions,
      cashIntents,
      updateIncomeTransaction,
      updateExpenseTransaction
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}

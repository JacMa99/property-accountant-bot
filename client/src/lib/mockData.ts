export type UnitType = 'Apto' | 'Casa' | 'Lote';

export interface Unit {
  id: string;
  type: UnitType;
  name: string;
}

export interface Tenant {
  id: string;
  name: string;
  unitId: string;
  monthlyRent: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  totalBudget: number;
  status: 'active' | 'completed';
}

export interface LineItem {
  id: string;
  projectId: string;
  description: string;
  amount: number;
  date: string;
  category: 'equipment' | 'software' | 'installation' | 'cash' | 'other';
}

export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  status: 'pending' | 'matched' | 'review';
  matchId?: string;
  projectId?: string; // New field for linking to projects
  note?: string;
}

export const UNITS: Unit[] = [
  { id: 'ED-A1', type: 'Apto', name: 'Edificio Apt 1' },
  { id: 'ED-A2', type: 'Apto', name: 'Edificio Apt 2' },
  { id: 'ED-A3', type: 'Apto', name: 'Edificio Apt 3' },
  { id: 'ED-A4', type: 'Apto', name: 'Edificio Apt 4' },
  { id: 'ED-A5', type: 'Apto', name: 'Edificio Apt 5' },
  { id: 'ED-A6', type: 'Apto', name: 'Edificio Apt 6' },
  { id: 'ED-A7', type: 'Apto', name: 'Edificio Apt 7' },
  { id: 'CASA', type: 'Casa', name: 'Casa' },
  { id: 'LOTE-1', type: 'Lote', name: 'Lote 1 (Vacante)' },
  { id: 'LOTE-2', type: 'Lote', name: 'Lote 2' },
  { id: 'LOTE-3', type: 'Lote', name: 'Lote 3' },
  { id: 'LOTE-4', type: 'Lote', name: 'Lote 4' },
  { id: 'APT-IND', type: 'Apto', name: 'Apto Individual' },
];

export const TENANTS: Tenant[] = [
  { id: 't1', name: 'Tio Chirre', unitId: 'ED-A1', monthlyRent: 8000 },
  { id: 't2', name: 'Rafael Arias (Jochi)', unitId: 'ED-A2', monthlyRent: 5000 },
  { id: 't3', name: 'Edwin Abreu', unitId: 'ED-A3', monthlyRent: 8000 },
  { id: 't4', name: 'Roberto Diaz', unitId: 'ED-A4', monthlyRent: 10510 },
  { id: 't5', name: 'Miguel Ortiz', unitId: 'ED-A5', monthlyRent: 6000 },
  { id: 't6', name: 'Jonathan', unitId: 'ED-A6', monthlyRent: 8000 },
  { id: 't7', name: 'Juan Alberto', unitId: 'ED-A7', monthlyRent: 7500 },
  { id: 't8', name: 'Julissa Bueno', unitId: 'CASA', monthlyRent: 9350 },
  { id: 't9', name: 'Sarita y Asociados', unitId: 'LOTE-2', monthlyRent: 26250 },
  { id: 't10', name: 'Coccia Dominicana', unitId: 'LOTE-3', monthlyRent: 24200 },
  { id: 't11', name: 'Rafael Arias (Jochi)', unitId: 'LOTE-4', monthlyRent: 6000 },
  { id: 't12', name: 'Rafelito Mirabal', unitId: 'APT-IND', monthlyRent: 10000 },
];

export const PROJECTS: Project[] = [
  { id: 'p1', name: 'Cámaras de Seguridad', description: 'Instalación de sistema perimetral', totalBudget: 50000, status: 'active' },
  { id: 'p2', name: 'Remodelación Lote 4', description: 'Mejoras estructurales y pintura', totalBudget: 120000, status: 'active' },
];

export const LINE_ITEMS: LineItem[] = [
  { id: 'li1', projectId: 'p1', description: 'Kit 8 Cámaras 4K', amount: 25000, date: '2024-02-10', category: 'equipment' },
  { id: 'li2', projectId: 'p1', description: 'Instalación técnica', amount: 15000, date: '2024-02-12', category: 'installation' },
  { id: 'li3', projectId: 'p1', description: 'Licencia Cloud', amount: 5000, date: '2024-02-13', category: 'software' },
];

export const MOCK_BANK_INCOME: BankTransaction[] = [
  { id: 'b1', date: '2024-02-01', description: 'DEP. TIO CHIRRE RENTA', amount: 8000, type: 'deposit', status: 'pending' },
  { id: 'b2', date: '2024-02-02', description: 'TRANSFERENCIA EDWIN ABREU', amount: 8000, type: 'deposit', status: 'pending' },
  { id: 'b3', date: '2024-02-03', description: 'DEP. COCCIA DOMINICANA', amount: 24200, type: 'deposit', status: 'pending' },
  { id: 'b4', date: '2024-02-05', description: 'DEPOSITO JOCHI', amount: 11000, type: 'deposit', status: 'pending' },
  { id: 'b5', date: '2024-02-05', description: 'TRANSFERENCIA RECIBIDA', amount: 9350, type: 'deposit', status: 'pending' },
  { id: 'b6', date: '2024-02-10', description: 'DEP. ROBERTO DIAZ', amount: 10500, type: 'deposit', status: 'pending' },
  { id: 'b7', date: '2024-02-15', description: 'DEP. SARITA RENTA FEB', amount: 26250, type: 'deposit', status: 'pending' },
  { id: 'b8', date: '2024-02-28', description: 'ATM RETIRO', amount: -5000, type: 'withdrawal', status: 'pending' },
];

export const MOCK_CARD_EXPENSES: BankTransaction[] = [
  { id: 'c1', date: '2024-02-02', description: 'SUPERMERCADO BRAVO', amount: -3500.50, type: 'withdrawal', status: 'pending' },
  { id: 'c2', date: '2024-02-05', description: 'FERRETERIA OCHOA', amount: -1200.00, type: 'withdrawal', status: 'pending' },
  { id: 'c3', date: '2024-02-12', description: 'EDESUR FACTURA', amount: -2100.00, type: 'withdrawal', status: 'pending' },
  { id: 'c4', date: '2024-02-15', description: 'PINTURA TROPICAL', amount: -4500.00, type: 'withdrawal', status: 'pending' },
];

export const MOCK_CASH_INTENTS = [
  { id: 'w1', date: '2024-02-28', amount: 5000, purpose: 'Pago Jardinero y Materiales menores', status: 'pending' }
];

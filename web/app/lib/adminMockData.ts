export type AdminOverview = {
  activeMachines: number;
  inactiveMachines: number;
  totalCreditsToday: number;
  activePlayers: number;
};

export type RevenueByGame = {
  gameTitle: string;
  credits: number;
};

export type AdminRecentActivity = {
  id: string;
  description: string;
  timestamp: string;
};

export const mockAdminCredentials = {
  username: "admin",
  password: "123456",
};

export const mockAdminOverview: AdminOverview = {
  activeMachines: 18,
  inactiveMachines: 2,
  totalCreditsToday: 1240,
  activePlayers: 37,
};

export const mockRevenueByGame: RevenueByGame[] = [
  { gameTitle: "Pac-Man", credits: 320 },
  { gameTitle: "Street Fighter II", credits: 280 },
  { gameTitle: "Galaga", credits: 210 },
  { gameTitle: "Mortal Kombat", credits: 190 },
  { gameTitle: "Space Invaders", credits: 140 },
  { gameTitle: "Donkey Kong", credits: 100 },
];

export const mockAdminActivities: AdminRecentActivity[] = [
  {
    id: "act_001",
    description: "Machine machine_03 restarted successfully",
    timestamp: "2026-04-07 10:22",
  },
  {
    id: "act_002",
    description: "Credits refill processed for card 1234****3456",
    timestamp: "2026-04-07 10:05",
  },
  {
    id: "act_003",
    description: "New high score registered on Pac-Man",
    timestamp: "2026-04-07 09:48",
  },
];

// --- Financial Reports ---
export type FinancialReportItem = {
  date: string;
  chipsSold: number;
  drinksSold: number;
  totalRevenue: number;
};

export const mockFinancialReport: FinancialReportItem[] = [
  {
    date: "2026-04-07",
    chipsSold: 150,
    drinksSold: 45,
    totalRevenue: 850.5,
  },
  {
    date: "2026-04-06",
    chipsSold: 140,
    drinksSold: 42,
    totalRevenue: 790.2,
  },
  {
    date: "2026-04-05",
    chipsSold: 165,
    drinksSold: 52,
    totalRevenue: 920.75,
  },
  {
    date: "2026-04-04",
    chipsSold: 130,
    drinksSold: 38,
    totalRevenue: 720.3,
  },
  {
    date: "2026-04-03",
    chipsSold: 175,
    drinksSold: 58,
    totalRevenue: 980.6,
  },
];

// --- Machine Revenue ---
export type MachineRevenueItem = {
  machineId: string;
  gameName: string;
  location: string;
  chipsRevenue: number;
  drinksRevenue: number;
  totalRevenue: number;
  lastMaintenance: string;
};

export const mockMachineRevenue: MachineRevenueItem[] = [
  {
    machineId: "machine_01",
    gameName: "Pac-Man",
    location: "Main Hall",
    chipsRevenue: 450.0,
    drinksRevenue: 120.0,
    totalRevenue: 570.0,
    lastMaintenance: "2026-03-28",
  },
  {
    machineId: "machine_02",
    gameName: "Space Invaders",
    location: "Main Hall",
    chipsRevenue: 380.0,
    drinksRevenue: 95.0,
    totalRevenue: 475.0,
    lastMaintenance: "2026-03-25",
  },
  {
    machineId: "machine_03",
    gameName: "Galaga",
    location: "Back Room",
    chipsRevenue: 320.0,
    drinksRevenue: 85.0,
    totalRevenue: 405.0,
    lastMaintenance: "2026-04-01",
  },
  {
    machineId: "machine_04",
    gameName: "Street Fighter II",
    location: "Main Hall",
    chipsRevenue: 520.0,
    drinksRevenue: 140.0,
    totalRevenue: 660.0,
    lastMaintenance: "2026-03-22",
  },
  {
    machineId: "machine_05",
    gameName: "Mortal Kombat",
    location: "VIP Room",
    chipsRevenue: 410.0,
    drinksRevenue: 105.0,
    totalRevenue: 515.0,
    lastMaintenance: "2026-03-30",
  },
];

// --- Employees ---
export type Employee = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  permissions: string[];
  hireDate: string;
  status: "active" | "inactive";
};

export const mockEmployees: Employee[] = [
  {
    id: "emp_001",
    name: "Carlos Silva",
    role: "Manager",
    email: "carlos@fliperama.com",
    phone: "(11) 98765-4321",
    permissions: ["view_reports", "manage_employees", "manage_machines"],
    hireDate: "2024-01-15",
    status: "active",
  },
  {
    id: "emp_002",
    name: "Ana Souza",
    role: "Operator",
    email: "ana@fliperama.com",
    phone: "(11) 97654-3210",
    permissions: ["view_reports", "manage_machines"],
    hireDate: "2024-06-20",
    status: "active",
  },
  {
    id: "emp_003",
    name: "Bruno Costa",
    role: "Maintenance",
    email: "bruno@fliperama.com",
    phone: "(11) 96543-2109",
    permissions: ["manage_machines"],
    hireDate: "2024-03-10",
    status: "active",
  },
  {
    id: "emp_004",
    name: "Fernanda Lima",
    role: "Cashier",
    email: "fernanda@fliperama.com",
    phone: "(11) 95432-1098",
    permissions: ["view_reports"],
    hireDate: "2024-11-01",
    status: "inactive",
  },
];

// --- Attendance Records ---
export type AttendanceRecord = {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  hoursWorked: number;
  status: "present" | "absent" | "late" | "half-day";
};

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: "att_001",
    employeeId: "emp_001",
    employeeName: "Carlos Silva",
    date: "2026-04-07",
    checkIn: "08:00",
    checkOut: "17:00",
    hoursWorked: 9,
    status: "present",
  },
  {
    id: "att_002",
    employeeId: "emp_002",
    employeeName: "Ana Souza",
    date: "2026-04-07",
    checkIn: "08:15",
    checkOut: "17:15",
    hoursWorked: 9,
    status: "late",
  },
  {
    id: "att_003",
    employeeId: "emp_003",
    employeeName: "Bruno Costa",
    date: "2026-04-07",
    checkIn: null,
    checkOut: null,
    hoursWorked: 0,
    status: "absent",
  },
  {
    id: "att_004",
    employeeId: "emp_004",
    employeeName: "Fernanda Lima",
    date: "2026-04-07",
    checkIn: "08:00",
    checkOut: "12:00",
    hoursWorked: 4,
    status: "half-day",
  },
];

// --- Payroll Data ---
export type PayrollData = {
  employeeId: string;
  employeeName: string;
  role: string;
  hoursWorked: number;
  absences: number;
  bankName: string;
  accountNumber: string;
  grossSalary: number;
  deductions: number;
  netSalary: number;
};

export const mockPayrollData: PayrollData[] = [
  {
    employeeId: "emp_001",
    employeeName: "Carlos Silva",
    role: "Manager",
    hoursWorked: 176,
    absences: 0,
    bankName: "Banco do Brasil",
    accountNumber: "****5432",
    grossSalary: 4500.0,
    deductions: 850.0,
    netSalary: 3650.0,
  },
  {
    employeeId: "emp_002",
    employeeName: "Ana Souza",
    role: "Operator",
    hoursWorked: 174,
    absences: 2,
    bankName: "Itau",
    accountNumber: "****8765",
    grossSalary: 2500.0,
    deductions: 450.0,
    netSalary: 2050.0,
  },
  {
    employeeId: "emp_003",
    employeeName: "Bruno Costa",
    role: "Maintenance",
    hoursWorked: 170,
    absences: 4,
    bankName: "Caixa Economica",
    accountNumber: "****1234",
    grossSalary: 2800.0,
    deductions: 520.0,
    netSalary: 2280.0,
  },
];

// --- Promotions ---
export type Promotion = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  discountPercent: number;
  isActive: boolean;
  applicableGames: string[];
};

export const mockPromotions: Promotion[] = [
  {
    id: "promo_001",
    title: "Double Points Weekend",
    description: "Earn double points on all games",
    startDate: "2026-04-05",
    endDate: "2026-04-07",
    discountPercent: 0,
    isActive: true,
    applicableGames: ["Pac-Man", "Space Invaders", "Galaga"],
  },
  {
    id: "promo_002",
    title: "Chip Bundle Deal",
    description: "Buy 100 chips, get 20 free",
    startDate: "2026-04-01",
    endDate: "2026-04-30",
    discountPercent: 20,
    isActive: true,
    applicableGames: [],
  },
  {
    id: "promo_003",
    title: "Summer Special",
    description: "20% discount on all drinks",
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    discountPercent: 20,
    isActive: false,
    applicableGames: [],
  },
];

// --- Machines Report ---
export type MachineReport = {
  machineId: string;
  gameName: string;
  location: string;
  gamesPlayed: number;
  totalPlayTime: number; // in minutes
  totalRevenue: number;
  lastOfflineStart: string | null;
  lastOfflineEnd: string | null;
  uptime: number; // percentage
};

export const mockMachinesReport: MachineReport[] = [
  {
    machineId: "machine_01",
    gameName: "Pac-Man",
    location: "Main Hall",
    gamesPlayed: 245,
    totalPlayTime: 1960,
    totalRevenue: 570.0,
    lastOfflineStart: null,
    lastOfflineEnd: null,
    uptime: 99.8,
  },
  {
    machineId: "machine_02",
    gameName: "Space Invaders",
    location: "Main Hall",
    gamesPlayed: 198,
    totalPlayTime: 1584,
    totalRevenue: 475.0,
    lastOfflineStart: "2026-04-05 14:30",
    lastOfflineEnd: "2026-04-05 16:45",
    uptime: 98.5,
  },
  {
    machineId: "machine_03",
    gameName: "Galaga",
    location: "Back Room",
    gamesPlayed: 156,
    totalPlayTime: 1248,
    totalRevenue: 405.0,
    lastOfflineStart: null,
    lastOfflineEnd: null,
    uptime: 99.9,
  },
  {
    machineId: "machine_04",
    gameName: "Street Fighter II",
    location: "Main Hall",
    gamesPlayed: 278,
    totalPlayTime: 2224,
    totalRevenue: 660.0,
    lastOfflineStart: "2026-04-02 09:00",
    lastOfflineEnd: "2026-04-02 11:30",
    uptime: 97.2,
  },
  {
    machineId: "machine_05",
    gameName: "Mortal Kombat",
    location: "VIP Room",
    gamesPlayed: 212,
    totalPlayTime: 1696,
    totalRevenue: 515.0,
    lastOfflineStart: null,
    lastOfflineEnd: null,
    uptime: 99.5,
  },
];

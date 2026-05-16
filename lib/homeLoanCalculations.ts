// Shared home loan calculation utilities
// Used by both server component (page.tsx) and client component (HomeLoanCalculatorClient.tsx)

export type AmortizationRow = {
  month: number;
  date: string;        // "Jun 2026"
  emi: number;
  principal: number;
  interest: number;
  prepayment: number;
  balance: number;
};

export type PrepaymentConfig = {
  enabled: boolean;
  amount: number;
  type: 'tenure-cut' | 'emi-cut';
  startMonth: number;
  frequency: 'one-time' | 'monthly' | 'yearly';
};

export type ScheduleResult = {
  schedule: AmortizationRow[];
  totalInterest: number;
  actualMonths: number;
  newEMI: number;
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function getDateString(startMonth: number, startYear: number, monthOffset: number) {
  const m = (startMonth + monthOffset - 1) % 12;
  const y = startYear + Math.floor((startMonth + monthOffset - 1) / 12);
  return `${MONTH_NAMES[m]} ${y}`;
}

export function getPayoffDate(startMonth: number, startYear: number, totalMonths: number) {
  return getDateString(startMonth, startYear, totalMonths);
}

export function calculateEMI(loanAmount: number, monthlyRate: number, tenureMonths: number): number {
  if (loanAmount <= 0 || monthlyRate <= 0 || tenureMonths <= 0) return 0;
  return Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );
}

export function generateSchedule(
  loanAmount: number,
  monthlyRate: number,
  emi: number,
  totalMonths: number,
  startMonth: number,
  startYear: number,
  prepay: PrepaymentConfig | null,
): ScheduleResult {
  const schedule: AmortizationRow[] = [];
  let balance = loanAmount;
  let totalInterest = 0;
  let currentEMI = emi;
  let prepayApplied = false;

  for (let i = 1; i <= totalMonths && balance > 0.5; i++) {
    const interest = balance * monthlyRate;
    let principalPaid = currentEMI - interest;
    let prepayment = 0;

    // Apply prepayment
    if (prepay && prepay.enabled && i >= prepay.startMonth) {
      const shouldApply =
        prepay.frequency === 'one-time' ? i === prepay.startMonth :
        prepay.frequency === 'monthly' ? true :
        prepay.frequency === 'yearly' ? ((i - prepay.startMonth) % 12 === 0) : false;

      if (shouldApply) {
        prepayment = Math.min(prepay.amount, balance - principalPaid);

        if (prepay.type === 'emi-cut' && !prepayApplied && prepay.frequency === 'one-time') {
          const newBalance = balance - principalPaid - prepayment;
          const remainingMonths = totalMonths - i;
          if (remainingMonths > 0 && newBalance > 0) {
            currentEMI = (newBalance * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) /
              (Math.pow(1 + monthlyRate, remainingMonths) - 1);
          }
          prepayApplied = true;
        } else if (prepay.type === 'emi-cut' && prepay.frequency !== 'one-time' && !prepayApplied) {
          const newBalance = balance - principalPaid - prepayment;
          const remainingMonths = totalMonths - i;
          if (remainingMonths > 0 && newBalance > 0) {
            currentEMI = (newBalance * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) /
              (Math.pow(1 + monthlyRate, remainingMonths) - 1);
          }
          prepayApplied = true;
        }
      }
    }

    // Ensure we don't overshoot
    if (principalPaid + prepayment > balance) {
      principalPaid = balance - prepayment;
      if (principalPaid < 0) {
        prepayment = balance;
        principalPaid = 0;
      }
    }

    balance -= (principalPaid + prepayment);
    totalInterest += interest;

    schedule.push({
      month: i,
      date: getDateString(startMonth, startYear, i),
      emi: Math.round(currentEMI),
      principal: Math.round(principalPaid),
      interest: Math.round(interest),
      prepayment: Math.round(prepayment),
      balance: Math.max(0, Math.round(balance)),
    });

    if (balance <= 0.5) break;
  }

  return {
    schedule,
    totalInterest: Math.round(totalInterest),
    actualMonths: schedule.length,
    newEMI: Math.round(currentEMI),
  };
}

// Default values for server-side pre-rendering
export const DEFAULT_LOAN_AMOUNT = 2500000;
export const DEFAULT_INTEREST_RATE = 8.5;
export const DEFAULT_LOAN_TENURE = 20;
export const DEFAULT_START_MONTH = 5; // June (0-indexed)
export const DEFAULT_START_YEAR = 2026;

export function computeDefaults() {
  const loanAmount = DEFAULT_LOAN_AMOUNT;
  const interestRate = DEFAULT_INTEREST_RATE;
  const loanTenure = DEFAULT_LOAN_TENURE;
  const monthlyRate = interestRate / 12 / 100;
  const tenureMonths = loanTenure * 12;
  const startMonth = DEFAULT_START_MONTH;
  const startYear = DEFAULT_START_YEAR;

  const monthlyEMI = calculateEMI(loanAmount, monthlyRate, tenureMonths);
  const result = generateSchedule(loanAmount, monthlyRate, monthlyEMI, tenureMonths, startMonth, startYear, null);

  const totalInterest = result.totalInterest;
  const totalAmount = loanAmount + totalInterest;
  const principalPercent = Math.round((loanAmount / totalAmount) * 100);
  const interestPercent = 100 - principalPercent;

  return {
    loanAmount,
    interestRate,
    loanTenure,
    monthlyEMI,
    totalInterest,
    totalAmount,
    principalPercent,
    interestPercent,
    first12Months: result.schedule.slice(0, 12),
    payoffDate: getPayoffDate(startMonth, startYear, result.actualMonths),
  };
}

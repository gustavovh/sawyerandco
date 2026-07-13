/**
 * Mortgage Calculator Utility
 *
 * Generates realistic but non-accurate mortgage estimates for lead qualification.
 * This is NOT meant to be mathematically precise - it's for lead gen estimates only.
 */

/**
 * Interest rate by credit score range
 */
const INTEREST_RATES = {
  "below-580": 8.5,
  "580-619": 8.0,
  "620-679": 7.3,
  "680-739": 6.7,
  "740+": 6.0,
};

/**
 * DTI limits by credit score range
 */
const DTI_LIMITS = {
  "below-580": 0.43,
  "580-619": 0.45,
  "620-679": 0.48,
  "680-739": 0.5,
  "740+": 0.5,
};

/**
 * State-based home price multipliers
 * Adjusts estimated home price based on regional market
 */
const STATE_MULTIPLIERS = {
  CA: 1.2,
  TX: 0.95,
  FL: 1.05,
  NY: 1.15,
  IL: 0.9,
  PA: 0.85,
  OH: 0.8,
  GA: 0.95,
  NC: 0.92,
  MI: 0.85,
  NJ: 1.1,
  VA: 1.0,
  WA: 1.05,
  AZ: 0.98,
  MA: 1.08,
  CO: 1.02,
  MN: 0.93,
  TN: 0.88,
  MO: 0.82,
  WI: 0.87,
  IN: 0.8,
  MD: 1.0,
  OK: 0.78,
  LA: 0.85,
  KY: 0.8,
  OR: 0.99,
  SC: 0.87,
  AL: 0.82,
  NV: 0.96,
  UT: 0.95,
  AR: 0.75,
  MS: 0.73,
  CT: 1.12,
  RI: 1.05,
  NH: 1.0,
  ME: 0.92,
  MT: 0.91,
  ID: 0.89,
  WY: 0.87,
  SD: 0.77,
  ND: 0.76,
  NE: 0.8,
  KS: 0.78,
  IA: 0.79,
  HI: 1.4,
  AK: 1.1,
  VT: 0.95,
  WV: 0.72,
  DE: 1.0,
};

/**
 * Get loan programs recommended based on credit score
 */
function getRecommendedPrograms(creditScore) {
  const programs = ["Conventional 30-Year", "FHA Loan"];

  if (creditScore !== "below-580") {
    programs.push("VA Loan");
  }

  if (creditScore === "620-679" || creditScore === "680-739" || creditScore === "740+") {
    programs.push("USDA Loan");
  }

  if (creditScore === "740+") {
    programs.push("Jumbo Loan");
  }

  return programs;
}

/**
 * Calculate monthly payment using mortgage formula
 * P = L[c(1+c)^n]/[(1+c)^n-1]
 * where L = loan amount, c = monthly rate, n = number of payments
 */
function calculateMonthlyPayment(principal, annualRate, years = 30) {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;

  if (monthlyRate === 0) {
    return principal / numPayments;
  }

  const monthlyPayment =
    (principal *
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  return monthlyPayment;
}

/**
 * Calculate loan amount from monthly payment
 * Reverse of monthly payment formula
 */
function calculateLoanFromPayment(monthlyPayment, annualRate, years = 30) {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;

  if (monthlyRate === 0) {
    return monthlyPayment * numPayments;
  }

  const principal =
    (monthlyPayment *
      (Math.pow(1 + monthlyRate, numPayments) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments));

  return principal;
}

/**
 * Main calculator function
 * Generates mortgage estimate based on user inputs
 */
export function calculateEstimate({
  annual_income,
  monthly_debt,
  down_payment,
  credit_score,
  state,
}) {
  // Get interest rate for credit score
  const interestRate = INTEREST_RATES[credit_score] || 7.0;

  // Get DTI limit for credit score
  const dtiLimit = DTI_LIMITS[credit_score] || 0.5;

  // Calculate monthly income
  const monthlyIncome = annual_income / 12;

  // Calculate max monthly payment (based on DTI)
  // DTI = (monthly debt + mortgage payment) / monthly income
  // DTI Limit = (monthly debt + max payment) / monthly income
  // max payment = (DTI Limit * monthly income) - monthly debt
  const maxMonthlyPayment =
    dtiLimit * monthlyIncome - monthly_debt;

  // Conservative estimate: use 70% of max payment
  const targetMonthlyPayment = maxMonthlyPayment * 0.7;

  // Calculate loan amount from target payment
  const loanAmount = calculateLoanFromPayment(
    targetMonthlyPayment,
    interestRate,
    30
  );

  // Add down payment to get home price
  let homePrice = loanAmount + down_payment;

  // Apply state multiplier
  const stateMultiplier = STATE_MULTIPLIERS[state] || 1.0;
  homePrice = homePrice * stateMultiplier;

  // Generate ±10% range
  const variance = homePrice * 0.1;
  const homePriceLow = Math.round((homePrice - variance) / 5000) * 5000;
  const homePriceHigh = Math.round((homePrice + variance) / 5000) * 5000;

  // Recalculate payment for mid-point
  const midPrice = (homePriceLow + homePriceHigh) / 2;
  const midLoan = midPrice - down_payment;
  const actualMonthlyPayment = calculateMonthlyPayment(
    midLoan,
    interestRate,
    30
  );

  // Calculate DTI ratio for mid-point
  const actualDti = (
    ((monthly_debt + actualMonthlyPayment) / monthlyIncome) *
    100
  ).toFixed(1);

  // Get recommended loan programs
  const loanPrograms = getRecommendedPrograms(credit_score);

  return {
    home_price_low: Math.round(homePriceLow),
    home_price_high: Math.round(homePriceHigh),
    monthly_payment: Math.round(actualMonthlyPayment),
    estimated_rate: interestRate.toFixed(2),
    dti_ratio: actualDti,
    loan_programs: loanPrograms,
  };
}

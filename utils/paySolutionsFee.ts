const FEE_CONFIG = {
  promptpay: { rate: 0.0135, vat: 0.07, minFee: 5 },
  card: { rate: 0.028, vat: 0.07, minFee: 0 },
  usd_card: { rate: 0.03, vat: 0.07, minFee: 0 },
  alipay: { rate: 0.025, vat: 0.07, minFee: 0 },
} as const;

export type PaySolutionsPaymentMethod = "qr" | "card" | "alipay";
type FeeMethod = keyof typeof FEE_CONFIG;

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function toSatang(value: number): number {
  return Math.round(round2(value) * 100);
}

function calculateNetFromGross(grossSatang: number, method: FeeMethod) {
  const cfg = FEE_CONFIG[method];
  const gross = grossSatang / 100;
  const rawFee = round2(gross * cfg.rate);
  const processingFee = cfg.minFee > 0 ? Math.max(rawFee, cfg.minFee) : rawFee;
  const processingVat = round2(processingFee * cfg.vat);
  const net = round2(gross - processingFee - processingVat);

  return {
    netSatang: toSatang(net),
    total: gross,
    fee: round2(processingFee + processingVat),
  };
}

export function calculatePaySolutionsFee(
  netAmount: number,
  paymentMethod: PaySolutionsPaymentMethod,
  isThai: boolean
): { fee: number; total: number } {
  let method: FeeMethod;
  if (paymentMethod === "alipay") method = "alipay";
  else if (!isThai) method = "usd_card";
  else if (paymentMethod === "qr") method = "promptpay";
  else method = "card";

  const targetNetSatang = toSatang(netAmount);
  if (targetNetSatang <= 0) {
    return { fee: 0, total: 0 };
  }

  const cfg = FEE_CONFIG[method];
  const approxGross = Math.ceil(
    (targetNetSatang / 100) / (1 - cfg.rate * (1 + cfg.vat)) * 100
  );

  const minGross = Math.max(1, approxGross - 10000);
  const maxGross = approxGross + 10000;

  for (let grossSatang = minGross; grossSatang <= maxGross; grossSatang++) {
    const calc = calculateNetFromGross(grossSatang, method);
    if (calc.netSatang === targetNetSatang) {
      return { fee: calc.fee, total: calc.total };
    }
  }

  for (let grossSatang = approxGross; grossSatang <= maxGross; grossSatang++) {
    const calc = calculateNetFromGross(grossSatang, method);
    if (calc.netSatang >= targetNetSatang) {
      return { fee: calc.fee, total: calc.total };
    }
  }

  const fallback = calculateNetFromGross(maxGross, method);
  return { fee: fallback.fee, total: fallback.total };
}

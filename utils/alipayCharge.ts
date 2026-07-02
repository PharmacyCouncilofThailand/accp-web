/** Official ACCP international USD→THB rate for Alipay (1 USD = 34 THB). */
export const ALIPAY_USD_TO_THB_RATE = 34;

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function convertUsdToThb(usdAmount: number): number {
  if (usdAmount <= 0) return 0;
  return round2(usdAmount * ALIPAY_USD_TO_THB_RATE);
}

export function convertUsdDiscountToThb(usdDiscount: number): number {
  return convertUsdToThb(usdDiscount);
}

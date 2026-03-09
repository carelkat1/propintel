import { PriceDataPoint } from '@/lib/types';

function generatePredictions(basePrice: number, growthRate: number, volatility: number): PriceDataPoint[] {
  const months = ['Apr 25','May 25','Jun 25','Jul 25','Aug 25','Sep 25','Oct 25','Nov 25','Dec 25','Jan 26','Feb 26','Mar 26','Apr 26','May 26','Jun 26','Jul 26','Aug 26','Sep 26'];
  const data: PriceDataPoint[] = [];
  let price = basePrice;

  for (let i = 0; i < 18; i++) {
    const monthlyGrowth = (growthRate / 12) / 100;
    const noise = (Math.random() - 0.5) * volatility;

    if (i < 12) {
      price = price * (1 + monthlyGrowth + noise / 100);
      data.push({
        month: months[i],
        actual: Math.round(price),
        predicted: null,
        lower: null,
        upper: null,
      });
    } else {
      const predicted = price * (1 + monthlyGrowth * (i - 11));
      const band = predicted * 0.05 * (i - 11);
      data.push({
        month: months[i],
        actual: null,
        predicted: Math.round(predicted),
        lower: Math.round(predicted - band),
        upper: Math.round(predicted + band),
      });
    }
  }
  return data;
}

export const predictions: Record<string, PriceDataPoint[]> = {
  'sandhurst': generatePredictions(42000, 9.2, 3),
  'sandton-central': generatePredictions(28000, 6.1, 4),
  'bryanston': generatePredictions(18000, 5.4, 3.5),
  'lonehill': generatePredictions(16000, 7.5, 2.5),
  'hyde-park': generatePredictions(38000, 8.1, 3),
};

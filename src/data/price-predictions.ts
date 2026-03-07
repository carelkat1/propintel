import { PriceDataPoint } from "@/lib/types";

export const PRICE_DATA: Record<string, PriceDataPoint[]> = {
  "Sandton Central": [
    { m: "Apr", a: 4.2 }, { m: "Jun", a: 4.28 }, { m: "Aug", a: 4.62 },
    { m: "Oct", a: 4.85 }, { m: "Dec", a: 4.88 }, { m: "Feb", a: 5.15 },
    { m: "Mar", a: 5.22, p: 5.22 }, { m: "May", p: 5.48 },
    { m: "Jul", p: 5.62 }, { m: "Sep", p: 5.91 },
  ],
  "Sandhurst": [
    { m: "Apr", a: 11.2 }, { m: "Jun", a: 11.5 }, { m: "Aug", a: 11.8 },
    { m: "Oct", a: 12.1 }, { m: "Dec", a: 12.3 }, { m: "Feb", a: 12.5 },
    { m: "Mar", a: 12.6, p: 12.6 }, { m: "May", p: 13.1 },
    { m: "Jul", p: 13.5 }, { m: "Sep", p: 14.0 },
  ],
  "Bryanston": [
    { m: "Apr", a: 4.8 }, { m: "Jun", a: 4.9 }, { m: "Aug", a: 5.0 },
    { m: "Oct", a: 5.1 }, { m: "Dec", a: 5.15 }, { m: "Feb", a: 5.2 },
    { m: "Mar", a: 5.25, p: 5.25 }, { m: "May", p: 5.4 },
    { m: "Jul", p: 5.5 }, { m: "Sep", p: 5.7 },
  ],
  "Hyde Park": [
    { m: "Apr", a: 9.0 }, { m: "Jun", a: 9.2 }, { m: "Aug", a: 9.5 },
    { m: "Oct", a: 9.7 }, { m: "Dec", a: 9.8 }, { m: "Feb", a: 10.0 },
    { m: "Mar", a: 10.1, p: 10.1 }, { m: "May", p: 10.5 },
    { m: "Jul", p: 10.8 }, { m: "Sep", p: 11.2 },
  ],
  "Lonehill": [
    { m: "Apr", a: 3.5 }, { m: "Jun", a: 3.6 }, { m: "Aug", a: 3.7 },
    { m: "Oct", a: 3.8 }, { m: "Dec", a: 3.85 }, { m: "Feb", a: 3.9 },
    { m: "Mar", a: 3.95, p: 3.95 }, { m: "May", p: 4.1 },
    { m: "Jul", p: 4.2 }, { m: "Sep", p: 4.4 },
  ],
};

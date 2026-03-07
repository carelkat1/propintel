import { Property } from "@/lib/types";
import { SUBURBS } from "./suburbs";

export const PROPERTIES_BY_SUBURB: Record<string, Property[]> = {
  "Sandhurst": [
    { id: 1, address: "14 Rivonia Road, Unit 8", score: 91, owner: "Johannes van der Merwe", phone: "+27 82 445 1923", email: "jvdmerwe@telkomsa.net", yearsOwned: 12, value: 7850000, lastSale: 4200000, bond: 1200000, beds: 4, baths: 3, size: 285, erf: 1240, signals: ["Estate transfer detected", "Executor appointed"], pipelineStage: "contacted" },
    { id: 5, address: "8 Katherine St, Penthouse", score: 85, owner: "David Abramowitz", phone: "+27 82 990 3344", email: "david.a@abcap.co.za", yearsOwned: 15, value: 12400000, lastSale: 6500000, bond: 0, beds: 3, baths: 3, size: 210, erf: 0, signals: ["15yr ownership", "Divorce filing"], pipelineStage: "meeting" },
    { id: 10, address: "22 Oxford Road", score: 78, owner: "M. Sobukwe Trust", phone: "+27 11 783 4410", email: "trust@sobukwe.co.za", yearsOwned: 18, value: 15200000, lastSale: 3800000, bond: 0, beds: 6, baths: 4, size: 520, erf: 2800, signals: ["18yr hold", "Trust dissolution"], pipelineStage: "identified" },
    { id: 11, address: "3 Club Street, Unit 2", score: 72, owner: "Patricia Whitfield", phone: "+27 83 221 5567", email: "pat.w@mweb.co.za", yearsOwned: 10, value: 5600000, lastSale: 3100000, bond: 800000, beds: 3, baths: 2, size: 175, erf: 0, signals: ["Owner 72yrs", "Low bond ratio"], pipelineStage: "identified" },
    { id: 12, address: "9 Senderwood Lane", score: 67, owner: "R & L Investments", phone: "+27 11 884 2210", email: "info@rlinvest.co.za", yearsOwned: 6, value: 9200000, lastSale: 7100000, bond: 4500000, beds: 5, baths: 4, size: 380, erf: 1600, signals: ["High bond-to-value 49%"], pipelineStage: "identified" },
    { id: 13, address: "17 Summit Road", score: 55, owner: "Thabo Mokoena", phone: "+27 76 882 3341", email: "tmokoena@outlook.com", yearsOwned: 5, value: 6800000, lastSale: 5200000, bond: 3200000, beds: 4, baths: 3, size: 290, erf: 1100, signals: ["2 nearby sales"], pipelineStage: null },
  ],
  "Sandton Central": [
    { id: 2, address: "3 Maude Street, Apt 4B", score: 78, owner: "Sunitha Naidoo", phone: "+27 83 912 4477", email: "s.naidoo@gmail.com", yearsOwned: 9, value: 4200000, lastSale: 2800000, bond: 2900000, beds: 2, baths: 2, size: 112, erf: 0, signals: ["Bond-to-value: 69%", "Payment arrears"], pipelineStage: "responded" },
    { id: 14, address: "Alice Lane Towers, 12F", score: 71, owner: "Chen Wei Holdings", phone: "+27 11 784 9900", email: "sa@chenwei.com", yearsOwned: 7, value: 5100000, lastSale: 3400000, bond: 2000000, beds: 2, baths: 2, size: 130, erf: 0, signals: ["Foreign owner — exit signal", "7yr hold"], pipelineStage: "contacted" },
    { id: 15, address: "Nelson Mandela Sq, Unit 8", score: 63, owner: "James Fourie", phone: "+27 82 334 1178", email: "jfourie@vodamail.co.za", yearsOwned: 11, value: 3800000, lastSale: 2100000, bond: 0, beds: 2, baths: 1, size: 95, erf: 0, signals: ["11yr hold", "Clear title"], pipelineStage: "identified" },
    { id: 16, address: "5th Street, Apt 3A", score: 48, owner: "Lerato Dlamini", phone: "+27 73 556 2290", email: "lerato.d@webmail.co.za", yearsOwned: 3, value: 2900000, lastSale: 2600000, bond: 2100000, beds: 1, baths: 1, size: 68, erf: 0, signals: ["Recent purchase — low propensity"], pipelineStage: null },
  ],
  "Bryanston": [
    { id: 3, address: "22 West Street", score: 64, owner: "Mark & Pam Smith", phone: "+27 72 334 8812", email: "marksmith@outlook.com", yearsOwned: 7, value: 7100000, lastSale: 5600000, bond: 0, beds: 5, baths: 3, size: 420, erf: 2100, signals: ["3 nearby sales", "Owner 65+"], pipelineStage: "mandate" },
    { id: 17, address: "44 Grosvenor Road", score: 73, owner: "Estate Late D. Pretorius", phone: "+27 11 706 3200", email: "pretorius.estate@webmail.co.za", yearsOwned: 25, value: 4800000, lastSale: 680000, bond: 0, beds: 4, baths: 2, size: 320, erf: 1900, signals: ["Deceased estate", "25yr hold — heirs selling"], pipelineStage: "contacted" },
    { id: 18, address: "12 Ballyclare Drive", score: 58, owner: "Nina & Raj Patel", phone: "+27 82 441 7723", email: "rajpatel@gmail.com", yearsOwned: 8, value: 5500000, lastSale: 3400000, bond: 1800000, beds: 4, baths: 3, size: 340, erf: 1500, signals: ["Area price spike +12%"], pipelineStage: "identified" },
  ],
  "Lonehill": [
    { id: 8, address: "Plot 7, Lonehill Blvd", score: 72, owner: "Estate Late R. Fourie", phone: "+27 11 803 4455", email: "fourie.estate@derebus.co.za", yearsOwned: 22, value: 5200000, lastSale: 1100000, bond: 0, beds: 4, baths: 2, size: 310, erf: 1800, signals: ["Deceased estate", "22yr hold"], pipelineStage: "meeting" },
    { id: 19, address: "88 Country Lane", score: 66, owner: "Willem & Anrie Botha", phone: "+27 83 992 1134", email: "wbotha@lantic.net", yearsOwned: 14, value: 4100000, lastSale: 1800000, bond: 0, beds: 3, baths: 2, size: 260, erf: 1200, signals: ["14yr hold", "Downsizing signal — kids moved"], pipelineStage: "contacted" },
    { id: 20, address: "14 Lonehill Gate, Unit 6", score: 81, owner: "Sandra Meyer", phone: "+27 72 881 2256", email: "smeyer@iafrica.com", yearsOwned: 11, value: 3200000, lastSale: 1500000, bond: 0, beds: 3, baths: 2, size: 180, erf: 0, signals: ["Emigration enquiry flagged", "Clear title"], pipelineStage: "responded" },
  ],
};

// Fill missing suburbs with generated data
const OWNER_NAMES = ["A. Singh", "B. van Wyk", "C. Mthembu", "D. Olivier", "E. Chetty", "F. Booysen"];
const SIGNALS_POOL = ["Area growth signal", "Nearby sales", "Long-term hold", "Price gap detected", "Municipal valuation gap"];

SUBURBS.forEach((s) => {
  if (!PROPERTIES_BY_SUBURB[s.name]) {
    PROPERTIES_BY_SUBURB[s.name] = Array.from({ length: 3 + Math.floor(Math.random() * 3) }, (_, i) => ({
      id: 100 + SUBURBS.indexOf(s) * 10 + i,
      address: `${10 + i * 7} ${s.name} Ave, Unit ${i + 1}`,
      score: 30 + Math.floor(Math.random() * 50),
      owner: OWNER_NAMES[i] || `Owner ${i}`,
      phone: `+27 8${Math.floor(Math.random() * 10)} ${100 + Math.floor(Math.random() * 900)} ${1000 + Math.floor(Math.random() * 9000)}`,
      email: `owner${i}@mail.co.za`,
      yearsOwned: 2 + Math.floor(Math.random() * 15),
      value: Math.round(s.avgPrice * (0.6 + Math.random() * 0.8)),
      lastSale: Math.round(s.avgPrice * (0.3 + Math.random() * 0.4)),
      bond: Math.random() > 0.4 ? Math.round(s.avgPrice * Math.random() * 0.5) : 0,
      beds: 2 + Math.floor(Math.random() * 4),
      baths: 1 + Math.floor(Math.random() * 3),
      size: 80 + Math.floor(Math.random() * 300),
      erf: Math.random() > 0.5 ? 600 + Math.floor(Math.random() * 2000) : 0,
      signals: [SIGNALS_POOL[Math.floor(Math.random() * SIGNALS_POOL.length)]],
      pipelineStage: [null, "identified", "contacted"][Math.floor(Math.random() * 3)],
    }));
  }
});

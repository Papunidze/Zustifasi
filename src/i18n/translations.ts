export type Lang = "ge" | "en" | "ru";

export interface Translations {
  // Header
  logoText: string;

  // Tabs
  tabLink: string;
  tabFilters: string;
  tabCustoms: string;

  // Link form
  linkLabel: string;
  linkPlaceholder: string;
  priceLabel: string;
  pricePlaceholder: string;

  // Filter form
  makeLabel: string;
  makePlaceholder: string;
  modelLabel: string;
  modelPlaceholder: string;
  yearLabel: string;
  yearPlaceholder: string;
  fuelLabel: string;
  fuelPlaceholder: string;
  fuelGas: string;
  fuelHybrid: string;
  fuelEV: string;
  engineLabel: string;
  enginePlaceholder: string;

  // Buttons
  calculate: string;

  // Search select
  searchPlaceholder: string;
  popularLabel: string;
  noResults: string;

  // Results
  loading: string;
  emptyHint: string;
  totalLabel: string;
  contactBtn: string;

  // Cost groups
  auctionCosts: string;
  bidLabel: string;
  buyerFeeLabel: string;
  estimatedBadge: string;
  shippingCosts: string;
  inlandLabel: string;
  seaLabel: string;
  customsCosts: string;
  exciseLabel: string;
  hybridBadge: string;
  hybridNote: string;
  evBadge: string;
  evNote: string;
  rateLabel: string;

  // Errors
  errNoUrl: string;
  errNoMakeModel: string;
  errNoYear: string;
  errNoEngine: string;
  errGeneric: string;
}

const ge: Translations = {
  logoText: "Zustad.ge",
  tabLink: "ბმული / VIN",
  tabFilters: "ფილტრები",
  tabCustoms: "მხოლოდ განბაჟება",
  linkLabel: "Copart / IAAI ლინკი ან VIN",
  linkPlaceholder: "https://copart.com/lot/... ან VIN კოდი",
  priceLabel: "სავარაუდო ფასი ($)",
  pricePlaceholder: "მაგ. 3500",
  makeLabel: "მწარმოებელი",
  makePlaceholder: "აირჩიეთ მარკა",
  modelLabel: "მოდელი",
  modelPlaceholder: "აირჩიეთ მოდელი",
  yearLabel: "წელი",
  yearPlaceholder: "აირჩიეთ წელი",
  fuelLabel: "საწვავი",
  fuelPlaceholder: "აირჩიეთ",
  fuelGas: "ბენზინი",
  fuelHybrid: "ჰიბრიდი",
  fuelEV: "ელექტრო",
  engineLabel: "ძრავი (ლ)",
  enginePlaceholder: "მაგ. 2.5",
  calculate: "გამოთვლა",
  searchPlaceholder: "ძიება...",
  popularLabel: "პოპულარული",
  noResults: "ვერ მოიძებნა",
  loading: "იტვირთება...",
  emptyHint: "შეიყვანეთ მონაცემები რათა ნახოთ დეტალური ხარჯთაღრიცხვა",
  totalLabel: "ჯამური ღირებულება",
  contactBtn: "დაკავშირება",
  auctionCosts: "აუქციონის ხარჯები",
  bidLabel: "Bid (შეთავაზება)",
  buyerFeeLabel: "Buyer Fee (საკომისიო)",
  estimatedBadge: "~ სავარაუდო",
  shippingCosts: "გადაზიდვის ხარჯები",
  inlandLabel: "Inland (შიდა)",
  seaLabel: "Sea (ზღვა)",
  customsCosts: "განბაჟების ხარჯები",
  exciseLabel: "აქციზი + მომსახურება",
  hybridBadge: "ჰიბრიდი -50%",
  hybridNote: "აქციზზე მოქმედებს 50% ფასდაკლება",
  evBadge: "ელექტრო 0%",
  evNote: "ელექტრო ავტომობილი აქციზისგან თავისუფალია",
  rateLabel: "NBG: 1 USD",
  errNoUrl: "გთხოვთ ჩასვით ლინკი ან VIN კოდი",
  errNoMakeModel: "გთხოვთ აირჩიეთ მარკა და მოდელი",
  errNoYear: "გთხოვთ აირჩიეთ წელი",
  errNoEngine: "გთხოვთ შეიყვანეთ ძრავის მოცულობა",
  errGeneric: "დაფიქსირდა შეცდომა",
};

const en: Translations = {
  logoText: "Zustad.ge",
  tabLink: "Link / VIN",
  tabFilters: "Filters",
  tabCustoms: "Customs only",
  linkLabel: "Copart / IAAI Link or VIN",
  linkPlaceholder: "https://copart.com/lot/... or VIN code",
  priceLabel: "Estimated Price ($)",
  pricePlaceholder: "e.g. 3500",
  makeLabel: "Make",
  makePlaceholder: "Select make",
  modelLabel: "Model",
  modelPlaceholder: "Select model",
  yearLabel: "Year",
  yearPlaceholder: "Select year",
  fuelLabel: "Fuel",
  fuelPlaceholder: "Select",
  fuelGas: "Gasoline",
  fuelHybrid: "Hybrid",
  fuelEV: "Electric",
  engineLabel: "Engine (L)",
  enginePlaceholder: "e.g. 2.5",
  calculate: "Calculate",
  searchPlaceholder: "Search...",
  popularLabel: "Popular",
  noResults: "No results",
  loading: "Loading...",
  emptyHint: "Enter data to see a detailed cost breakdown",
  totalLabel: "Total Cost",
  contactBtn: "Contact",
  auctionCosts: "Auction Costs",
  bidLabel: "Bid",
  buyerFeeLabel: "Buyer Fee",
  estimatedBadge: "~ estimated",
  shippingCosts: "Shipping Costs",
  inlandLabel: "Inland",
  seaLabel: "Sea Freight",
  customsCosts: "Customs Costs",
  exciseLabel: "Excise + Service",
  hybridBadge: "Hybrid -50%",
  hybridNote: "50% discount on excise for hybrid vehicles",
  evBadge: "Electric 0%",
  evNote: "Electric vehicles are exempt from excise tax",
  rateLabel: "NBG: 1 USD",
  errNoUrl: "Please enter a link or VIN code",
  errNoMakeModel: "Please select make and model",
  errNoYear: "Please select a year",
  errNoEngine: "Please enter engine volume",
  errGeneric: "An error occurred",
};

const ru: Translations = {
  logoText: "Zustad.ge",
  tabLink: "Ссылка / VIN",
  tabFilters: "Фильтры",
  tabCustoms: "Только растаможка",
  linkLabel: "Ссылка Copart / IAAI или VIN",
  linkPlaceholder: "https://copart.com/lot/... или VIN код",
  priceLabel: "Примерная цена ($)",
  pricePlaceholder: "напр. 3500",
  makeLabel: "Марка",
  makePlaceholder: "Выберите марку",
  modelLabel: "Модель",
  modelPlaceholder: "Выберите модель",
  yearLabel: "Год",
  yearPlaceholder: "Выберите год",
  fuelLabel: "Топливо",
  fuelPlaceholder: "Выберите",
  fuelGas: "Бензин",
  fuelHybrid: "Гибрид",
  fuelEV: "Электро",
  engineLabel: "Двигатель (л)",
  enginePlaceholder: "напр. 2.5",
  calculate: "Рассчитать",
  searchPlaceholder: "Поиск...",
  popularLabel: "Популярные",
  noResults: "Не найдено",
  loading: "Загрузка...",
  emptyHint: "Введите данные для расчёта стоимости",
  totalLabel: "Общая стоимость",
  contactBtn: "Связаться",
  auctionCosts: "Расходы на аукцион",
  bidLabel: "Bid (ставка)",
  buyerFeeLabel: "Buyer Fee (комиссия)",
  estimatedBadge: "~ примерно",
  shippingCosts: "Расходы на доставку",
  inlandLabel: "Inland (внутренняя)",
  seaLabel: "Sea (морская)",
  customsCosts: "Расходы на растаможку",
  exciseLabel: "Акциз + услуги",
  hybridBadge: "Гибрид -50%",
  hybridNote: "Скидка 50% на акциз для гибридов",
  evBadge: "Электро 0%",
  evNote: "Электромобили освобождены от акциза",
  rateLabel: "NBG: 1 USD",
  errNoUrl: "Введите ссылку или VIN код",
  errNoMakeModel: "Выберите марку и модель",
  errNoYear: "Выберите год",
  errNoEngine: "Введите объём двигателя",
  errGeneric: "Произошла ошибка",
};

export const translations: Record<Lang, Translations> = { ge, en, ru };

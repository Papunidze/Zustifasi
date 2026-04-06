export interface CarData {
  models: string[];
  engines: Record<string, number>;
  evModels: string[];
  hybridModels: string[];
}

export const CAR_DATABASE: Record<string, CarData> = {
  Acura: {
    models: ["ILX", "Integra", "MDX", "RDX", "TLX", "NSX"],
    engines: { ILX: 2.4, Integra: 1.5, MDX: 3.5, RDX: 2.0, TLX: 2.0, NSX: 3.5 },
    evModels: [],
    hybridModels: ["MDX"],
  },
  "Alfa Romeo": {
    models: ["Giulia", "Stelvio", "Tonale"],
    engines: { Giulia: 2.0, Stelvio: 2.0, Tonale: 1.3 },
    evModels: [],
    hybridModels: ["Tonale"],
  },
  Audi: {
    models: ["A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q5", "Q7", "Q8", "e-tron", "e-tron GT", "RS5", "RS7", "S4", "S5", "TT"],
    engines: { A3: 2.0, A4: 2.0, A5: 2.0, A6: 3.0, A7: 3.0, A8: 3.0, Q3: 2.0, Q5: 2.0, Q7: 3.0, Q8: 3.0, "e-tron": 0, "e-tron GT": 0, RS5: 2.9, RS7: 4.0, S4: 3.0, S5: 3.0, TT: 2.0 },
    evModels: ["e-tron", "e-tron GT"],
    hybridModels: ["Q5"],
  },
  BMW: {
    models: ["2 Series", "3 Series", "4 Series", "5 Series", "7 Series", "8 Series", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "i4", "iX", "i7", "M3", "M4", "M5"],
    engines: { "2 Series": 2.0, "3 Series": 2.0, "4 Series": 2.0, "5 Series": 2.0, "7 Series": 3.0, "8 Series": 3.0, X1: 2.0, X2: 2.0, X3: 2.0, X4: 2.0, X5: 3.0, X6: 3.0, X7: 3.0, Z4: 2.0, i4: 0, iX: 0, i7: 0, M3: 3.0, M4: 3.0, M5: 4.4 },
    evModels: ["i4", "iX", "i7"],
    hybridModels: ["X5", "3 Series", "5 Series"],
  },
  Buick: {
    models: ["Enclave", "Encore", "Encore GX", "Envision"],
    engines: { Enclave: 3.6, Encore: 1.4, "Encore GX": 1.2, Envision: 2.0 },
    evModels: [],
    hybridModels: [],
  },
  Cadillac: {
    models: ["CT4", "CT5", "Escalade", "Lyriq", "XT4", "XT5", "XT6"],
    engines: { CT4: 2.0, CT5: 2.0, Escalade: 6.2, Lyriq: 0, XT4: 2.0, XT5: 2.0, XT6: 3.6 },
    evModels: ["Lyriq"],
    hybridModels: [],
  },
  Chevrolet: {
    models: ["Blazer", "Bolt EV", "Bolt EUV", "Camaro", "Colorado", "Corvette", "Equinox", "Malibu", "Silverado", "Spark", "Suburban", "Tahoe", "Trailblazer", "Traverse", "Trax"],
    engines: { Blazer: 2.0, "Bolt EV": 0, "Bolt EUV": 0, Camaro: 2.0, Colorado: 2.7, Corvette: 6.2, Equinox: 1.5, Malibu: 1.5, Silverado: 5.3, Spark: 1.4, Suburban: 5.3, Tahoe: 5.3, Trailblazer: 1.2, Traverse: 3.6, Trax: 1.4 },
    evModels: ["Bolt EV", "Bolt EUV"],
    hybridModels: [],
  },
  Chrysler: {
    models: ["300", "Pacifica", "Voyager"],
    engines: { "300": 3.6, Pacifica: 3.6, Voyager: 3.6 },
    evModels: [],
    hybridModels: ["Pacifica"],
  },
  Dodge: {
    models: ["Challenger", "Charger", "Durango", "Hornet"],
    engines: { Challenger: 3.6, Charger: 3.6, Durango: 3.6, Hornet: 2.0 },
    evModels: [],
    hybridModels: ["Hornet"],
  },
  Ford: {
    models: ["Bronco", "Bronco Sport", "Edge", "Escape", "Expedition", "Explorer", "F-150", "F-150 Lightning", "Maverick", "Mustang", "Mustang Mach-E", "Ranger", "Transit"],
    engines: { Bronco: 2.3, "Bronco Sport": 1.5, Edge: 2.0, Escape: 1.5, Expedition: 3.5, Explorer: 2.3, "F-150": 3.5, "F-150 Lightning": 0, Maverick: 2.0, Mustang: 2.3, "Mustang Mach-E": 0, Ranger: 2.3, Transit: 3.5 },
    evModels: ["F-150 Lightning", "Mustang Mach-E"],
    hybridModels: ["Escape", "Maverick", "Explorer"],
  },
  Genesis: {
    models: ["G70", "G80", "G90", "GV60", "GV70", "GV80"],
    engines: { G70: 2.0, G80: 2.5, G90: 3.5, GV60: 0, GV70: 2.5, GV80: 2.5 },
    evModels: ["GV60"],
    hybridModels: [],
  },
  GMC: {
    models: ["Acadia", "Canyon", "Sierra", "Terrain", "Yukon", "Hummer EV"],
    engines: { Acadia: 2.5, Canyon: 2.7, Sierra: 5.3, Terrain: 1.5, Yukon: 5.3, "Hummer EV": 0 },
    evModels: ["Hummer EV"],
    hybridModels: [],
  },
  Honda: {
    models: ["Accord", "Civic", "CR-V", "HR-V", "Odyssey", "Passport", "Pilot", "Prologue", "Ridgeline"],
    engines: { Accord: 1.5, Civic: 2.0, "CR-V": 1.5, "HR-V": 2.0, Odyssey: 3.5, Passport: 3.5, Pilot: 3.5, Prologue: 0, Ridgeline: 3.5 },
    evModels: ["Prologue"],
    hybridModels: ["Accord", "CR-V", "Civic"],
  },
  Hyundai: {
    models: ["Accent", "Elantra", "Ioniq 5", "Ioniq 6", "Kona", "Palisade", "Santa Cruz", "Santa Fe", "Sonata", "Tucson", "Venue"],
    engines: { Accent: 1.6, Elantra: 2.0, "Ioniq 5": 0, "Ioniq 6": 0, Kona: 2.0, Palisade: 3.8, "Santa Cruz": 2.5, "Santa Fe": 2.5, Sonata: 2.5, Tucson: 2.5, Venue: 1.6 },
    evModels: ["Ioniq 5", "Ioniq 6"],
    hybridModels: ["Tucson", "Santa Fe", "Sonata", "Elantra"],
  },
  Infiniti: {
    models: ["Q50", "Q60", "QX50", "QX55", "QX60", "QX80"],
    engines: { Q50: 3.0, Q60: 3.0, QX50: 2.0, QX55: 2.0, QX60: 3.5, QX80: 5.6 },
    evModels: [],
    hybridModels: [],
  },
  Jaguar: {
    models: ["E-PACE", "F-PACE", "F-TYPE", "I-PACE", "XE", "XF"],
    engines: { "E-PACE": 2.0, "F-PACE": 2.0, "F-TYPE": 2.0, "I-PACE": 0, XE: 2.0, XF: 2.0 },
    evModels: ["I-PACE"],
    hybridModels: [],
  },
  Jeep: {
    models: ["Cherokee", "Compass", "Gladiator", "Grand Cherokee", "Grand Cherokee L", "Renegade", "Wagoneer", "Wrangler"],
    engines: { Cherokee: 2.4, Compass: 2.4, Gladiator: 3.6, "Grand Cherokee": 3.6, "Grand Cherokee L": 3.6, Renegade: 1.3, Wagoneer: 6.4, Wrangler: 3.6 },
    evModels: [],
    hybridModels: ["Grand Cherokee", "Wrangler"],
  },
  Kia: {
    models: ["Carnival", "EV6", "EV9", "Forte", "K5", "Niro", "Rio", "Seltos", "Sorento", "Soul", "Sportage", "Stinger", "Telluride"],
    engines: { Carnival: 3.5, EV6: 0, EV9: 0, Forte: 2.0, K5: 2.5, Niro: 1.6, Rio: 1.6, Seltos: 2.0, Sorento: 2.5, Soul: 2.0, Sportage: 2.5, Stinger: 2.5, Telluride: 3.8 },
    evModels: ["EV6", "EV9"],
    hybridModels: ["Sorento", "Sportage", "Niro", "Carnival"],
  },
  "Land Rover": {
    models: ["Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Evoque", "Range Rover Sport", "Range Rover Velar"],
    engines: { Defender: 3.0, Discovery: 3.0, "Discovery Sport": 2.0, "Range Rover": 3.0, "Range Rover Evoque": 2.0, "Range Rover Sport": 3.0, "Range Rover Velar": 2.0 },
    evModels: [],
    hybridModels: ["Range Rover", "Range Rover Sport", "Defender"],
  },
  Lexus: {
    models: ["ES", "GX", "IS", "LC", "LS", "LX", "NX", "RC", "RX", "RZ", "TX", "UX"],
    engines: { ES: 2.5, GX: 2.4, IS: 2.0, LC: 5.0, LS: 3.5, LX: 3.4, NX: 2.5, RC: 2.0, RX: 2.4, RZ: 0, TX: 2.4, UX: 2.0 },
    evModels: ["RZ"],
    hybridModels: ["ES", "NX", "RX", "UX", "LC", "LS", "LX"],
  },
  Lincoln: {
    models: ["Aviator", "Corsair", "Nautilus", "Navigator"],
    engines: { Aviator: 3.0, Corsair: 2.0, Nautilus: 2.0, Navigator: 3.5 },
    evModels: [],
    hybridModels: ["Aviator", "Corsair"],
  },
  Mazda: {
    models: ["CX-30", "CX-5", "CX-50", "CX-70", "CX-90", "Mazda3", "MX-5 Miata", "MX-30"],
    engines: { "CX-30": 2.5, "CX-5": 2.5, "CX-50": 2.5, "CX-70": 3.3, "CX-90": 3.3, Mazda3: 2.5, "MX-5 Miata": 2.0, "MX-30": 0 },
    evModels: ["MX-30"],
    hybridModels: ["CX-90", "CX-70"],
  },
  Mercedes: {
    models: ["A-Class", "C-Class", "CLA", "CLE", "E-Class", "EQB", "EQE", "EQS", "G-Class", "GLA", "GLB", "GLC", "GLE", "GLS", "S-Class", "SL"],
    engines: { "A-Class": 2.0, "C-Class": 2.0, CLA: 2.0, CLE: 2.0, "E-Class": 2.0, EQB: 0, EQE: 0, EQS: 0, "G-Class": 4.0, GLA: 2.0, GLB: 2.0, GLC: 2.0, GLE: 2.0, GLS: 3.0, "S-Class": 3.0, SL: 2.0 },
    evModels: ["EQB", "EQE", "EQS"],
    hybridModels: ["C-Class", "E-Class", "GLC", "GLE", "S-Class"],
  },
  Mini: {
    models: ["Clubman", "Convertible", "Cooper", "Countryman", "Hardtop"],
    engines: { Clubman: 2.0, Convertible: 2.0, Cooper: 1.5, Countryman: 1.5, Hardtop: 1.5 },
    evModels: ["Cooper"],
    hybridModels: ["Countryman"],
  },
  Mitsubishi: {
    models: ["Eclipse Cross", "Mirage", "Outlander", "Outlander Sport"],
    engines: { "Eclipse Cross": 1.5, Mirage: 1.2, Outlander: 2.5, "Outlander Sport": 2.0 },
    evModels: [],
    hybridModels: ["Outlander"],
  },
  Nissan: {
    models: ["Altima", "Ariya", "Frontier", "Kicks", "Leaf", "Maxima", "Murano", "Pathfinder", "Rogue", "Sentra", "Titan", "Versa", "Z"],
    engines: { Altima: 2.5, Ariya: 0, Frontier: 3.8, Kicks: 1.6, Leaf: 0, Maxima: 3.5, Murano: 3.5, Pathfinder: 3.5, Rogue: 1.5, Sentra: 2.0, Titan: 5.6, Versa: 1.6, Z: 3.0 },
    evModels: ["Leaf", "Ariya"],
    hybridModels: [],
  },
  Polestar: {
    models: ["Polestar 2", "Polestar 3"],
    engines: { "Polestar 2": 0, "Polestar 3": 0 },
    evModels: ["Polestar 2", "Polestar 3"],
    hybridModels: [],
  },
  Porsche: {
    models: ["718 Boxster", "718 Cayman", "911", "Cayenne", "Macan", "Panamera", "Taycan"],
    engines: { "718 Boxster": 2.0, "718 Cayman": 2.0, "911": 3.0, Cayenne: 3.0, Macan: 2.0, Panamera: 2.9, Taycan: 0 },
    evModels: ["Taycan"],
    hybridModels: ["Cayenne", "Panamera"],
  },
  Ram: {
    models: ["1500", "2500", "3500", "ProMaster"],
    engines: { "1500": 5.7, "2500": 6.7, "3500": 6.7, ProMaster: 3.6 },
    evModels: [],
    hybridModels: [],
  },
  Rivian: {
    models: ["R1S", "R1T"],
    engines: { R1S: 0, R1T: 0 },
    evModels: ["R1S", "R1T"],
    hybridModels: [],
  },
  Subaru: {
    models: ["Ascent", "BRZ", "Crosstrek", "Forester", "Impreza", "Legacy", "Outback", "Solterra", "WRX"],
    engines: { Ascent: 2.4, BRZ: 2.4, Crosstrek: 2.0, Forester: 2.5, Impreza: 2.0, Legacy: 2.5, Outback: 2.5, Solterra: 0, WRX: 2.4 },
    evModels: ["Solterra"],
    hybridModels: ["Crosstrek", "Forester"],
  },
  Tesla: {
    models: ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck"],
    engines: { "Model 3": 0, "Model S": 0, "Model X": 0, "Model Y": 0, Cybertruck: 0 },
    evModels: ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck"],
    hybridModels: [],
  },
  Toyota: {
    models: ["4Runner", "bZ4X", "Camry", "Corolla", "Corolla Cross", "GR86", "GR Supra", "Grand Highlander", "Highlander", "Land Cruiser", "Prius", "RAV4", "Sequoia", "Sienna", "Tacoma", "Tundra", "Venza"],
    engines: { "4Runner": 2.4, bZ4X: 0, Camry: 2.5, Corolla: 2.0, "Corolla Cross": 2.0, GR86: 2.4, "GR Supra": 3.0, "Grand Highlander": 2.4, Highlander: 2.4, "Land Cruiser": 2.4, Prius: 2.0, RAV4: 2.5, Sequoia: 3.4, Sienna: 2.5, Tacoma: 2.4, Tundra: 3.4, Venza: 2.5 },
    evModels: ["bZ4X"],
    hybridModels: ["Camry", "Corolla", "Corolla Cross", "Highlander", "Grand Highlander", "Prius", "RAV4", "Sequoia", "Sienna", "Tundra", "Venza"],
  },
  Volkswagen: {
    models: ["Arteon", "Atlas", "Atlas Cross Sport", "Golf", "GTI", "ID.4", "Jetta", "Taos", "Tiguan"],
    engines: { Arteon: 2.0, Atlas: 3.6, "Atlas Cross Sport": 2.0, Golf: 2.0, GTI: 2.0, "ID.4": 0, Jetta: 1.5, Taos: 1.5, Tiguan: 2.0 },
    evModels: ["ID.4"],
    hybridModels: [],
  },
  Volvo: {
    models: ["C40", "EX30", "EX90", "S60", "S90", "V60", "V90", "XC40", "XC60", "XC90"],
    engines: { C40: 0, EX30: 0, EX90: 0, S60: 2.0, S90: 2.0, V60: 2.0, V90: 2.0, XC40: 2.0, XC60: 2.0, XC90: 2.0 },
    evModels: ["C40", "EX30", "EX90"],
    hybridModels: ["S60", "S90", "V60", "XC60", "XC90"],
  },
};

export const MAKES = Object.keys(CAR_DATABASE).sort();

export function getModels(make: string): string[] {
  return CAR_DATABASE[make]?.models ?? [];
}

export function getEngineVolume(make: string, model: string): number {
  return CAR_DATABASE[make]?.engines[model] ?? 2.5;
}

export function detectFuelType(make: string, model: string): "Gas" | "Hybrid" | "EV" {
  const data = CAR_DATABASE[make];
  if (!data) return "Gas";
  if (data.evModels.includes(model)) return "EV";
  if (data.hybridModels.includes(model)) return "Hybrid";
  return "Gas";
}

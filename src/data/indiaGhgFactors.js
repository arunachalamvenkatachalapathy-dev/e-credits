export const INDIA_GHG_FACTORS = [
  { 
    key: "Grid_Electricity_CEA_2024", 
    name: "Grid Electricity (CEA India Grid Mix 2024)", 
    unit: "kWh", 
    ef: 0.716, 
    scope: "Scope 2", 
    scope3Category: "N/A (Scope 2 Location-Based)",
    gwpBasis: "IPCC AR6 (CO2, CH4, N2O)",
    notes: "India CEA Baseline Carbon Database v19 (2024). Location-based grid average.",
    sourceUrl: "https://cea.nic.in/cdm-CO2-baseline-database/"
  },
  { 
    key: "Diesel_DG_Sets", 
    name: "Diesel Fuel (DG Sets & Power Generators)", 
    unit: "Liters", 
    ef: 2.6558, 
    scope: "Scope 1", 
    scope3Category: "N/A (Scope 1 Direct)",
    gwpBasis: "IPCC AR6",
    notes: "India GHG Platform - Commercial Thermal Combustion in stationary engines.",
    sourceUrl: "http://www.indiaghgplatform.org/"
  },
  { 
    key: "CNG_Fleet_Fuel", 
    name: "CNG Fuel (Commercial & Industrial Fleet)", 
    unit: "kg", 
    ef: 2.686, 
    scope: "Scope 1", 
    scope3Category: "N/A (Scope 1 Direct)",
    gwpBasis: "IPCC AR6",
    notes: "India GHG Platform - Transport CNG mobile combustion.",
    sourceUrl: "http://www.indiaghgplatform.org/"
  },
  { 
    key: "Coal_Thermal_Combustion", 
    name: "Coal Thermal Combustion (Industrial Boilers)", 
    unit: "kg", 
    ef: 2.42, 
    scope: "Scope 1", 
    scope3Category: "N/A (Scope 1 Direct)",
    gwpBasis: "IPCC AR6",
    notes: "MoEFCC India Industrial Thermal Factor for sub-bituminous coal.",
    sourceUrl: "https://moef.gov.in/"
  },
  { 
    key: "Petrol_Vehicles", 
    name: "Petrol / Gasoline Motor Vehicles", 
    unit: "Liters", 
    ef: 2.31, 
    scope: "Scope 1", 
    scope3Category: "N/A (Scope 1 Direct)",
    gwpBasis: "IPCC AR6",
    notes: "India GHG Platform - Light transport gasoline.",
    sourceUrl: "http://www.indiaghgplatform.org/"
  },
  { 
    key: "LPG_Industrial", 
    name: "LPG Industrial Fuel Gas", 
    unit: "kg", 
    ef: 2.983, 
    scope: "Scope 1", 
    scope3Category: "N/A (Scope 1 Direct)",
    gwpBasis: "IPCC AR6",
    notes: "India GHG Platform - Stationary thermal combustion.",
    sourceUrl: "http://www.indiaghgplatform.org/"
  },
  { 
    key: "Solar_PPA_Power", 
    name: "Solar PPA Zero-Carbon Power (Market-Based)", 
    unit: "kWh", 
    ef: 0.0, 
    scope: "Scope 2", 
    scope3Category: "N/A (Scope 2 Market-Based)",
    gwpBasis: "IPCC AR6",
    notes: "RE100 Verified Solar PPA (Scope 2 Market-based dual reporting).",
    sourceUrl: "https://www.ghgprotocol.org/scope_2_guidance"
  },
  { 
    key: "Wind_PPA_Power", 
    name: "Wind PPA Zero-Carbon Power (Market-Based)", 
    unit: "kWh", 
    ef: 0.0, 
    scope: "Scope 2", 
    scope3Category: "N/A (Scope 2 Market-Based)",
    gwpBasis: "IPCC AR6",
    notes: "RE100 Verified Wind PPA (Scope 2 Market-based dual reporting).",
    sourceUrl: "https://www.ghgprotocol.org/scope_2_guidance"
  },
  { 
    key: "Aluminum_Sheet_Primary", 
    name: "Aluminum Sheet, Primary Ingot 5052-H32", 
    unit: "kg", 
    ef: 14.2, 
    scope: "Scope 3", 
    scope3Category: "Cat 1: Purchased Goods & Services",
    gwpBasis: "IPCC AR6",
    notes: "USLCI / Ecoinvent 3.9 Primary Smelting (Virgin metal).",
    sourceUrl: "https://www.ecoinvent.org/"
  },
  { 
    key: "Aluminum_Secondary_Recycled", 
    name: "Secondary Recycled Scrap Aluminum", 
    unit: "kg", 
    ef: 1.8, 
    scope: "Scope 3", 
    scope3Category: "Cat 1: Purchased Goods & Services",
    gwpBasis: "IPCC AR6",
    notes: "World Aluminium Scrap Recycling Model (Post-consumer scrap).",
    sourceUrl: "https://world-aluminium.org/"
  },
  { 
    key: "Structural_Steel_Converter", 
    name: "Structural Steel Bracket Converter", 
    unit: "kg", 
    ef: 1.85, 
    scope: "Scope 3", 
    scope3Category: "Cat 1: Purchased Goods & Services",
    gwpBasis: "IPCC AR6",
    notes: "World Steel Association Indian Blast Furnace BOF route.",
    sourceUrl: "https://worldsteel.org/"
  },
  { 
    key: "Copper_Wire_12AWG", 
    name: "Copper Wire Drawing 12 AWG", 
    unit: "kg", 
    ef: 6.5, 
    scope: "Scope 3", 
    scope3Category: "Cat 1: Purchased Goods & Services",
    gwpBasis: "IPCC AR6",
    notes: "International Copper Association Global Factor.",
    sourceUrl: "https://copperalliance.org/"
  },
  { 
    key: "Polyurethane_Foam", 
    name: "Polyurethane Flexible Foam Insert", 
    unit: "pcs", 
    ef: 4.8, 
    scope: "Scope 3", 
    scope3Category: "Cat 1: Purchased Goods & Services",
    gwpBasis: "IPCC AR6",
    notes: "PlasticsEurope PU Foam Fabrication Factor.",
    sourceUrl: "https://plasticseurope.org/"
  },
  { 
    key: "Heavy_Freight_Road", 
    name: "Heavy Freight Transport (Trucking)", 
    unit: "tonne-km", 
    ef: 0.125, 
    scope: "Scope 3", 
    scope3Category: "Cat 4: Upstream Transportation & Distribution",
    gwpBasis: "IPCC AR6",
    notes: "GLEC Framework India Transport logistics factor.",
    sourceUrl: "https://www.smartfreightcentre.org/en/glec-framework/"
  },
  { 
    key: "Passenger_Taxi_Travel", 
    name: "Passenger Commercial Taxi Travel", 
    unit: "km", 
    ef: 0.14, 
    scope: "Scope 3", 
    scope3Category: "Cat 6: Business Travel",
    gwpBasis: "IPCC AR6",
    notes: "UK DEFRA 2024 Business Travel Taxi Factor.",
    sourceUrl: "https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024"
  },
  { 
    key: "Paper_Cardboard_Packaging", 
    name: "Corrugated Cardboard Packaging Box", 
    unit: "kg", 
    ef: 0.92, 
    scope: "Scope 3", 
    scope3Category: "Cat 1: Purchased Goods & Services",
    gwpBasis: "IPCC AR6",
    notes: "FEFCO Corrugated Containerboard LCA.",
    sourceUrl: "https://www.fefco.org/"
  },
  { 
    key: "Wastewater_Treatment", 
    name: "Industrial Effluent Wastewater Treatment", 
    unit: "m3", 
    ef: 0.708, 
    scope: "Scope 3", 
    scope3Category: "Cat 5: Waste Generated in Operations",
    gwpBasis: "IPCC AR6 Methane (CH4 GWP=27.9)",
    notes: "IPCC Guidelines for National GHG Inventories - Wastewater Treatment.",
    sourceUrl: "https://www.ipcc-nggip.iges.or.jp/"
  }
];

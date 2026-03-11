#!/usr/bin/env python3
"""
Scrape AU energy reference price data from public AER sources.
Data source: AER Default Market Offer (DMO) prices + Victorian Default Offer (VDO).
These are publicly published annual reference prices.

For initial build: compile known DMO/VDO 2024-25 prices into structured JSON.
Future: auto-scrape from AER press releases.
"""

import json
import os
from datetime import datetime

# AER Default Market Offer (DMO) 2024-25 prices
# Source: https://www.aer.gov.au/industry/retail/retail-pricing-and-the-default-market-offer
# These are annual reference cap prices published by the Australian Energy Regulator.

dmo_prices = {
    "financial_year": "2024-25",
    "effective_from": "2024-07-01",
    "source": "Australian Energy Regulator - Default Market Offer",
    "source_url": "https://www.aer.gov.au/industry/retail/retail-pricing-and-the-default-market-offer",
    "regions": [
        {
            "state": "NSW",
            "region_name": "New South Wales",
            "distribution_zones": [
                {
                    "zone": "Ausgrid",
                    "residential": {"annual_cost": 1829, "daily_supply_charge_c": 89.98, "usage_rate_c_kwh": 33.07},
                    "small_business": {"annual_cost": 5258, "daily_supply_charge_c": 131.67, "usage_rate_c_kwh": 33.07}
                },
                {
                    "zone": "Endeavour Energy",
                    "residential": {"annual_cost": 1838, "daily_supply_charge_c": 82.28, "usage_rate_c_kwh": 34.47},
                    "small_business": {"annual_cost": 5388, "daily_supply_charge_c": 131.67, "usage_rate_c_kwh": 33.88}
                },
                {
                    "zone": "Essential Energy",
                    "residential": {"annual_cost": 2096, "daily_supply_charge_c": 103.18, "usage_rate_c_kwh": 36.49},
                    "small_business": {"annual_cost": 5889, "daily_supply_charge_c": 164.12, "usage_rate_c_kwh": 36.49}
                }
            ]
        },
        {
            "state": "QLD",
            "region_name": "Queensland",
            "distribution_zones": [
                {
                    "zone": "Energex (SE QLD)",
                    "residential": {"annual_cost": 1762, "daily_supply_charge_c": 99.66, "usage_rate_c_kwh": 28.93},
                    "small_business": {"annual_cost": 4944, "daily_supply_charge_c": 140.52, "usage_rate_c_kwh": 28.93}
                }
            ]
        },
        {
            "state": "SA",
            "region_name": "South Australia",
            "distribution_zones": [
                {
                    "zone": "SA Power Networks",
                    "residential": {"annual_cost": 2302, "daily_supply_charge_c": 98.56, "usage_rate_c_kwh": 42.87},
                    "small_business": {"annual_cost": 6197, "daily_supply_charge_c": 141.57, "usage_rate_c_kwh": 42.87}
                }
            ]
        }
    ]
}

# Victorian Default Offer (VDO) 2024-25
# Source: Essential Services Commission Victoria
vdo_prices = {
    "financial_year": "2024-25",
    "effective_from": "2024-07-01",
    "source": "Essential Services Commission Victoria - Victorian Default Offer",
    "source_url": "https://www.esc.vic.gov.au/electricity-and-gas/prices-tariffs-and-benchmarks/victorian-default-offer",
    "regions": [
        {
            "state": "VIC",
            "region_name": "Victoria",
            "distribution_zones": [
                {
                    "zone": "CitiPower",
                    "residential": {"annual_cost": 1415, "daily_supply_charge_c": 78.69, "usage_rate_c_kwh": 25.35},
                    "small_business": {"annual_cost": 4286, "daily_supply_charge_c": 127.98, "usage_rate_c_kwh": 25.35}
                },
                {
                    "zone": "Powercor",
                    "residential": {"annual_cost": 1558, "daily_supply_charge_c": 78.69, "usage_rate_c_kwh": 28.14},
                    "small_business": {"annual_cost": 4590, "daily_supply_charge_c": 127.98, "usage_rate_c_kwh": 28.14}
                },
                {
                    "zone": "Jemena",
                    "residential": {"annual_cost": 1512, "daily_supply_charge_c": 82.82, "usage_rate_c_kwh": 26.81},
                    "small_business": {"annual_cost": 4440, "daily_supply_charge_c": 127.98, "usage_rate_c_kwh": 26.81}
                },
                {
                    "zone": "AusNet Services",
                    "residential": {"annual_cost": 1741, "daily_supply_charge_c": 82.82, "usage_rate_c_kwh": 31.28},
                    "small_business": {"annual_cost": 5122, "daily_supply_charge_c": 127.98, "usage_rate_c_kwh": 31.28}
                },
                {
                    "zone": "United Energy",
                    "residential": {"annual_cost": 1489, "daily_supply_charge_c": 78.69, "usage_rate_c_kwh": 26.36},
                    "small_business": {"annual_cost": 4393, "daily_supply_charge_c": 127.98, "usage_rate_c_kwh": 26.36}
                }
            ]
        }
    ]
}

# Major AU energy retailers
retailers = [
    {"name": "AGL", "website": "https://www.agl.com.au", "states": ["NSW", "VIC", "QLD", "SA"], "type": "Big 3"},
    {"name": "Origin Energy", "website": "https://www.originenergy.com.au", "states": ["NSW", "VIC", "QLD", "SA", "ACT"], "type": "Big 3"},
    {"name": "EnergyAustralia", "website": "https://www.energyaustralia.com.au", "states": ["NSW", "VIC", "QLD", "SA"], "type": "Big 3"},
    {"name": "Alinta Energy", "website": "https://www.alintaenergy.com.au", "states": ["NSW", "VIC", "QLD", "SA", "WA"], "type": "Mid-tier"},
    {"name": "Red Energy", "website": "https://www.redenergy.com.au", "states": ["NSW", "VIC", "QLD", "SA"], "type": "Mid-tier"},
    {"name": "Lumo Energy", "website": "https://www.lumoenergy.com.au", "states": ["NSW", "VIC", "QLD", "SA"], "type": "Mid-tier"},
    {"name": "Simply Energy", "website": "https://www.simplyenergy.com.au", "states": ["VIC", "NSW", "QLD", "SA"], "type": "Mid-tier"},
    {"name": "Momentum Energy", "website": "https://www.momentumenergy.com.au", "states": ["VIC", "NSW", "QLD", "SA", "ACT"], "type": "Mid-tier"},
    {"name": "Powershop", "website": "https://www.powershop.com.au", "states": ["VIC", "NSW", "QLD", "SA"], "type": "Green"},
    {"name": "Amber Electric", "website": "https://www.amber.com.au", "states": ["NSW", "VIC", "QLD", "SA"], "type": "Wholesale"},
    {"name": "GloBird Energy", "website": "https://www.globirdenergy.com.au", "states": ["VIC", "NSW", "QLD"], "type": "Budget"},
    {"name": "Tango Energy", "website": "https://www.tangoenergy.com", "states": ["VIC", "NSW", "QLD", "SA"], "type": "Budget"},
    {"name": "Nectr", "website": "https://www.nectr.com.au", "states": ["NSW", "QLD", "SA", "VIC"], "type": "Budget"},
    {"name": "OVO Energy", "website": "https://www.ovoenergy.com.au", "states": ["NSW", "VIC", "QLD", "SA"], "type": "Mid-tier"},
    {"name": "Enova Energy", "website": "https://www.enovaenergy.com.au", "states": ["NSW"], "type": "Community"},
    {"name": "Diamond Energy", "website": "https://www.diamondenergy.com.au", "states": ["VIC", "NSW", "QLD", "SA"], "type": "Green"},
    {"name": "Sumo", "website": "https://www.sumo.com.au", "states": ["VIC", "NSW", "QLD"], "type": "Budget"},
    {"name": "1st Energy", "website": "https://www.1stenergy.com.au", "states": ["VIC", "NSW", "QLD", "SA"], "type": "Budget"},
    {"name": "Dodo Power & Gas", "website": "https://www.dodo.com/energy", "states": ["VIC", "NSW", "QLD", "SA"], "type": "Bundle"},
    {"name": "CovaU", "website": "https://www.covau.com.au", "states": ["NSW", "VIC", "QLD", "SA"], "type": "Budget"},
]

# Energy saving tips
tips = [
    {"title": "Switch to LED Lighting", "saving_pct": 5, "description": "Replace all halogen and incandescent bulbs with LED alternatives. LEDs use up to 80% less energy."},
    {"title": "Use a Smart Thermostat", "saving_pct": 10, "description": "Heating and cooling accounts for ~40% of household energy. A smart thermostat can reduce this significantly."},
    {"title": "Seal Drafts and Insulate", "saving_pct": 15, "description": "Proper insulation and draft sealing can reduce heating/cooling costs by up to 25%."},
    {"title": "Solar Panels", "saving_pct": 30, "description": "A 6.6kW solar system can offset 60-80% of a typical household's electricity usage in most Australian states."},
    {"title": "Off-Peak Usage", "saving_pct": 8, "description": "Run dishwashers, washing machines and dryers during off-peak hours if you're on a time-of-use tariff."},
    {"title": "Standby Power", "saving_pct": 3, "description": "Turn off appliances at the wall when not in use. Standby power can account for up to 10% of your bill."},
    {"title": "Energy-Efficient Appliances", "saving_pct": 12, "description": "When replacing appliances, choose the highest energy star rating you can afford."},
    {"title": "Hot Water Efficiency", "saving_pct": 8, "description": "Hot water is typically 25% of household energy. Use shorter showers, fix leaks, and consider a heat pump."},
]

# Compile into output
output = {
    "generated_at": datetime.now().isoformat(),
    "dmo": dmo_prices,
    "vdo": vdo_prices,
    "retailers": retailers,
    "tips": tips,
    "metadata": {
        "total_distribution_zones": 9,
        "total_states_covered": 4,
        "total_retailers": len(retailers),
        "data_currency": "2024-25 Financial Year",
        "note": "DMO/VDO prices are maximum reference prices. Most competitive plans offer 10-25% below these caps."
    }
}

data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
os.makedirs(data_dir, exist_ok=True)

output_path = os.path.join(data_dir, "energy-plans.json")
with open(output_path, "w") as f:
    json.dump(output, f, indent=2)

print(f"✅ Generated energy data: {output_path}")
print(f"   - {len(dmo_prices['regions'])} DMO regions, {len(vdo_prices['regions'])} VDO regions")
print(f"   - {len(retailers)} retailers")
print(f"   - {len(tips)} energy saving tips")
print(f"   - 9 distribution zones total")

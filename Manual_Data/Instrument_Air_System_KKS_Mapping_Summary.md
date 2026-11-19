# APSCL North CCGT 450 MW — Instrument Air System P&ID Mapping
**P&ID Document No:** `07485-20-QF_-MDD-TRE-113` (Sheets 01 to 04)  
**Contractor / Engineering:** UTE TSK TÉCNICAS REUNIDAS  
**System Area:** Instrument Air System (`20QFA` / `20QFB` / `20SCA`)  
**Division:** Mech, (ST & Auxiliary), Zone-B, APSCL  

---

## 1. System Overview & Hierarchy
The Instrument Air System takes compressed air from the air compressors (`20SCA20`), dries and purifies it through two parallel desiccant air dryers (`20QFA01`, `20QFA02`), stores dry air inside a vertical air receiver (`20QFA20BB001`), and distributes clean, dry, pressurized air (10.0 barg, 70°C design) through 10 distribution manifolds (`20QFB11` through `20QFB52`) across the power plant.

```
[Compressor Line 20SCA20]
         │
         ├───► [Dryer Package #1: 20QFA01] (Pre-Filter 20QFA01AT001 ──► Desiccant Tower ──► After-Filter 20QFA01AT002)
         │
         └───► [Dryer Package #2: 20QFA02] (Pre-Filter 20QFA02AT001 ──► Desiccant Tower ──► After-Filter 20QFA02AT002)
                        │
                        ▼
         [Air Receiver Vessel: 20QFA20BB001]
         ├── Safety Relief Valve: 20QFA20AA901 (PSET = 10.0 barg)
         ├── Pressure Transmitters: 20QFA20CP001 (PTCI), 20QFA20CP002 (PTCI)
         ├── Local Gauge: 20QFA20CP501 (PI)
         └── Auto Condensate Trap: 20QFA20AT401
                        │
                        ▼
         [Main Distribution Headers & 10 Distribution Manifolds: 20QFB10 to 20QFB52]
         ├── 20QFB11: Turbine Extraction, Condensate Polishing, Feedwater Valves
         ├── 20QFB21: HP Heaters Extraction, Casing Warm-up Drains
         ├── 20QFB31: Gas Turbine Fuel Gas Valves & Hydrogen Cooling
         ├── 20QFB32: Pilot & Main Burners Fuel Gas Control
         ├── 20QFB12: Condensate Recirculation, Polishing & Deaerator Drains
         ├── 20QFB41: Flash Tanks, ST HP/LP Bypass Spray Water Valves (20MAL25/65)
         ├── 20QFB42: Gland Steam (20MAW10), Deaerator Level, BFP Min-Flow (20LBA20)
         ├── 20QFB51: Emergency Trip (10MAG10/10MAJ60), Lube Oil Purifier & Cooler (20MAL10/20)
         ├── 20QFB52: Gland Condenser (20MAW65), Jacking Oil, Control Oil & Mist (20MAL)
         └── 20QFB13: Condenser Vacuum Breaker (20LCP10), Stator Cooling (20GHD35)
```

---

## 2. Equipment & Part KKS Mapping Registry

| Plant / Area | Equipment Name | Equipment KKS | Part / Component Name | Part KKS No. | Component Type | P&ID Sheet |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Instrument Air** | Compressor Supply Header | `20SCA20` | Manual Drain Valve | `20SCA20AA403` | Drain Valve (1") | Sheet 02 |
| **Instrument Air** | Instrument Air Dryer #1 | `20QFA01` | Inlet Pre-Filter | `20QFA01AT001` | Filter Element | Sheet 02 |
| **Instrument Air** | Instrument Air Dryer #1 | `20QFA01` | Inlet Isolation/Control Valve | `20QFA01AA091` | Pneumatic Valve | Sheet 02 |
| **Instrument Air** | Instrument Air Dryer #1 | `20QFA01` | Inlet Manual Drain Valve | `20QFA01AA401` | Drain Valve (1/2") | Sheet 02 |
| **Instrument Air** | Instrument Air Dryer #1 | `20QFA01` | Twin Adsorption Desiccant Tower | `20QFA01BB001` | Pressure Vessel | Sheet 02 |
| **Instrument Air** | Instrument Air Dryer #1 | `20QFA01` | After-Filter | `20QFA01AT002` | Filter Element | Sheet 02 |
| **Instrument Air** | Instrument Air Dryer #1 | `20QFA01` | Outlet Isolation/Control Valve | `20QFA01AA092` | Pneumatic Valve | Sheet 02 |
| **Instrument Air** | Instrument Air Dryer #1 | `20QFA01` | Test Points (Inlet/Mid/Outlet) | `TP-QFA1-1 / 2 / 3` | Test Point | Sheet 02 |
| **Instrument Air** | Instrument Air Dryer #2 | `20QFA02` | Inlet Pre-Filter | `20QFA02AT001` | Filter Element | Sheet 02 |
| **Instrument Air** | Instrument Air Dryer #2 | `20QFA02` | Inlet Isolation/Control Valve | `20QFA02AA091` | Pneumatic Valve | Sheet 02 |
| **Instrument Air** | Instrument Air Dryer #2 | `20QFA02` | Inlet Manual Drain Valve | `20QFA02AA401` | Drain Valve (1/2") | Sheet 02 |
| **Instrument Air** | Instrument Air Dryer #2 | `20QFA02` | Twin Adsorption Desiccant Tower | `20QFA02BB001` | Pressure Vessel | Sheet 02 |
| **Instrument Air** | Instrument Air Dryer #2 | `20QFA02` | After-Filter | `20QFA02AT002` | Filter Element | Sheet 02 |
| **Instrument Air** | Instrument Air Dryer #2 | `20QFA02` | Outlet Isolation/Control Valve | `20QFA02AA092` | Pneumatic Valve | Sheet 02 |
| **Instrument Air** | Instrument Air Dryer #2 | `20QFA02` | Test Points (Inlet/Mid/Outlet) | `TP-QFA2-1 / 2 / 3` | Test Point | Sheet 02 |
| **Instrument Air** | Dryer Common Discharge | `20QFA20` | Header Check Valve (Non-Return) | `20QFA20AA101` | Non-Return Valve | Sheet 02 |
| **Instrument Air** | Dryer Common Discharge | `20QFA20` | Receiver Inlet Isolation Valve | `20QFA20AA001` | Ball/Gate Valve | Sheet 02 |
| **Instrument Air** | Dryer Common Discharge | `20QFA20` | Common Line Drain Valve | `20QFA20AA401` | Drain Valve (1") | Sheet 02 |
| **Instrument Air** | Air Storage Receiver | `20QFA20BB001` | Storage Vessel Shell & Internals | `20QFA20BB001` | Pressure Vessel | Sheet 02 |
| **Instrument Air** | Air Storage Receiver | `20QFA20BB001` | Safety Relief Valve (10 barg) | `20QFA20AA901` | Safety Valve | Sheet 02 |
| **Instrument Air** | Air Storage Receiver | `20QFA20BB001` | Pressure Transmitter 1 (PTCI) | `20QFA20CP001` | Transmitter | Sheet 02 |
| **Instrument Air** | Air Storage Receiver | `20QFA20BB001` | PT-001 Root Isolation Valve | `20QFA20AA701` | Needle Valve | Sheet 02 |
| **Instrument Air** | Air Storage Receiver | `20QFA20BB001` | Pressure Transmitter 2 (PTCI) | `20QFA20CP002` | Transmitter | Sheet 02 |
| **Instrument Air** | Air Storage Receiver | `20QFA20BB001` | PT-002 Root Isolation Valve | `20QFA20AA702` | Needle Valve | Sheet 02 |
| **Instrument Air** | Air Storage Receiver | `20QFA20BB001` | Local Pressure Gauge (PI) | `20QFA20CP501` | Pressure Gauge | Sheet 02 |
| **Instrument Air** | Air Storage Receiver | `20QFA20BB001` | PI-501 Root Isolation Valve | `20QFA20AA703` | Needle Valve | Sheet 02 |
| **Instrument Air** | Air Storage Receiver | `20QFA20BB001` | Primary Bottom Drain Valve | `20QFA20AA402` | Drain Valve (1") | Sheet 02 |
| **Instrument Air** | Air Storage Receiver | `20QFA20BB001` | Auto Moisture Drain Trap | `20QFA20AT401` | Condensate Trap | Sheet 02 |
| **Instrument Air** | Air Storage Receiver | `20QFA20BB001` | Secondary/Bypass Drain Valve | `20QFA20AA403` | Drain Valve (1") | Sheet 02 |
| **Instrument Air** | Main Distribution Header | `20QFB10` | Receiver Main Outlet Valve | `20QFB10AA001` | Gate/Ball (2-1/2") | Sheet 02 |
| **Instrument Air** | Main Distribution Header | `20QFB10` | Header Low-Point Drain | `20QFB10AA401` | Drain Valve (1") | Sheet 03 |
| **Instrument Air** | Main Distribution Header | `20QFB10` | Header Pressure Transmitter | `20QFB01CP001` | Transmitter | Sheet 04 |
| **Instrument Air** | Main Distribution Header | `20QFB10` | PT-01 Header Root Valve | `20QFB10AA701` | Needle Valve | Sheet 04 |
| **Instrument Air** | Air Distributor #1 | `20QFB11BB001` | Distributor Inlet Valve | `20QFB11AA001` | Gate/Ball (1-1/2") | Sheet 03 |
| **Instrument Air** | Air Distributor #1 | `20QFB11BB001` | Distributor Drain Valve | `20QFB11AA401` | Drain Valve (1") | Sheet 03 |
| **Instrument Air** | Air Distributor #1 | `20QFB11BB001` | Distributor Manifold Column | `20QFB11BB001` | Manifold Column | Sheet 03 |
| **Instrument Air** | Air Distributor #2 | `20QFB21BB001` | Distributor Inlet Valve | `20QFB21AA001` | Gate/Ball (1-1/2") | Sheet 03 |
| **Instrument Air** | Air Distributor #2 | `20QFB21BB001` | Distributor Drain Valve | `20QFB21AA401` | Drain Valve (1") | Sheet 03 |
| **Instrument Air** | Air Distributor #2 | `20QFB21BB001` | Distributor Manifold Column | `20QFB21BB001` | Manifold Column | Sheet 03 |
| **Instrument Air** | Air Distributor #3 | `20QFB31BB001` | Distributor Inlet Valve | `20QFB31AA001` | Gate/Ball (1") | Sheet 03 |
| **Instrument Air** | Air Distributor #3 | `20QFB31BB001` | Distributor Drain Valve | `20QFB31AA401` | Drain Valve (1") | Sheet 03 |
| **Instrument Air** | Air Distributor #3 | `20QFB31BB001` | Distributor Manifold Column | `20QFB31BB001` | Manifold Column | Sheet 03 |
| **Instrument Air** | Air Distributor #4 | `20QFB32BB001` | Distributor Inlet Valve | `20QFB32AA001` | Gate/Ball (1") | Sheet 03 |
| **Instrument Air** | Air Distributor #4 | `20QFB32BB001` | Distributor Drain Valve | `20QFB32AA401` | Drain Valve (1") | Sheet 03 |
| **Instrument Air** | Air Distributor #4 | `20QFB32BB001` | Distributor Manifold Column | `20QFB32BB001` | Manifold Column | Sheet 03 |
| **Instrument Air** | Air Distributor #5 | `20QFB12BB001` | Distributor Inlet Valve | `20QFB12AA001` | Gate/Ball (1") | Sheet 04 |
| **Instrument Air** | Air Distributor #5 | `20QFB12BB001` | Distributor Drain Valve | `20QFB12AA401` | Drain Valve (1") | Sheet 04 |
| **Instrument Air** | Air Distributor #5 | `20QFB12BB001` | Distributor Manifold Column | `20QFB12BB001` | Manifold Column | Sheet 04 |
| **Instrument Air** | Air Distributor #6 | `20QFB41BB001` | Distributor Inlet Valve | `20QFB41AA001` | Gate/Ball (1") | Sheet 04 |
| **Instrument Air** | Air Distributor #6 | `20QFB41BB001` | Distributor Drain Valve | `20QFB41AA401` | Drain Valve (1") | Sheet 04 |
| **Instrument Air** | Air Distributor #6 | `20QFB41BB001` | Distributor Manifold Column | `20QFB41BB001` | Manifold Column | Sheet 04 |
| **Instrument Air** | Air Distributor #7 | `20QFB42BB001` | Distributor Inlet Valve | `20QFB42AA001` | Gate/Ball (1") | Sheet 04 |
| **Instrument Air** | Air Distributor #7 | `20QFB42BB001` | Distributor Drain Valve | `20QFB42AA401` | Drain Valve (1") | Sheet 04 |
| **Instrument Air** | Air Distributor #7 | `20QFB42BB001` | Distributor Manifold Column | `20QFB42BB001` | Manifold Column | Sheet 04 |
| **Instrument Air** | Air Distributor #8 | `20QFB51BB001` | Distributor Inlet Valve | `20QFB51AA001` | Gate/Ball (1") | Sheet 04 |
| **Instrument Air** | Air Distributor #8 | `20QFB51BB001` | Distributor Drain Valve | `20QFB51AA401` | Drain Valve (1") | Sheet 04 |
| **Instrument Air** | Air Distributor #8 | `20QFB51BB001` | Distributor Manifold Column | `20QFB51BB001` | Manifold Column | Sheet 04 |
| **Instrument Air** | Air Distributor #9 | `20QFB52BB001` | Distributor Inlet Valve | `20QFB52AA001` | Gate/Ball (1") | Sheet 04 |
| **Instrument Air** | Air Distributor #9 | `20QFB52BB001` | Distributor Drain Valve | `20QFB52AA401` | Drain Valve (1") | Sheet 04 |
| **Instrument Air** | Air Distributor #9 | `20QFB52BB001` | Distributor Manifold Column | `20QFB52BB001` | Manifold Column | Sheet 04 |
| **Instrument Air** | Air Distributor #10 | `20QFB13BB001` | Distributor Inlet Valve | `20QFB13AA001` | Gate/Ball (1") | Sheet 04 |
| **Instrument Air** | Air Distributor #10 | `20QFB13BB001` | Distributor Drain Valve | `20QFB13AA401` | Drain Valve (1") | Sheet 04 |
| **Instrument Air** | Air Distributor #10 | `20QFB13BB001` | Distributor Manifold Column | `20QFB13BB001` | Manifold Column | Sheet 04 |
| **External Interface** | Gas Station Supply | `20QFB16` | Supply Root Valve | `20QFB16AA001` | Gate/Ball (1") | Sheet 04 |
| **External Interface** | Gas Station Supply | `20QFB16` | Line Drain Valve | `20QFB16AA401` | Drain Valve (1") | Sheet 04 |
| **External Interface** | Gas Station Supply | `20QFB16` | Boundary Block Valve | `20EKA10AA091` | Pneumatic Valve | Sheet 04 |
| **External Interface** | Chemical Dosing Feed | `20QFB24` | Chemical Dosing Air Valve | `20QFB24AA001` | Isolation Valve | Sheet 03 |
| **External Interface** | CEMS Air Feed | `20QFB10` | CEMS Air Needle Valve | `V-0748510150-0006` | Needle Valve | Sheet 03 |
| **External Interface** | IPB Pressurization | `20QFB15` | Isolated Phase Bus Supply 1 | `20QFB15AA001` | Manual Valve | Sheet 04 |
| **External Interface** | IPB Pressurization | `20QFB15` | Isolated Phase Bus Supply 2 | `20QFB15AA002` | Manual Valve | Sheet 04 |
| **External Interface** | Effluent Treatment | `20QFB13` | ETP Supply Isolation Valve | `20QFB13AA002` | Isolation Valve | Sheet 04 |
| **External Interface** | Fire Fighting Deluge | `20QFB10` | Fire Protection Supply Valve | `20SGA12AA081` | Air Valve | Sheet 04 |

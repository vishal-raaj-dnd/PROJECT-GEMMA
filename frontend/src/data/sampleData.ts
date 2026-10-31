import { DiagnosticResponse, OKFNodeSummary, GraphStats } from "../types/diagnostic";

export interface SampleQueryItem {
  id: string;
  title: string;
  subsystem: string;
  description: string;
  imagePath: string;
  queryText: string;
  diagnostic: DiagnosticResponse;
}

export interface SampleDocumentItem {
  id: string;
  title: string;
  type: string;
  filename: string;
  size: string;
  content: string;
}

export const SAMPLE_QUERIES: SampleQueryItem[] = [
  {
    id: "sample_prv_valve",
    title: "Proportional Relief Valve V2 - Pressure Decay & Oil Weepage",
    subsystem: "Nacelle Yaw Hydraulics",
    description: "Yaw brake holding pressure dropping below 160 bar; radial hydraulic fluid weeping around solenoid collar.",
    imagePath: "/samples/sample_valve_leak.webp",
    queryText: "High pressure decay on yaw circuit with radial fluid weeping around PRV-992-B hex collar. What is the repair protocol?",
    diagnostic: {
      diagnostic_id: "diag_sample_prv",
      timestamp: new Date().toISOString(),
      query_summary: "High pressure decay on yaw circuit with radial fluid weeping around PRV-992-B hex collar.",
      detected_component: {
        name: "Proportional Pressure Relief Valve V2",
        part_number: "PRV-992-B",
        node_path: "components/proportional_relief_valve_v2.md",
        confidence: 0.96,
        observed_defect: "Extruded Viton 90-durometer O-ring seal with high-pressure fluid weepage around solenoid hex collar.",
        visual_indicators: [
          "Radial hydraulic oil film around collar",
          "Darkened amber discoloration on hex flats",
          "Laser-etched serial plate PRV-992-B verified"
        ]
      },
      safety_interlocks: {
        required: true,
        acknowledged: false,
        acknowledged_by: null,
        acknowledged_at: null,
        prerequisites: [
          {
            id: "SAFE-LOTO-01",
            title: "Hydraulic System Lockout/Tagout (LOTO) & Zero-Energy Verification",
            node_path: "safety/lockout_tagout_hydraulics.md",
            checklist: [
              "De-energize main hydraulic pump motor breaker (CB-4 in Nacelle PDP)",
              "Attach personal safety padlock and OSHA LOTO tag to supply valve HV-01",
              "Open manual bleed needle valve NV-03 slowly into reservoir return",
              "Verify residual pressure reads exactly 0.0 bar (0 psi) on analog gauge PG-02",
              "Discharge nitrogen accumulator bank using 3-way dump valve"
            ],
            citation: "[^safety/lockout_tagout_hydraulics.md#isolation-procedure]"
          }
        ]
      },
      remediation_plan: {
        title: "PRV Series Solenoid Valve Seal Replacement & Torque Recalibration",
        estimated_duration_minutes: 40,
        required_tools: [
          {
            name: "Calibrated Digital Torque Wrench (10-100 Nm)",
            node_path: "tools/calibrated_torque_wrench.md",
            spec: "1/2\" drive, calibrated to +/- 2% accuracy",
            citation: "[^tools/calibrated_torque_wrench.md#specifications]"
          },
          {
            name: "Non-marring Brass O-Ring Pick",
            spec: "Prevents scoring internal aluminum sealing cavity",
            citation: "[^procedures/valve_seal_replacement.md#cleaning-and-inspection]"
          }
        ],
        steps: [
          {
            step_number: 1,
            instruction: "Verify zero pressure state on test gauge PG-02 and disconnect 24V DC Deutsch solenoid plug.",
            torque_spec: null,
            tool_required: "Digital Multimeter CAT IV",
            hazard_warning: "Ensure zero electrical potential and zero residual hydraulic pressure",
            citation: "[^safety/lockout_tagout_hydraulics.md#zero-energy-verification]"
          },
          {
            step_number: 2,
            instruction: "Loosen 4x M10 hex socket head cap screws in an alternating cross-diagonal sequence using an 8mm hex socket.",
            torque_spec: "35 Nm upon reassembly",
            tool_required: "8mm Hex Bit + Ratchet",
            hazard_warning: "Support valve body axially to prevent dropping onto rotor deck",
            citation: "[^procedures/valve_seal_replacement.md#disassembly]"
          },
          {
            step_number: 3,
            instruction: "Clean manifold cavity with lint-free wipes. Remove damaged Viton O-ring with brass pick and lubricate new seal with ISO VG 46 oil.",
            torque_spec: null,
            tool_required: "Brass Pick + Degreasing Wipes",
            hazard_warning: "PTFE backup ring must face the low-pressure return side",
            citation: "[^procedures/valve_seal_replacement.md#reassembly-and-torquing]"
          },
          {
            step_number: 4,
            instruction: "Seat valve flush into manifold. Torque 4x M10 fasteners in 3 incremental passes: 15 Nm, 25 Nm, and final torque of exactly 35 Nm.",
            torque_spec: "35 Nm (M10 Class 10.9 with light oil)",
            tool_required: "Calibrated Digital Torque Wrench (10-100 Nm)",
            hazard_warning: "Do not exceed 35 Nm to avoid stripping aluminum manifold threads",
            citation: "[^components/proportional_relief_valve_v2.md#specifications]"
          }
        ],
        post_maintenance_verification: [
          "Close bleed needle valve NV-03 and remove personal LOTO padlock.",
          "Energize pump breaker CB-4 and pressurize circuit to 210 bar.",
          "Verify zero radial fluid weepage during 15-minute continuous yaw hold test."
        ]
      },
      citations: [
        {
          citation_id: "cite_1",
          raw_citation: "[^components/proportional_relief_valve_v2.md#specifications]",
          node_path: "components/proportional_relief_valve_v2.md",
          heading: "specifications",
          exact_source_text: "Fastener Torque: 35 Nm (M10 Class 10.9 with light machine oil lubricant). Seal Material: Viton 90 Durometer FKM O-ring with PTFE backup ring.",
          verification_status: "verified"
        },
        {
          citation_id: "cite_2",
          raw_citation: "[^safety/lockout_tagout_hydraulics.md#isolation-procedure]",
          node_path: "safety/lockout_tagout_hydraulics.md",
          heading: "isolation-procedure",
          exact_source_text: "1. De-energize main hydraulic pump motor breaker (CB-4). 2. Attach personal safety padlock and OSHA tag to valve HV-01. 3. Open manual bleed needle valve NV-03.",
          verification_status: "verified"
        },
        {
          citation_id: "cite_3",
          raw_citation: "[^procedures/valve_seal_replacement.md#reassembly-and-torquing]",
          node_path: "procedures/valve_seal_replacement.md",
          heading: "reassembly-and-torquing",
          exact_source_text: "Using a Calibrated Digital Torque Wrench, torque the 4x M10 fasteners in three incremental passes: 15 Nm, 25 Nm, and final torque of exactly 35 Nm.",
          verification_status: "verified"
        }
      ],
      active_subgraph_nodes: [
        "components/proportional_relief_valve_v2.md",
        "safety/lockout_tagout_hydraulics.md",
        "procedures/valve_seal_replacement.md",
        "tools/calibrated_torque_wrench.md",
        "fault_codes/code_e302_pressure_drop.md"
      ]
    }
  },
  {
    id: "sample_pitch_pcb",
    title: "Pitch Controller Board - Scorched 24V Filter Capacitor",
    subsystem: "Rotor Pitch Control System",
    description: "Thermal scorching and ruptured electrolyte seal on capacitor C14 following high-wind pitch braking cycle.",
    imagePath: "/samples/sample_pcb_scorch.webp",
    queryText: "Burnt electrolytic capacitor C14 on Pitch Controller PCB with brown flux scorch marks. How do I isolate and replace?",
    diagnostic: {
      diagnostic_id: "diag_sample_pcb",
      timestamp: new Date().toISOString(),
      query_summary: "Burnt electrolytic capacitor C14 on Pitch Controller PCB with brown flux scorch marks.",
      detected_component: {
        name: "Pitch Controller Power Board",
        part_number: "PCB-PITCH-CTRL-V1",
        node_path: "components/pcb_pitch_controller_v1.md",
        confidence: 0.94,
        observed_defect: "Ruptured electrolyte top vent and thermal discoloration on 470uF 63V capacitor C14.",
        visual_indicators: [
          "Bulging aluminum capacitor vent score",
          "Brown scorched flux splatter on 24V rail",
          "Board silkscreen: PCB-PITCH-CTRL-V1 verified"
        ]
      },
      safety_interlocks: {
        required: true,
        acknowledged: false,
        acknowledged_by: null,
        acknowledged_at: null,
        prerequisites: [
          {
            id: "SAFE-ELEC-02",
            title: "Electrical Arc Flash & Controller Isolation Protocol",
            node_path: "safety/arc_flash_ppe_level2.md",
            checklist: [
              "Disconnect upstream 400V 3-phase AC bus feed at tower base switchgear",
              "Confirm 24V DC auxiliary backup battery bank breaker BB-02 is switched to OFF",
              "Wear arc flash face shield (minimum 8 cal/cm2 rating) and dielectric gloves",
              "Test all exposed terminals with CAT IV 1000V multimeter to ensure 0.0V potential"
            ],
            citation: "[^safety/arc_flash_ppe_level2.md#isolation-procedure]"
          }
        ]
      },
      remediation_plan: {
        title: "Pitch Controller Board Safe Replacement & Bus Verification",
        estimated_duration_minutes: 30,
        required_tools: [
          {
            name: "Digital Multimeter CAT IV 1000V",
            spec: "True-RMS certified zero-voltage test probe",
            citation: "[^safety/arc_flash_ppe_level2.md#isolation-procedure]"
          },
          {
            name: "Anti-Static ESD Wrist Strap",
            spec: "1 Megohm ground path",
            citation: "[^components/pcb_pitch_controller_v1.md#specifications]"
          }
        ],
        steps: [
          {
            step_number: 1,
            instruction: "Execute Electrical Arc Flash isolation and verify 0.0V potential across 48V and 24V bus rails.",
            torque_spec: null,
            tool_required: "CAT IV Multimeter",
            hazard_warning: "High voltage capacitor residual charge hazard",
            citation: "[^safety/arc_flash_ppe_level2.md#isolation-procedure]"
          },
          {
            step_number: 2,
            instruction: "Fasten anti-static ESD wrist strap to equipment chassis ground.",
            torque_spec: null,
            tool_required: "ESD Wrist Strap",
            hazard_warning: "Prevent electrostatic damage to FPGA logic core",
            citation: "[^components/pcb_pitch_controller_v1.md#specifications]"
          },
          {
            step_number: 3,
            instruction: "Disconnect keyed ribbon harnesses and slide damaged PCB-PITCH-CTRL-V1 from RF bay rails.",
            torque_spec: "2.5 Nm on M4 mounting screws",
            tool_required: "Torx T20 Driver",
            hazard_warning: "Handle board strictly by non-conductive edges",
            citation: "[^components/pcb_pitch_controller_v1.md#specifications]"
          }
        ],
        post_maintenance_verification: [
          "Perform bus resistance check (minimum 100k ohms across 24V rail).",
          "Re-energize auxiliary breaker and verify steady green logic status LED."
        ]
      },
      citations: [
        {
          citation_id: "cite_pcb_1",
          raw_citation: "[^components/pcb_pitch_controller_v1.md#specifications]",
          node_path: "components/pcb_pitch_controller_v1.md",
          heading: "specifications",
          exact_source_text: "Filter Capacitors: Low-ESR 470uF 63V aluminum electrolytic capacitors (C14, C15). Output Bus: Dual regulated 24V DC / 15A and 5V DC / 3A logic rail.",
          verification_status: "verified"
        },
        {
          citation_id: "cite_pcb_2",
          raw_citation: "[^safety/arc_flash_ppe_level2.md#isolation-procedure]",
          node_path: "safety/arc_flash_ppe_level2.md",
          heading: "isolation-procedure",
          exact_source_text: "1. Disconnect upstream 400V 3-phase AC bus feed. 2. Confirm 24V DC battery breaker BB-02 is OFF. 3. Test terminals with calibrated CAT IV multimeter.",
          verification_status: "verified"
        }
      ],
      active_subgraph_nodes: [
        "components/pcb_pitch_controller_v1.md",
        "safety/arc_flash_ppe_level2.md"
      ]
    }
  }
];

export const SAMPLE_DOCUMENTS: SampleDocumentItem[] = [
  {
    id: "doc_yaw_hydraulics",
    title: "Wind Turbine Yaw System Technical Service Manual",
    type: "OEM Service Manual (PDF / Markdown)",
    filename: "nacelle_yaw_hydraulics_v3.md",
    size: "148 KB",
    content: `# Nacelle Yaw Hydraulic System Technical Specification

## System Overview
The nacelle yaw hydraulic drive provides active holding torque and azimuth orientation against aerodynamic wind shear.
The hydraulic power unit operates at a nominal pressure of 210 bar (3045 psi) powered by a dual-stage gear pump.

## Proportional Pressure Relief Valve V2
The proportional relief valve (P/N PRV-992-B) regulates dynamic braking deceleration pressure.
- Maximum Operating Pressure: 210 bar
- Solenoid Supply: 24V DC +/- 10%
- Fastener Torque Specification: 35 Nm with M10 Grade 10.9 bolts lubricated with clean hydraulic oil.

## Mandatory Lockout/Tagout Isolation Protocol
Before breaking any hydraulic manifold connection:
1. De-energize main pump breaker CB-4.
2. Affix OSHA lockout padlock to valve HV-01.
3. Open manual needle valve NV-03 to bleed pressure to 0.0 bar.`
  },
  {
    id: "doc_safety_osha",
    title: "OSHA Standard 1910.147 Hazardous Energy Control Sheet",
    type: "Safety Protocol (PDF / Markdown)",
    filename: "osha_1910_147_loto_sheet.md",
    size: "82 KB",
    content: `# Hazardous Energy Control Procedure (Lockout/Tagout)

## Scope & Mandatory Application
This procedure establishes requirements for isolating mechanical, electrical, and pneumatic energy sources prior to service or maintenance.

## Zero Energy Verification Steps
1. Identify all energy sources (hydraulic accumulators, counterweights, electrical capacitor banks).
2. Apply lockout hardware and individual danger tags.
3. Bleed, ground, or mechanically block all stored energy.
4. Test with calibrated instrumentation to guarantee zero energy potential before tool engagement.`
  },
  {
    id: "doc_torque_standard",
    title: "Industrial Fastener Torque & Tool Calibration Standard",
    type: "Engineering Standard (Excel / Markdown)",
    filename: "iso_torque_fastener_spec.md",
    size: "64 KB",
    content: `# Industrial Fastener Torque Specifications & Calibration Standard

## Fastener Class 10.9 Torques (Metric Coarse)
- M6: 14 Nm
- M8: 30 Nm
- M10: 35 Nm (Hydraulic Valve Manifolds)
- M12: 85 Nm
- M16: 210 Nm

## Torque Wrench Calibration Rules
All digital and micrometer torque wrenches must maintain an active ISO/IEC 17025 calibration certificate within the preceding 12 calendar months.`
  }
];

export const INITIAL_GRAPH_NODES: OKFNodeSummary[] = [
  {
    id: "COMP-PRV-992-B",
    relative_path: "components/proportional_relief_valve_v2.md",
    category: "components",
    title: "Proportional Pressure Relief Valve V2",
    description: "Direct-acting hydraulic proportional valve regulating yaw drive brake pressure.",
    tags: ["hydraulics", "yaw-system", "pressure-relief", "valve"],
    part_numbers: ["PRV-992-B", "PRV-992-C"],
    outgoing_count: 3
  },
  {
    id: "COMP-PCB-PITCH-01",
    relative_path: "components/pcb_pitch_controller_v1.md",
    category: "components",
    title: "Pitch Controller Power Board",
    description: "Main switching power supply and gate driver PCB for turbine pitch servo actuators.",
    tags: ["electronics", "pcb", "pitch-system"],
    part_numbers: ["PCB-PITCH-CTRL-V1"],
    outgoing_count: 1
  },
  {
    id: "SAFE-LOTO-01",
    relative_path: "safety/lockout_tagout_hydraulics.md",
    category: "safety",
    title: "Hydraulic System Lockout/Tagout (LOTO) & Zero-Energy Verification",
    description: "Mandatory isolation procedure before servicing any pressurized hydraulic lines or solenoid valves.",
    tags: ["safety", "hydraulics", "loto", "osha"],
    part_numbers: [],
    outgoing_count: 0
  },
  {
    id: "SAFE-ELEC-02",
    relative_path: "safety/arc_flash_ppe_level2.md",
    category: "safety",
    title: "Electrical Arc Flash & Controller Isolation Protocol",
    description: "Mandatory safety procedures when opening main turbine pitch and yaw controller enclosures.",
    tags: ["safety", "electrical", "arc-flash", "ppe"],
    part_numbers: [],
    outgoing_count: 0
  },
  {
    id: "PROC-VALVE-01",
    relative_path: "procedures/valve_seal_replacement.md",
    category: "procedures",
    title: "Hydraulic Valve O-Ring Seal Replacement Procedure",
    description: "Standard operating procedure for replacing degraded or extruded seals on PRV series relief valves.",
    tags: ["procedure", "maintenance", "hydraulics"],
    part_numbers: [],
    outgoing_count: 2
  },
  {
    id: "TOOL-TORQUE-01",
    relative_path: "tools/calibrated_torque_wrench.md",
    category: "tools",
    title: "Calibrated Digital Torque Wrench (10-100 Nm)",
    description: "Precision digital torque wrench with angle measurement for structural fastener assemblies.",
    tags: ["tool", "calibration", "torque"],
    part_numbers: [],
    outgoing_count: 0
  },
  {
    id: "FAULT-E302",
    relative_path: "fault_codes/code_e302_pressure_drop.md",
    category: "fault_codes",
    title: "Fault Code E-302: Hydraulic Circuit Delta Pressure Loss",
    description: "Main turbine controller alarm triggered when yaw system pressure drops below 160 bar during brake hold.",
    tags: ["fault-code", "alarm", "yaw-system"],
    part_numbers: [],
    outgoing_count: 1
  }
];

export const INITIAL_GRAPH_STATS: GraphStats = {
  total_nodes: 7,
  total_edges: 7,
  category_counts: {
    components: 2,
    safety: 2,
    procedures: 1,
    tools: 1,
    fault_codes: 1
  },
  is_indexed: true
};


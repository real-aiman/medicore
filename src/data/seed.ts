import { uid, rand, randInt, isoOf, addDays } from "../utils/helpers";
import type {
  Patient, Doctor, Appointment, Prescription, LabTest, MedicineInventoryItem,
  Invoice, Bed, Department, AppNotification, HospitalSettings, HospitalState,
} from "../types";

export const DEPARTMENTS_BASE = [
  { name: "Cardiology", color: "#2563A8" },
  { name: "Neurology", color: "#0E8F82" },
  { name: "Orthopedics", color: "#B4790C" },
  { name: "Pediatrics", color: "#2E9E52" },
  { name: "General Medicine", color: "#5B6B7C" },
  { name: "Emergency", color: "#C13B3B" },
  { name: "Radiology", color: "#7C5CBF" },
  { name: "Dermatology", color: "#C2698A" },
];

const FIRST_NAMES = ["Amara","Liam","Sofia","Noah","Mira","Elias","Priya","Wesley","Layla","Owen","Nadia","Marcus","Farah","Julian","Ines","Adrian","Zara","Theo","Selin","Gabriel","Hana","Dominic","Rosa","Callum","Yara","Milo","Aiza","Simon","Leila","Victor"];
const LAST_NAMES = ["Whitfield","Nakamura","Osei","Bianchi","Karimi","Delgado","Fontaine","Herrera","Okafor","Novak","Reyes","Lindqvist","Haddad","Moreau","Ibrahim","Castillo","Larsen","Petrov","Salim","Duarte"];
function makeName() { return `${rand(FIRST_NAMES)} ${rand(LAST_NAMES)}`; }

const DOCTOR_NAMES = ["Dr. Sarah Ahmed","Dr. Michael Foster","Dr. Elena Castillo","Dr. Rajiv Menon","Dr. Claire Dubois","Dr. Tobias Reinholt","Dr. Naomi Ile","Dr. Peter Vance","Dr. Ana Markovic","Dr. Daniel Osei"];

export const DOCTORS: Doctor[] = DOCTOR_NAMES.map((name, i): Doctor => {
  const dept = DEPARTMENTS_BASE[i % DEPARTMENTS_BASE.length].name;
  return {
    id: uid("doc"),
    name,
    specialty: dept === "General Medicine" ? "Internal Medicine" : dept,
    department: dept,
    experience: randInt(3, 22),
    availability: rand(["Available", "Available", "On Leave", "Off Duty"]),
    patients: randInt(80, 640),
    rating: (4 + Math.random() * 0.9).toFixed(1),
    status: rand(["Active", "Active", "Active", "On Leave"]),
    phone: `+1 (555) ${randInt(200, 899)}-${randInt(1000, 9999)}`,
    email: name.toLowerCase().replace("dr. ", "").replace(" ", ".") + "@medicore.health",
  };
});

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
export const ALLERGY_OPTIONS = ["None known", "Penicillin", "Peanuts", "Latex", "Sulfa drugs", "Shellfish", "Pollen"];
export const CONDITION_OPTIONS = ["None", "Hypertension", "Type 2 Diabetes", "Asthma", "Hypothyroidism", "Arrhythmia"];
export const INSURANCE = ["MedShield PPO", "CarePlus HMO", "Northwind Health", "Self-pay", "Beacon Assurance"];

function makePatient(i: number): Patient {
  const first = rand(FIRST_NAMES), last = rand(LAST_NAMES);
  const dept = rand(DEPARTMENTS_BASE).name;
  const doc = rand(DOCTORS.filter((d) => d.department === dept)) || rand(DOCTORS);
  const dob = new Date(randInt(1948, 2021), randInt(0, 11), randInt(1, 28));
  const lastVisit = addDays(new Date(), -randInt(1, 120));
  return {
    id: uid("pt"),
    mrn: `MC-${10240 + i}`,
    firstName: first,
    lastName: last,
    dob: isoOf(dob),
    gender: rand(["Female", "Male"]),
    bloodGroup: rand(BLOOD_GROUPS),
    phone: `+1 (555) ${randInt(200, 899)}-${randInt(1000, 9999)}`,
    email: `${first}.${last}`.toLowerCase() + "@mail.com",
    address: `${randInt(12, 980)} ${rand(["Elm","Harbor","Cedar","Union","Maple","Fifth","Birch","River"])} St.`,
    emergencyContact: makeName(),
    emergencyRelation: rand(["Spouse", "Parent", "Sibling", "Friend"]),
    emergencyPhone: `+1 (555) ${randInt(200, 899)}-${randInt(1000, 9999)}`,
    allergies: rand(ALLERGY_OPTIONS),
    conditions: rand(CONDITION_OPTIONS),
    insurance: rand(INSURANCE),
    department: dept,
    doctorId: doc.id,
    lastVisit: isoOf(lastVisit),
    nextAppointment: Math.random() > 0.5 ? isoOf(addDays(new Date(), randInt(1, 20))) : null,
    status: rand(["Active", "Active", "Active", "Inactive"]),
    createdAt: isoOf(addDays(new Date(), -randInt(30, 900))),
  };
}
export const PATIENTS_SEED: Patient[] = Array.from({ length: 34 }, (_, i) => makePatient(i));

export const APPT_TYPES = ["Consultation", "Follow-up", "Emergency", "Procedure"];
export const APPT_STATUSES = ["Scheduled", "Confirmed", "Waiting", "In Consultation", "Completed", "Cancelled"];

function makeAppointment(patients: Patient[], dayOffset: number): Appointment {
  const p = rand(patients);
  const doc = DOCTORS.find((d) => d.id === p.doctorId) || rand(DOCTORS);
  const hour = randInt(8, 17);
  const min = rand(["00", "15", "30", "45"]);
  return {
    id: uid("apt"),
    patientId: p.id,
    doctorId: doc.id,
    department: doc.department,
    date: isoOf(addDays(new Date(), dayOffset)),
    time: `${hour % 12 === 0 ? 12 : hour % 12}:${min} ${hour < 12 ? "AM" : "PM"}`,
    type: rand(APPT_TYPES),
    status: (dayOffset < 0 ? "Completed" : rand(APPT_STATUSES.slice(0, 5))) as Appointment["status"],
    notes: "",
  };
}
export const APPOINTMENTS_SEED: Appointment[] = [
  ...Array.from({ length: 16 }, () => makeAppointment(PATIENTS_SEED, 0)),
  ...Array.from({ length: 10 }, () => makeAppointment(PATIENTS_SEED, 1)),
  ...Array.from({ length: 10 }, () => makeAppointment(PATIENTS_SEED, 2)),
  ...Array.from({ length: 8 }, () => makeAppointment(PATIENTS_SEED, -1)),
  ...Array.from({ length: 6 }, () => makeAppointment(PATIENTS_SEED, -2)),
];

export const MEDICATIONS = [
  { name: "Amoxicillin", dosage: "500 mg", freq: "3 times daily" },
  { name: "Lisinopril", dosage: "10 mg", freq: "Once daily" },
  { name: "Metformin", dosage: "850 mg", freq: "Twice daily" },
  { name: "Atorvastatin", dosage: "20 mg", freq: "Once daily, evening" },
  { name: "Albuterol Inhaler", dosage: "2 puffs", freq: "As needed" },
  { name: "Levothyroxine", dosage: "75 mcg", freq: "Once daily, morning" },
  { name: "Ibuprofen", dosage: "400 mg", freq: "Every 6 hours as needed" },
];
function makePrescription(): Prescription {
  const p = rand(PATIENTS_SEED);
  const doc = DOCTORS.find((d) => d.id === p.doctorId) || rand(DOCTORS);
  const med = rand(MEDICATIONS);
  const start = addDays(new Date(), -randInt(0, 30));
  const end = addDays(start, randInt(5, 30));
  return {
    id: uid("rx"),
    patientId: p.id,
    doctorId: doc.id,
    medication: med.name,
    dosage: med.dosage,
    frequency: med.freq,
    instructions: "Take with food. Sample instructions for demonstration purposes.",
    startDate: isoOf(start),
    endDate: isoOf(end),
    status: end < new Date() ? "Completed" : "Active",
  };
}
export const PRESCRIPTIONS_SEED: Prescription[] = Array.from({ length: 14 }, makePrescription);

export const LAB_TESTS = [
  { name: "Complete Blood Count", range: "4.5-11.0 x10^9/L" },
  { name: "Lipid Panel", range: "LDL < 100 mg/dL" },
  { name: "Basic Metabolic Panel", range: "Glucose 70-99 mg/dL" },
  { name: "Thyroid Function (TSH)", range: "0.4-4.0 mIU/L" },
  { name: "Chest X-Ray", range: "No abnormality" },
  { name: "Urinalysis", range: "Negative for protein" },
];
function makeLabTest(dayOffset: number): LabTest {
  const p = rand(PATIENTS_SEED);
  const doc = DOCTORS.find((d) => d.id === p.doctorId) || rand(DOCTORS);
  const t = rand(LAB_TESTS);
  const status = (dayOffset < 0 ? "Completed" : rand(["Pending", "Processing", "Pending"])) as LabTest["status"];
  return {
    id: uid("lab"),
    patientId: p.id,
    doctorId: doc.id,
    test: t.name,
    referenceRange: t.range,
    date: isoOf(addDays(new Date(), dayOffset)),
    status,
    result: status === "Completed" ? "Within normal limits" : "",
  };
}
export const LABS_SEED: LabTest[] = [
  ...Array.from({ length: 8 }, () => makeLabTest(randInt(0, 2))),
  ...Array.from({ length: 10 }, () => makeLabTest(-randInt(1, 15))),
];

const MED_INVENTORY_NAMES = ["Amoxicillin 500mg","Paracetamol 500mg","Metformin 850mg","Atorvastatin 20mg","Insulin Glargine","Salbutamol Inhaler","Omeprazole 20mg","Ceftriaxone 1g Vial","Losartan 50mg","Cetirizine 10mg","Azithromycin 250mg","Warfarin 5mg"];
export const PHARMACY_SEED: MedicineInventoryItem[] = MED_INVENTORY_NAMES.map((name): MedicineInventoryItem => {
  const stock = randInt(0, 400);
  const expiry = addDays(new Date(), randInt(-10, 400));
  let status: MedicineInventoryItem["status"] = "In Stock";
  if (stock === 0) status = "Out of Stock";
  else if (stock < 40) status = "Low Stock";
  if (expiry < new Date()) status = "Expired";
  return {
    id: uid("med"),
    name,
    category: rand(["Antibiotic", "Analgesic", "Chronic Care", "Respiratory", "Cardiac", "Antihistamine"]),
    stock,
    expiry: isoOf(expiry),
    supplier: rand(["Vantage Pharma", "Northgate Supply Co.", "Union Medical Distributors", "Clearwater Labs"]),
    status,
  };
});

function makeInvoice(i: number): Invoice {
  const p = rand(PATIENTS_SEED);
  const items = Array.from({ length: randInt(1, 3) }, () => ({
    label: rand(["Consultation Fee", "Lab Test", "Medication", "Procedure Fee", "Room Charge"]),
    amount: randInt(40, 900),
  }));
  const subtotal = items.reduce((a, b) => a + b.amount, 0);
  const tax = Math.round(subtotal * 0.07);
  const dayOffset = -randInt(0, 40);
  return {
    id: `INV-${2200 + i}`,
    patientId: p.id,
    date: isoOf(addDays(new Date(), dayOffset)),
    items,
    subtotal,
    tax,
    total: subtotal + tax,
    method: rand(["Credit Card", "Insurance", "Cash", "Bank Transfer"]),
    status: dayOffset < -20 ? rand(["Paid", "Overdue"]) : rand(["Paid", "Pending", "Pending"]),
  };
}
export const INVOICES_SEED: Invoice[] = Array.from({ length: 18 }, (_, i) => makeInvoice(i));

export const WARDS = ["ICU", "General Ward", "Emergency", "Private Rooms"];
const WARD_PREFIX = { ICU: "I", "General Ward": "G", Emergency: "E", "Private Rooms": "P" };
const WARD_COUNT = { ICU: 12, "General Ward": 28, Emergency: 10, "Private Rooms": 14 };
function makeBeds(): Bed[] {
  const beds: Bed[] = [];
  const occupiedPatients = [...PATIENTS_SEED].sort(() => Math.random() - 0.5);
  let pIdx = 0;
  WARDS.forEach((ward) => {
    for (let i = 1; i <= WARD_COUNT[ward as keyof typeof WARD_COUNT]; i++) {
      const roll = Math.random();
      let status: Bed["status"] = "Available";
      if (roll < 0.46) status = "Occupied";
      else if (roll < 0.58) status = "Reserved";
      else if (roll < 0.68) status = "Cleaning";
      else if (roll < 0.72) status = "Maintenance";
      const patientId = status === "Occupied" ? occupiedPatients[pIdx++ % occupiedPatients.length].id : null;
      beds.push({ id: uid("bed"), ward, number: `${WARD_PREFIX[ward as keyof typeof WARD_PREFIX]}-${100 + i}`, status, patientId });
    }
  });
  return beds;
}
export const BEDS_SEED: Bed[] = makeBeds();

export const NOTIFICATIONS_SEED: AppNotification[] = [
  { id: uid("ntf"), message: "3 appointments starting soon in Cardiology", type: "info", read: false, createdAt: Date.now() - 1000 * 60 * 6 },
  { id: uid("ntf"), message: "ICU bed availability changed \u2014 2 beds freed", type: "info", read: false, createdAt: Date.now() - 1000 * 60 * 40 },
  { id: uid("ntf"), message: "5 patients awaiting billing confirmation", type: "warning", read: false, createdAt: Date.now() - 1000 * 60 * 90 },
  { id: uid("ntf"), message: "Low pharmacy stock: Insulin Glargine", type: "critical", read: false, createdAt: Date.now() - 1000 * 60 * 130 },
  { id: uid("ntf"), message: "Lab result ready for a recent patient", type: "info", read: true, createdAt: Date.now() - 1000 * 60 * 300 },
];

export const DEPARTMENTS_SEED: Department[] = DEPARTMENTS_BASE.map((d): Department => {
  const deptDocs = DOCTORS.filter((doc) => doc.department === d.name);
  const deptPatients = PATIENTS_SEED.filter((p) => p.department === d.name);
  return {
    name: d.name,
    color: d.color,
    headDoctor: deptDocs[0]?.name || DOCTORS[0].name,
    doctors: deptDocs.length || 1,
    patients: deptPatients.length,
    availableBeds: randInt(3, 14),
    status: "Operational",
  };
});

export const DEFAULT_SETTINGS: HospitalSettings = {
  hospitalName: "MediCore General Hospital",
  address: "482 Harborview Ave, Boston, MA 02110",
  phone: "+1 (617) 555-0148",
  email: "admin@medicore.health",
  accent: "blue",
  apptNotifications: true,
  lowStockAlerts: true,
  billingAlerts: true,
  dateFormat: "MMM D, YYYY",
  timeFormat: "12h",
};

export const initialState: HospitalState = {
  patients: PATIENTS_SEED,
  doctors: DOCTORS,
  appointments: APPOINTMENTS_SEED,
  prescriptions: PRESCRIPTIONS_SEED,
  labs: LABS_SEED,
  pharmacy: PHARMACY_SEED,
  invoices: INVOICES_SEED,
  beds: BEDS_SEED,
  departments: DEPARTMENTS_SEED,
  notifications: NOTIFICATIONS_SEED,
  settings: DEFAULT_SETTINGS,
  hydrated: false,
};

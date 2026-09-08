export type Gender = "Female" | "Male" | "Other";
export type PatientStatus = "Active" | "Inactive";

export interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: Gender;
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  emergencyRelation: string;
  emergencyPhone: string;
  allergies: string;
  conditions: string;
  insurance: string;
  department: string;
  doctorId: string;
  lastVisit: string;
  nextAppointment: string | null;
  status: PatientStatus;
  createdAt: string;
}

export type DoctorAvailability = "Available" | "On Leave" | "Off Duty";
export type DoctorStatus = "Active" | "On Leave";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  experience: number;
  availability: DoctorAvailability;
  patients: number;
  rating: string;
  status: DoctorStatus;
  phone: string;
  email: string;
}

export type AppointmentType = "Consultation" | "Follow-up" | "Emergency" | "Procedure";
export type AppointmentStatus =
  | "Scheduled" | "Confirmed" | "Waiting" | "In Consultation" | "Completed" | "Cancelled";

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  department: string;
  date: string;
  time: string;
  type: AppointmentType | string;
  status: AppointmentStatus;
  notes: string;
}

export type PrescriptionStatus = "Active" | "Completed" | "Expired";

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medication: string;
  dosage: string;
  frequency: string;
  instructions: string;
  startDate: string;
  endDate: string;
  status: PrescriptionStatus;
}

export type LabStatus = "Pending" | "Processing" | "Completed";

export interface LabTest {
  id: string;
  patientId: string;
  doctorId: string;
  test: string;
  referenceRange: string;
  date: string;
  status: LabStatus;
  result: string;
}

export type MedicineStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Expired";

export interface MedicineInventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  expiry: string;
  supplier: string;
  status: MedicineStatus;
}

export interface InvoiceLineItem {
  label: string;
  amount: number;
}

export type InvoiceStatus = "Paid" | "Pending" | "Overdue";

export interface Invoice {
  id: string;
  patientId: string;
  date: string;
  items: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  method: string;
  status: InvoiceStatus;
}

export type BedStatus = "Available" | "Occupied" | "Reserved" | "Cleaning" | "Maintenance";

export interface Bed {
  id: string;
  ward: string;
  number: string;
  status: BedStatus;
  patientId: string | null;
}

export interface Department {
  name: string;
  color: string;
  headDoctor: string;
  doctors: number;
  patients: number;
  availableBeds: number;
  status: string;
}

export type NotificationType = "info" | "warning" | "critical";

export interface AppNotification {
  id: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: number;
}

export interface HospitalSettings {
  hospitalName: string;
  address: string;
  phone: string;
  email: string;
  accent: string;
  apptNotifications: boolean;
  lowStockAlerts: boolean;
  billingAlerts: boolean;
  dateFormat: string;
  timeFormat: string;
}

export interface HospitalState {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  labs: LabTest[];
  pharmacy: MedicineInventoryItem[];
  invoices: Invoice[];
  beds: Bed[];
  departments: Department[];
  notifications: AppNotification[];
  settings: HospitalSettings;
  hydrated: boolean;
}

/** Legacy dispatch-style actions, kept so existing call sites
 *  (`dispatch({ type: "ADD_PATIENT", payload })`) don't need touching
 *  after the move to Zustand. */
export type HospitalAction =
  | { type: "HYDRATE"; payload: Partial<HospitalState> }
  | { type: "ADD_PATIENT"; payload: Patient }
  | { type: "UPDATE_PATIENT"; payload: Partial<Patient> & { id: string } }
  | { type: "DELETE_PATIENT"; payload: string }
  | { type: "ADD_APPOINTMENT"; payload: Appointment }
  | { type: "UPDATE_APPOINTMENT"; payload: Partial<Appointment> & { id: string } }
  | { type: "ADD_PRESCRIPTION"; payload: Prescription }
  | { type: "DELETE_PRESCRIPTION"; payload: string }
  | { type: "ADD_LAB"; payload: LabTest }
  | { type: "UPDATE_LAB"; payload: Partial<LabTest> & { id: string } }
  | { type: "UPDATE_BED"; payload: Partial<Bed> & { id: string } }
  | { type: "ADD_INVOICE"; payload: Invoice }
  | { type: "UPDATE_INVOICE"; payload: Partial<Invoice> & { id: string } }
  | { type: "DISMISS_NOTIF"; payload: string }
  | { type: "MARK_ALL_READ" }
  | { type: "UPDATE_SETTINGS"; payload: Partial<HospitalSettings> };

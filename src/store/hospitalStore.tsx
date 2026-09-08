import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { initialState } from "../data/seed";
import type { HospitalState, HospitalAction } from "../types";

const STORAGE_KEY = "medicore:v2";

function reduce(state: HospitalState, action: HospitalAction): HospitalState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, ...action.payload, hydrated: true };
    case "ADD_PATIENT":
      return { ...state, patients: [action.payload, ...state.patients] };
    case "UPDATE_PATIENT":
      return { ...state, patients: state.patients.map((p) => (p.id === action.payload.id ? { ...p, ...action.payload } : p)) };
    case "DELETE_PATIENT":
      return { ...state, patients: state.patients.filter((p) => p.id !== action.payload) };
    case "ADD_APPOINTMENT":
      return { ...state, appointments: [action.payload, ...state.appointments] };
    case "UPDATE_APPOINTMENT":
      return { ...state, appointments: state.appointments.map((a) => (a.id === action.payload.id ? { ...a, ...action.payload } : a)) };
    case "ADD_PRESCRIPTION":
      return { ...state, prescriptions: [action.payload, ...state.prescriptions] };
    case "DELETE_PRESCRIPTION":
      return { ...state, prescriptions: state.prescriptions.filter((r) => r.id !== action.payload) };
    case "ADD_LAB":
      return { ...state, labs: [action.payload, ...state.labs] };
    case "UPDATE_LAB":
      return { ...state, labs: state.labs.map((l) => (l.id === action.payload.id ? { ...l, ...action.payload } : l)) };
    case "UPDATE_BED":
      return { ...state, beds: state.beds.map((b) => (b.id === action.payload.id ? { ...b, ...action.payload } : b)) };
    case "ADD_INVOICE":
      return { ...state, invoices: [action.payload, ...state.invoices] };
    case "UPDATE_INVOICE":
      return { ...state, invoices: state.invoices.map((i) => (i.id === action.payload.id ? { ...i, ...action.payload } : i)) };
    case "DISMISS_NOTIF":
      return { ...state, notifications: state.notifications.filter((n) => n.id !== action.payload) };
    case "MARK_ALL_READ":
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) };
    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } };
    default:
      return state;
  }
}

interface HospitalStoreShape extends HospitalState {
  dispatch: (action: HospitalAction) => void;
}

/**
 * Zustand store with the `persist` middleware writing to localStorage.
 * Doctors/departments are seed/reference data, so they're excluded from
 * the persisted slice (see `partialize`) and always come from the
 * bundled seed on load.
 */
export const useHospitalStore = create<HospitalStoreShape>()(
  persist(
    (set) => ({
      ...initialState,
      dispatch: (action) => set((state) => reduce(state, action)),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        const { doctors, departments, dispatch, hydrated, ...persisted } = state;
        return persisted;
      },
      onRehydrateStorage: () => (state) => {
        // localStorage reads are effectively synchronous, but this callback
        // is the correct hook point to flip `hydrated` once persisted data
        // (if any) has been merged into the store.
        state?.dispatch({ type: "HYDRATE", payload: {} });
      },
    }
  )
);

/**
 * Back-compat hook: existing pages call `const { state, dispatch } = useStore()`
 * and `dispatch({ type: "...", payload })`, matching the app's original
 * Context+useReducer store. This wraps the Zustand store so none of those
 * call sites needed to change during the Zustand migration.
 */
export function useStore() {
  const { dispatch, ...state } = useHospitalStore();
  return { state, dispatch };
}

import { z } from "zod";

// Doctor schema based on actual MedMap Supabase database
export interface Doctor {
  id: string;
  user_id?: string;
  practice_name: string;
  speciality: string;
  qualification?: string;
  license_number?: string;
  years_experience: number;
  consultation_fee: number;
  address?: string;
  city: string;
  province: string;
  postal_code?: string;
  bio?: string;
  profile_image_url?: string;
  rating?: number;
  total_bookings?: number;
  is_available: boolean;
  approved_at?: string;
  approved_by?: string;
  accepted_insurances?: string[];
  created_at: string;
  updated_at: string;
  // Computed/joined fields
  name?: string;
  email?: string;
  phone?: string;
}

// Booking/Appointment schema based on actual MedMap Supabase database
export interface Appointment {
  id: string;
  user_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  consultation_fee: number;
  booking_fee?: number;
  total_amount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  patient_notes?: string;
  doctor_notes?: string;
  payment_reference?: string;
  payment_status?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Computed/joined fields
  patient_name?: string;
  doctor_name?: string;
}

// Profile schema (acts as both patients and users)
export interface Patient {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  // Computed
  name?: string;
}

// Dashboard stats
export interface DashboardStats {
  total_doctors: number;
  active_patients: number;
  today_appointments: number;
  total_revenue: number;
  revenue_trend: number;
  doctors_trend: number;
  patients_trend: number;
  appointments_trend: number;
}

// Validation schemas
export const updateDoctorStatusSchema = z.object({
  approved_at: z.string().optional(),
  approved_by: z.string().optional(),
  is_available: z.boolean().optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
});

export type UpdateDoctorStatus = z.infer<typeof updateDoctorStatusSchema>;
export type UpdateAppointmentStatus = z.infer<typeof updateAppointmentStatusSchema>;

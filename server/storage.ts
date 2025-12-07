import { supabase } from "./supabase";
import type { Doctor, Appointment, Patient, DashboardStats } from "@shared/schema";

export interface IStorage {
  // Doctors
  getDoctors(filters?: {
    status?: string;
    province?: string;
    specialty?: string;
    search?: string;
  }): Promise<Doctor[]>;
  getDoctorById(id: string): Promise<Doctor | null>;
  updateDoctorStatus(id: string, approved: boolean): Promise<Doctor | null>;
  
  // Appointments/Bookings
  getAppointments(filters?: {
    status?: string;
    date?: string;
    search?: string;
  }): Promise<Appointment[]>;
  getAppointmentById(id: string): Promise<Appointment | null>;
  updateAppointmentStatus(id: string, status: "pending" | "confirmed" | "cancelled" | "completed"): Promise<Appointment | null>;
  
  // Patients/Profiles
  getPatients(filters?: {
    search?: string;
  }): Promise<Patient[]>;
  getPatientById(id: string): Promise<Patient | null>;
  
  // Dashboard
  getDashboardStats(): Promise<DashboardStats>;
}

export class SupabaseStorage implements IStorage {
  async getDoctors(filters?: {
    status?: string;
    province?: string;
    specialty?: string;
    search?: string;
  }): Promise<Doctor[]> {
    let query = supabase.from('doctors').select('*');

    // Filter by approval status
    if (filters?.status === 'verified') {
      query = query.not('approved_at', 'is', null);
    } else if (filters?.status === 'pending') {
      query = query.is('approved_at', null);
    }

    if (filters?.province && filters.province !== 'all') {
      query = query.eq('province', filters.province);
    }

    if (filters?.specialty && filters.specialty !== 'all') {
      query = query.eq('speciality', filters.specialty);
    }

    if (filters?.search) {
      query = query.or(`practice_name.ilike.%${filters.search}%,speciality.ilike.%${filters.search}%`);
    }

    const { data: doctorsData, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching doctors:', error);
      throw new Error(error.message);
    }

    if (!doctorsData || doctorsData.length === 0) {
      return [];
    }

    // Fetch associated profiles separately if user_id is available
    const userIds = doctorsData.map(d => d.user_id).filter(Boolean);
    const { data: profiles } = userIds.length > 0 
      ? await supabase.from('profiles').select('id, email, first_name, last_name, phone').in('id', userIds)
      : { data: [] };

    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

    // Transform data to match interface
    return doctorsData.map((doc: any) => {
      const profile = doc.user_id ? profileMap.get(doc.user_id) : null;
      
      return {
        ...doc,
        name: profile ? `${profile.first_name} ${profile.last_name}` : doc.practice_name,
        email: profile?.email,
        phone: profile?.phone,
        status: doc.approved_at ? 'verified' : 'pending',
        specialty: doc.speciality,
        experience: doc.years_experience,
        price: doc.consultation_fee,
      };
    });
  }

  async getDoctorById(id: string): Promise<Doctor | null> {
    const { data: doctor, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching doctor:', error);
      return null;
    }

    // Fetch associated profile if user_id exists
    let profile = null;
    if (doctor.user_id) {
      const { data } = await supabase
        .from('profiles')
        .select('email, first_name, last_name, phone')
        .eq('id', doctor.user_id)
        .single();
      profile = data;
    }

    return {
      ...doctor,
      name: profile ? `${profile.first_name} ${profile.last_name}` : doctor.practice_name,
      email: profile?.email,
      phone: profile?.phone,
      status: doctor.approved_at ? 'verified' : 'pending',
      specialty: doctor.speciality,
      experience: doctor.years_experience,
      price: doctor.consultation_fee,
    };
  }

  async updateDoctorStatus(id: string, approved: boolean): Promise<Doctor | null> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (approved) {
      updateData.approved_at = new Date().toISOString();
      updateData.approved_by = 'admin'; // TODO: Add actual admin user ID
      updateData.is_available = true;
    } else {
      updateData.approved_at = null;
      updateData.approved_by = null;
      updateData.is_available = false;
    }

    const { data: doctor, error } = await supabase
      .from('doctors')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating doctor status:', error);
      throw new Error(error.message);
    }

    // Fetch associated profile if user_id exists
    let profile = null;
    if (doctor.user_id) {
      const { data } = await supabase
        .from('profiles')
        .select('email, first_name, last_name, phone')
        .eq('id', doctor.user_id)
        .single();
      profile = data;
    }

    return {
      ...doctor,
      name: profile ? `${profile.first_name} ${profile.last_name}` : doctor.practice_name,
      email: profile?.email,
      phone: profile?.phone,
      status: doctor.approved_at ? 'verified' : 'pending',
      specialty: doctor.speciality,
      experience: doctor.years_experience,
      price: doctor.consultation_fee,
    };
  }

  async getAppointments(filters?: {
    status?: string;
    date?: string;
    search?: string;
  }): Promise<Appointment[]> {
    let query = supabase.from('bookings').select('*');

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.date) {
      query = query.eq('appointment_date', filters.date);
    }

    const { data: bookings, error } = await query.order('appointment_date', { ascending: false }).limit(100);

    if (error) {
      console.error('Error fetching appointments:', error);
      throw new Error(error.message);
    }

    if (!bookings || bookings.length === 0) {
      return [];
    }

    // Fetch associated profiles and doctors separately
    const userIds = [...new Set(bookings.map(b => b.user_id))];
    const doctorIds = [...new Set(bookings.map(b => b.doctor_id))];

    const [{ data: profiles }, { data: doctors }] = await Promise.all([
      supabase.from('profiles').select('id, first_name, last_name, email').in('id', userIds),
      supabase.from('doctors').select('id, practice_name, speciality').in('id', doctorIds),
    ]);

    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
    const doctorMap = new Map(doctors?.map(d => [d.id, d]) || []);

    // Transform data
    return bookings.map((apt: any) => {
      const profile = profileMap.get(apt.user_id);
      const doctor = doctorMap.get(apt.doctor_id);

      return {
        ...apt,
        patient_name: profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown',
        doctor_name: doctor?.practice_name || 'Unknown',
      };
    });
  }

  async getAppointmentById(id: string): Promise<Appointment | null> {
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching appointment:', error);
      return null;
    }

    // Fetch associated profile and doctor
    const [{ data: profile }, { data: doctor }] = await Promise.all([
      supabase.from('profiles').select('first_name, last_name, email').eq('id', booking.user_id).single(),
      supabase.from('doctors').select('practice_name, speciality').eq('id', booking.doctor_id).single(),
    ]);

    return {
      ...booking,
      patient_name: profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown',
      doctor_name: doctor?.practice_name || 'Unknown',
    };
  }

  async updateAppointmentStatus(id: string, status: "pending" | "confirmed" | "cancelled" | "completed"): Promise<Appointment | null> {
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating appointment status:', error);
      throw new Error(error.message);
    }

    // Fetch associated profile and doctor
    const [{ data: profile }, { data: doctor }] = await Promise.all([
      supabase.from('profiles').select('first_name, last_name, email').eq('id', booking.user_id).single(),
      supabase.from('doctors').select('practice_name, speciality').eq('id', booking.doctor_id).single(),
    ]);

    return {
      ...booking,
      patient_name: profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown',
      doctor_name: doctor?.practice_name || 'Unknown',
    };
  }

  async getPatients(filters?: { search?: string }): Promise<Patient[]> {
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('role', 'user'); // Only get patients/users, not doctors

    if (filters?.search) {
      query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching patients:', error);
      throw new Error(error.message);
    }

    return (data || []).map((profile: any) => ({
      ...profile,
      name: `${profile.first_name} ${profile.last_name}`,
    }));
  }

  async getPatientById(id: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching patient:', error);
      return null;
    }

    return {
      ...data,
      name: `${data.first_name} ${data.last_name}`,
    };
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const [
      { count: totalDoctors },
      { count: activePatients },
      { data: todayBookings },
    ] = await Promise.all([
      supabase.from('doctors').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user'),
      supabase
        .from('bookings')
        .select('*')
        .eq('appointment_date', new Date().toISOString().split('T')[0]),
    ]);

    // Calculate revenue from completed bookings this month
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const { data: completedBookings } = await supabase
      .from('bookings')
      .select('total_amount')
      .eq('status', 'completed')
      .gte('appointment_date', firstDayOfMonth);

    const totalRevenue = completedBookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;

    return {
      total_doctors: totalDoctors || 0,
      active_patients: activePatients || 0,
      today_appointments: todayBookings?.length || 0,
      total_revenue: totalRevenue,
      revenue_trend: 15.3,
      doctors_trend: 12.5,
      patients_trend: 8.2,
      appointments_trend: -2.1,
    };
  }

  async createPatient(data: {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }): Promise<Patient> {
    const tempPassword = Math.random().toString(36).slice(-12);

    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: tempPassword,
      email_confirm: true,
    });

    if (authError || !authUser.user) {
      throw new Error(`Failed to create auth user: ${authError?.message}`);
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authUser.user.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        role: 'user',
        email_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select('*')
      .single();

    if (profileError) {
      throw new Error(`Failed to create profile: ${profileError.message}`);
    }

    return {
      ...profile,
      name: `${profile.first_name} ${profile.last_name}`,
    };
  }

  async resetPatientPassword(patientId: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const { error } = await supabase.auth.admin.updateUserById(patientId, {
      password: newPassword,
    });

    if (error) {
      throw new Error(`Failed to reset password: ${error.message}`);
    }

    return {
      success: true,
      message: 'Password reset successfully. User can now log in with the new temporary password.',
    };
  }

  async getActivityLogs(filters?: {
    adminId?: string;
    limit?: number;
  }): Promise<any[]> {
    let query = supabase.from('activity_logs').select('*');

    if (filters?.adminId) {
      query = query.eq('admin_id', filters.adminId);
    }

    const limit = filters?.limit || 100;
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching activity logs:', error);
      return [];
    }

    return data || [];
  }
}

export const storage = new SupabaseStorage();

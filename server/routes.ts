import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { updateDoctorStatusSchema, updateAppointmentStatusSchema } from "@shared/schema";
import { authenticateAdmin } from "./middleware/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply authentication middleware to all admin API routes
  // In development, we'll skip auth for easier testing
  const isDev = process.env.NODE_ENV === "development";
  const authMiddleware = isDev ? [] : [authenticateAdmin];

  // Dashboard stats
  app.get("/api/stats", ...authMiddleware, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Doctors endpoints
  app.get("/api/doctors", ...authMiddleware, async (req, res) => {
    try {
      const { status, province, specialty, search } = req.query;
      const doctors = await storage.getDoctors({
        status: status as string,
        province: province as string,
        specialty: specialty as string,
        search: search as string,
      });
      res.json(doctors);
    } catch (error: any) {
      console.error('Error fetching doctors:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/doctors/:id", ...authMiddleware, async (req, res) => {
    try {
      const doctor = await storage.getDoctorById(req.params.id);
      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }
      res.json(doctor);
    } catch (error: any) {
      console.error('Error fetching doctor:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/doctors/:id/status", ...authMiddleware, async (req, res) => {
    try {
      const { approved } = req.body;
      
      if (typeof approved !== 'boolean') {
        return res.status(400).json({ error: 'approved field must be a boolean' });
      }

      const doctor = await storage.updateDoctorStatus(req.params.id, approved);

      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }

      res.json(doctor);
    } catch (error: any) {
      console.error('Error updating doctor status:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Appointments endpoints
  app.get("/api/appointments", ...authMiddleware, async (req, res) => {
    try {
      const { status, date, search } = req.query;
      const appointments = await storage.getAppointments({
        status: status as string,
        date: date as string,
        search: search as string,
      });
      res.json(appointments);
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/appointments/:id", ...authMiddleware, async (req, res) => {
    try {
      const appointment = await storage.getAppointmentById(req.params.id);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error: any) {
      console.error('Error fetching appointment:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/appointments/:id/status", ...authMiddleware, async (req, res) => {
    try {
      const validation = updateAppointmentStatusSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      const appointment = await storage.updateAppointmentStatus(
        req.params.id,
        validation.data.status
      );

      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      res.json(appointment);
    } catch (error: any) {
      console.error('Error updating appointment status:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Patients endpoints
  app.get("/api/patients", ...authMiddleware, async (req, res) => {
    try {
      const { search } = req.query;
      const patients = await storage.getPatients({
        search: search as string,
      });
      res.json(patients);
    } catch (error: any) {
      console.error('Error fetching patients:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/patients/:id", ...authMiddleware, async (req, res) => {
    try {
      const patient = await storage.getPatientById(req.params.id);
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      res.json(patient);
    } catch (error: any) {
      console.error('Error fetching patient:', error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

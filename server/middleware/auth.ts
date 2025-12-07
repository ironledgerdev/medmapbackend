import type { Request, Response, NextFunction } from "express";
import { supabase } from "../supabase";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export async function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Missing authorization token" });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, email")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    req.user = {
      id: user.id,
      email: user.email || "",
      role: profile.role,
    };

    next();
  } catch (error: any) {
    console.error("Auth error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
}

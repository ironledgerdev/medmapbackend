import type { Request, Response, NextFunction } from "express";

// Simple API key authentication middleware
export function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] as string;
  const adminApiKey = process.env.ADMIN_API_KEY;

  if (!adminApiKey) {
    console.error('ADMIN_API_KEY environment variable is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  if (!apiKey || apiKey !== adminApiKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }

  next();
}

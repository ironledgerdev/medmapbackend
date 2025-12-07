import https from 'https';
import fs from 'fs';
import path from 'path';
import { Express } from 'express';
import { Server as HTTPServer } from 'http';
import selfsigned from 'selfsigned';

export async function createSecureServer(app: Express, httpServer: HTTPServer): Promise<https.Server> {
  const certDir = path.join(process.cwd(), 'server');
  const keyPath = path.join(certDir, 'server.key');
  const certPath = path.join(certDir, 'server.crt');

  let key: string;
  let cert: string;

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    key = fs.readFileSync(keyPath, 'utf-8');
    cert = fs.readFileSync(certPath, 'utf-8');
  } else {
    const pems = selfsigned.generate([
      { name: 'commonName', value: 'localhost' },
      { name: 'countryName', value: 'ZA' },
      { name: 'stateOrProvinceName', value: 'ZA' },
      { name: 'localityName', value: 'localhost' },
      { name: 'organizationName', value: 'MedMap Admin' }
    ], {
      days: 365,
      algorithm: 'sha256',
      keySize: 2048,
    });

    key = pems.private;
    cert = pems.cert;

    try {
      fs.writeFileSync(keyPath, key, { mode: 0o600 });
      fs.writeFileSync(certPath, cert, { mode: 0o644 });
    } catch (err) {
      console.warn('Could not write certificates to disk, using in-memory only');
    }
  }

  const httpsServer = https.createServer({ key, cert }, app);
  return httpsServer;
}

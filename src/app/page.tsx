import Link from "next/link";
import { readSettings } from "@/lib/data";

export default async function HomePage() {
  const settings = await readSettings();

  return (
    <div className="card">
      <div className="grid">
        <div>
          <span className="badge">Okul QR Sistemi</span>
          <h1>{settings.schoolName}</h1>
          <p className="small">
            Ogretmen secimi yapin, QR kodu okutun ve mesajinizi kolayca iletin.
          </p>
        </div>
        <div className="grid two">
          <Link className="button" href="/admin/login">
            Admin Login
          </Link>
          <Link className="button secondary" href="/student">
            Student Login
          </Link>
        </div>
      </div>
    </div>
  );
}

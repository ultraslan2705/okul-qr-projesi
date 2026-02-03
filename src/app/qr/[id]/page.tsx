"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";

type Teacher = {
  id: string;
  name: string;
  surname: string;
  email: string;
};

export default function QrPage() {
  const params = useParams();
  const id = String(params.id ?? "");
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    void fetch(`/api/teachers?id=${id}`)
      .then((res) => res.json())
      .then((data) => setTeacher(data));
  }, [id]);

  const qrValue = useMemo(() => {
    if (!origin) return "";
    return `${origin}/form/${id}`;
  }, [origin, id]);

  return (
    <div className="grid">
      <div className="nav">
        <Link className="button secondary" href="/student">
          Geri Don
        </Link>
      </div>
      <div className="card">
        <h1>QR Kodu</h1>
        {teacher ? (
          <p className="small">
            {teacher.name} {teacher.surname} icin QR kodu olusturuldu.
          </p>
        ) : (
          <p className="small">Ogretmen yukleniyor...</p>
        )}
        {qrValue ? (
          <div style={{ marginTop: 16 }}>
            <QRCodeCanvas value={qrValue} size={220} />
            <p className="small" style={{ marginTop: 12 }}>
              QR kodunu okutunca mesaj formu acilir.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

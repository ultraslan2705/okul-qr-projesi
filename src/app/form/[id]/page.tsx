"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import emailjs from "@emailjs/browser";

type Teacher = {
  id: string;
  name: string;
  surname: string;
  email: string;
};

export default function FormPage() {
  const params = useParams();
  const id = String(params.id ?? "");
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [studentName, setStudentName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    void fetch(`/api/teachers?id=${id}`)
      .then((res) => res.json())
      .then((data) => setTeacher(data));
  }, [id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    if (!teacher) {
      setStatus("Ogretmen bilgisi bulunamadi.");
      return;
    }

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus("EmailJS bilgileri eksik. Lutfen .env.local dosyasini kontrol edin.");
      return;
    }

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          to_email: teacher.email,
          teacher_name: `${teacher.name} ${teacher.surname}`,
          student_name: studentName,
          message
        },
        publicKey
      );
      setStudentName("");
      setMessage("");
      setStatus("Mesaj gonderildi.");
    } catch (error) {
      setStatus("Mesaj gonderilemedi.");
    }
  }

  return (
    <div className="grid">
      <div className="nav">
        <Link className="button secondary" href="/">
          Ana Sayfa
        </Link>
      </div>
      <div className="card">
        <h1>Mesaj Formu</h1>
        {teacher ? (
          <p className="small">
            {teacher.name} {teacher.surname} ogretmenine mesaj gonderiyorsunuz.
          </p>
        ) : (
          <p className="small">Ogretmen yukleniyor...</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Ogrenci Adi</label>
            <input
              className="input"
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Mesaj</label>
            <textarea
              className="input"
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
            />
          </div>
          <button className="button" type="submit">
            Mesaj Gonder
          </button>
        </form>
        {status ? <p className="small">{status}</p> : null}
      </div>
    </div>
  );
}

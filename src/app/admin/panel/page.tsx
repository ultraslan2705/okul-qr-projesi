"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Settings = {
  schoolName: string;
  adminPassword: string;
};

type Teacher = {
  id: string;
  name: string;
  surname: string;
  email: string;
};

export default function AdminPanelPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({
    schoolName: "",
    adminPassword: ""
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [newTeacher, setNewTeacher] = useState({ name: "", surname: "", email: "" });
  const [status, setStatus] = useState("");

  useEffect(() => {
    const authed = sessionStorage.getItem("adminAuthed") === "true";
    if (!authed) {
      router.replace("/admin/login");
      return;
    }
    void loadData();
  }, [router]);

  async function loadData() {
    const [settingsRes, teachersRes] = await Promise.all([
      fetch("/api/settings"),
      fetch("/api/teachers")
    ]);
    const settingsData = await settingsRes.json();
    const teachersData = await teachersRes.json();
    setSettings(settingsData);
    setTeachers(teachersData);
  }

  async function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    if (response.ok) {
      setStatus("Ayarlar guncellendi.");
    } else {
      setStatus("Ayarlar guncellenemedi.");
    }
  }

  async function addTeacher(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const response = await fetch("/api/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTeacher)
    });
    if (response.ok) {
      setNewTeacher({ name: "", surname: "", email: "" });
      await loadData();
      setStatus("Ogretmen eklendi.");
    } else {
      setStatus("Ogretmen eklenemedi.");
    }
  }

  async function removeTeacher(id: string) {
    setStatus("");
    const response = await fetch(`/api/teachers?id=${id}`, { method: "DELETE" });
    if (response.ok) {
      await loadData();
      setStatus("Ogretmen silindi.");
    } else {
      setStatus("Ogretmen silinemedi.");
    }
  }

  return (
    <div className="grid">
      <div className="nav">
        <Link className="button secondary" href="/">
          Ana Sayfa
        </Link>
        <button
          className="button secondary"
          onClick={() => {
            sessionStorage.removeItem("adminAuthed");
            router.push("/admin/login");
          }}
        >
          Cikis Yap
        </button>
      </div>

      <div className="card">
        <h1>Admin Paneli</h1>
        <p className="small">Okul bilgilerini ve ogretmenleri buradan yonetebilirsiniz.</p>
        <form onSubmit={saveSettings}>
          <div className="field">
            <label>Okul Adi</label>
            <input
              className="input"
              value={settings.schoolName}
              onChange={(event) =>
                setSettings((prev) => ({ ...prev, schoolName: event.target.value }))
              }
              required
            />
          </div>
          <div className="field">
            <label>Admin Sifre</label>
            <input
              className="input"
              type="password"
              value={settings.adminPassword}
              onChange={(event) =>
                setSettings((prev) => ({ ...prev, adminPassword: event.target.value }))
              }
              required
            />
          </div>
          <button className="button" type="submit">
            Ayarlari Kaydet
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Ogretmen Ekle</h2>
        <form onSubmit={addTeacher}>
          <div className="grid two">
            <div className="field">
              <label>Ad</label>
              <input
                className="input"
                value={newTeacher.name}
                onChange={(event) =>
                  setNewTeacher((prev) => ({ ...prev, name: event.target.value }))
                }
                required
              />
            </div>
            <div className="field">
              <label>Soyad</label>
              <input
                className="input"
                value={newTeacher.surname}
                onChange={(event) =>
                  setNewTeacher((prev) => ({ ...prev, surname: event.target.value }))
                }
                required
              />
            </div>
          </div>
          <div className="field">
            <label>E-posta</label>
            <input
              className="input"
              type="email"
              value={newTeacher.email}
              onChange={(event) =>
                setNewTeacher((prev) => ({ ...prev, email: event.target.value }))
              }
              required
            />
          </div>
          <button className="button" type="submit">
            Ogretmen Ekle
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Ogretmen Listesi</h2>
        <div className="list">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="teacher-item">
              <div>
                <strong>
                  {teacher.name} {teacher.surname}
                </strong>
                <div className="small">{teacher.email}</div>
              </div>
              <button
                className="button danger"
                type="button"
                onClick={() => removeTeacher(teacher.id)}
              >
                Sil
              </button>
            </div>
          ))}
          {teachers.length === 0 ? <p className="small">Henuz ogretmen yok.</p> : null}
        </div>
        {status ? <p className="small">{status}</p> : null}
      </div>
    </div>
  );
}

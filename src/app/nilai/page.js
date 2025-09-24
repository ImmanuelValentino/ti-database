"use client";
import { useState, useEffect } from "react";

export default function NilaiPage() {
    const [nilaiList, setNilaiList] = useState([]);
    const [mataKuliah, setMataKuliah] = useState([]);
    const [mahasiswa, setMahasiswa] = useState([]);
    const [form, setForm] = useState({ nim: "", kode_mk: "", nilai: "" });

    // Ambil data nilai
    useEffect(() => {
        fetch("/api/nilai")
            .then((res) => res.json())
            .then((data) => setNilaiList(data));
    }, []);

    // Ambil daftar mata kuliah
    useEffect(() => {
        fetch("/api/mata_kuliah")
            .then((res) => res.json())
            .then((data) => setMataKuliah(data));
    }, []);

    // Ambil daftar mahasiswa
    useEffect(() => {
        fetch("/api/mahasiswa")
            .then((res) => res.json())
            .then((data) => setMahasiswa(data));
    }, []);

    const addNilai = async (e) => {
        e.preventDefault();

        // cari NIM dari nama yg diketik
        const selectedMahasiswa = mahasiswa.find(
            (m) => m.nama === form.nim || m.nim === form.nim
        );
        const selectedMK = mataKuliah.find(
            (mk) => mk.nama_mk === form.kode_mk || mk.kode_mk === form.kode_mk
        );

        const res = await fetch("/api/nilai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nim: selectedMahasiswa?.nim || form.nim,
                kode_mk: selectedMK?.kode_mk || form.kode_mk,
                nilai: form.nilai,
            }),
        });

        const newNilai = await res.json();
        setNilaiList([...nilaiList, newNilai]);
        setForm({ nim: "", kode_mk: "", nilai: "" });
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Input Nilai Mahasiswa</h1>

            <form onSubmit={addNilai} className="space-y-3 mb-6">
                {/* Input Mahasiswa dengan Autocomplete */}
                <input
                    list="mahasiswa-list"
                    placeholder="Ketik Nama / NIM Mahasiswa"
                    value={form.nim}
                    onChange={(e) => setForm({ ...form, nim: e.target.value })}
                    className="border p-2 w-full rounded"
                    required
                />
                <datalist id="mahasiswa-list">
                    {mahasiswa.map((mhs) => (
                        <option key={mhs.nim} value={mhs.nama}>
                            {mhs.nama} ({mhs.nim})
                        </option>
                    ))}
                </datalist>

                {/* Input Mata Kuliah dengan Autocomplete */}
                <input
                    list="mk-list"
                    placeholder="Ketik Nama / Kode Mata Kuliah"
                    value={form.kode_mk}
                    onChange={(e) => setForm({ ...form, kode_mk: e.target.value })}
                    className="border p-2 w-full rounded"
                    required
                />
                <datalist id="mk-list">
                    {mataKuliah.map((mk) => (
                        <option key={mk.kode_mk} value={mk.nama_mk}>
                            {mk.nama_mk} ({mk.kode_mk})
                        </option>
                    ))}
                </datalist>

                {/* Nilai */}
                <input
                    type="number"
                    placeholder="Nilai (0 - 100)"
                    value={form.nilai}
                    onChange={(e) => setForm({ ...form, nilai: e.target.value })}
                    className="border p-2 w-full rounded"
                    required
                />

                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    Tambah Nilai
                </button>
            </form>

            <h2 className="text-xl font-semibold mb-2">Daftar Nilai</h2>
            <ul className="space-y-2">
                {nilaiList.map((n) => (
                    <li key={n.id} className="border p-3 rounded">
                        {n.mahasiswa?.nama} ({n.nim}) - {n.mata_kuliah?.nama_mk} :{" "}
                        <b>{n.nilai}</b>
                    </li>
                ))}
            </ul>
        </div>
    );
}

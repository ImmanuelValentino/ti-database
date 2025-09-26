"use client";

import { useState, useEffect } from "react";

export default function NilaiPage() {
    const [nilai, setNilai] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/nilai");
                if (!res.ok) {
                    throw new Error("Gagal mengambil data dari server");
                }
                const data = await res.json();
                setNilai(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p className="text-center mt-8">Memuat data...</p>;
    }

    if (error) {
        return <p className="text-center mt-8 text-red-500">Error: {error}</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6">Data Nilai Mahasiswa</h1>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">NIM</th>
                            <th scope="col" className="px-6 py-3">Nama Mahasiswa</th>
                            <th scope="col" className="px-6 py-3">Mata Kuliah</th>
                            <th scope="col" className="px-6 py-3">Nilai</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nilai.map((item) => (
                            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {item.mahasiswa?.nim}
                                </td>
                                <td className="px-6 py-4">{item.mahasiswa?.nama}</td>
                                <td className="px-6 py-4">{item.mata_kuliah?.nama_mk}</td>
                                <td className="px-6 py-4 font-semibold">{item.nilai}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
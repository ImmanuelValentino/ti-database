"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [users, setUsers] = useState([]);

  // Ambil data saat pertama kali render
  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  // Tambah user baru
  const addUser = async () => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "User Baru",
        email: "userbaru@example.com",
      }),
    });
    const newUser = await res.json();
    setUsers(prev => [...prev, newUser]); // update state
  };

  return (
    <div className="p-4">
      <h1>Daftar Users</h1>
      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.name} ({u.email})
          </li>
        ))}
      </ul>
      <button onClick={addUser}>Tambah User</button>
    </div>
  );
}

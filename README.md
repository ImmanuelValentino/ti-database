# TI Database API

Sebuah API publik sederhana yang dibuat dengan Next.js dan Supabase untuk mengelola data akademik mahasiswa, mata kuliah, dan nilai. Proyek ini dilengkapi dengan validasi input, pagination, dan sistem API Key.

## Dokumentasi & Live Demo

Dokumentasi API interaktif tersedia dan dibuat menggunakan Swagger UI. Anda bisa melihat dan mencoba semua *endpoint* secara langsung di sini:

**[Lihat Dokumentasi API Langsung](https://ti-database.vercel.app/docs)**

---

## Fitur Utama
- **CRUD Penuh**: Operasi Create, Read, Update, Delete untuk *resource* `mahasiswa`.
- **Relasional**: Mengelola hubungan antara `mahasiswa`, `mata_kuliah`, dan `nilai`.
- **Pagination**: Endpoint `GET /api/mahasiswa` mendukung pagination dengan parameter `page` dan `limit`.
- **Pencarian Cerdas**: Endpoint `GET /api/mahasiswa` mendukung pencarian berdasarkan nama (teks) atau NIM (angka).
- **Validasi Input**: Setiap data yang masuk melalui `POST` atau `PUT` divalidasi menggunakan Zod.
- **Keamanan**: Dilengkapi dengan sistem API Key dan kebijakan Row Level Security (RLS) dasar di Supabase.

---

## Teknologi yang Digunakan
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Database**: [Supabase](https://supabase.io/) (PostgreSQL)
- **Validasi**: [Zod](https://zod.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## Menjalankan Proyek Secara Lokal

1.  **Clone repositori ini:**
    ```bash
    git clone [https://github.com/ImmanuelValentino/ti-database.git](https://github.com/ImmanuelValentino/ti-database.git)
    cd ti-database
    ```

2.  **Install dependensi:**
    ```bash
    npm install
    ```

3.  **Buat file `.env.local`**:
    Buat file `.env.local` di root folder dan isi dengan variabel dari proyek Supabase Anda.
    ```env
    NEXT_PUBLIC_SUPABASE_URL=URL_PROYEK_SUPABASE_ANDA
    NEXT_PUBLIC_SUPABASE_ANON_KEY=ANON_KEY_PROYEK_ANDA
    VALID_API_KEYS=KUNCI_API_KUSTOM_ANDA_1,KUNCI_API_KUSTOM_ANDA_2
    ```

4.  **Jalankan server pengembangan:**
    ```bash
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

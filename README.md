# 🎓 SIKAMPUS — Sistem Informasi Perkuliahan

Aplikasi database perkuliahan berbasis Node.js + Express + MongoDB Atlas.

## 📋 Fitur

- **CRUD Mahasiswa** — NIM, nama, jurusan, angkatan, IPK, status
- **CRUD Dosen** — NIP, nama, gelar, bidang keahlian, jabatan
- **CRUD Mata Kuliah** — Kode, nama, SKS, semester, dosen pengampu
- **CRUD KRS** — Kartu Rencana Studi mahasiswa dengan nilai
- **Dashboard** — Statistik & ringkasan data
- **Filter & Pencarian** — Search dan filter data tabel

## 🚀 Cara Menjalankan

### 1. Install dependencies

```bash
cd kampus-app
npm install
```

### 2. Jalankan server

```bash
npm start
```

### 3. Buka browser

```
http://localhost:3000
```

## 🗄️ Database

MongoDB Atlas: `mongodb+srv://admin:gokil127b@kadek.csskltt.mongodb.net/kampus_db`

### Collections:
- `mahasiswas` — Data mahasiswa
- `dosens` — Data dosen
- `matakuliahs` — Data mata kuliah
- `krs` — Kartu rencana studi

## 🔌 API Endpoints

### Mahasiswa
| Method | URL | Deskripsi |
|--------|-----|-----------|
| GET | /api/mahasiswa | Ambil semua mahasiswa |
| GET | /api/mahasiswa/:id | Ambil 1 mahasiswa |
| POST | /api/mahasiswa | Tambah mahasiswa |
| PUT | /api/mahasiswa/:id | Update mahasiswa |
| DELETE | /api/mahasiswa/:id | Hapus mahasiswa |

### Dosen
| Method | URL | Deskripsi |
|--------|-----|-----------|
| GET | /api/dosen | Ambil semua dosen |
| POST | /api/dosen | Tambah dosen |
| PUT | /api/dosen/:id | Update dosen |
| DELETE | /api/dosen/:id | Hapus dosen |

### Mata Kuliah
| Method | URL | Deskripsi |
|--------|-----|-----------|
| GET | /api/mata-kuliah | Ambil semua mata kuliah |
| POST | /api/mata-kuliah | Tambah mata kuliah |
| PUT | /api/mata-kuliah/:id | Update mata kuliah |
| DELETE | /api/mata-kuliah/:id | Hapus mata kuliah |

### KRS
| Method | URL | Deskripsi |
|--------|-----|-----------|
| GET | /api/krs | Ambil semua KRS |
| POST | /api/krs | Tambah KRS |
| PUT | /api/krs/:id | Update KRS |
| DELETE | /api/krs/:id | Hapus KRS |

### Statistik
| Method | URL | Deskripsi |
|--------|-----|-----------|
| GET | /api/stats | Statistik total data |
| GET | /api/status | Status koneksi DB |

## 🛠️ Teknologi

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas + Mongoose
- **Frontend**: HTML, CSS, JavaScript (Vanilla)

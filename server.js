const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
const MONGO_URI = 'mongodb://admin:gokil127b@ac-c4ogjzu-shard-00-00.csskltt.mongodb.net:27017,ac-c4ogjzu-shard-00-01.csskltt.mongodb.net:27017,ac-c4ogjzu-shard-00-02.csskltt.mongodb.net:27017/kampus_db?ssl=true&replicaSet=atlas-mn6spq-shard-0&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,
})
  .then(() => console.log('✅ Terhubung ke MongoDB Atlas'))
  .catch(err => console.error('❌ Gagal koneksi MongoDB:', err.message));
  
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ========================
// MODELS
// ========================

// Model Mahasiswa
const mahasiswaSchema = new mongoose.Schema({
  nim: { type: String, required: true, unique: true },
  nama: { type: String, required: true },
  jurusan: { type: String, required: true },
  angkatan: { type: Number, required: true },
  email: { type: String, required: true },
  ipk: { type: Number, default: 0, min: 0, max: 4 },
  status: { type: String, enum: ['Aktif', 'Cuti', 'Lulus', 'DO'], default: 'Aktif' }
}, { timestamps: true });

// Model Dosen
const dosenSchema = new mongoose.Schema({
  nip: { type: String, required: true, unique: true },
  nama: { type: String, required: true },
  bidang_keahlian: { type: String, required: true },
  email: { type: String, required: true },
  jabatan: { type: String, enum: ['Asisten Ahli', 'Lektor', 'Lektor Kepala', 'Guru Besar'], default: 'Asisten Ahli' },
  gelar: { type: String, required: true }
}, { timestamps: true });

// Model Mata Kuliah
const mataKuliahSchema = new mongoose.Schema({
  kode: { type: String, required: true, unique: true },
  nama: { type: String, required: true },
  sks: { type: Number, required: true, min: 1, max: 6 },
  semester: { type: Number, required: true, min: 1, max: 8 },
  jurusan: { type: String, required: true },
  dosen_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Dosen' },
  deskripsi: { type: String }
}, { timestamps: true });

// Model KRS (Kartu Rencana Studi)
const krsSchema = new mongoose.Schema({
  mahasiswa_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Mahasiswa', required: true },
  mata_kuliah_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MataKuliah', required: true },
  semester: { type: String, required: true },
  nilai: { type: String, enum: ['A', 'B+', 'B', 'C+', 'C', 'D', 'E', '-'], default: '-' },
  tahun_akademik: { type: String, required: true }
}, { timestamps: true });

const Mahasiswa = mongoose.model('Mahasiswa', mahasiswaSchema);
const Dosen = mongoose.model('Dosen', dosenSchema);
const MataKuliah = mongoose.model('MataKuliah', mataKuliahSchema);
const KRS = mongoose.model('KRS', krsSchema);

// ========================
// API ROUTES - MAHASISWA
// ========================
const mahasiswaRouter = express.Router();

mahasiswaRouter.get('/', async (req, res) => {
  try {
    const { search, jurusan, status } = req.query;
    let filter = {};
    if (search) filter.$or = [{ nama: new RegExp(search, 'i') }, { nim: new RegExp(search, 'i') }];
    if (jurusan) filter.jurusan = jurusan;
    if (status) filter.status = status;
    const data = await Mahasiswa.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data, total: data.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

mahasiswaRouter.get('/:id', async (req, res) => {
  try {
    const data = await Mahasiswa.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Mahasiswa tidak ditemukan' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

mahasiswaRouter.post('/', async (req, res) => {
  try {
    const data = new Mahasiswa(req.body);
    await data.save();
    res.status(201).json({ success: true, data, message: 'Mahasiswa berhasil ditambahkan' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

mahasiswaRouter.put('/:id', async (req, res) => {
  try {
    const data = await Mahasiswa.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Mahasiswa tidak ditemukan' });
    res.json({ success: true, data, message: 'Data mahasiswa berhasil diperbarui' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

mahasiswaRouter.delete('/:id', async (req, res) => {
  try {
    const data = await Mahasiswa.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Mahasiswa tidak ditemukan' });
    res.json({ success: true, message: 'Mahasiswa berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ========================
// API ROUTES - DOSEN
// ========================
const dosenRouter = express.Router();

dosenRouter.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) filter.$or = [{ nama: new RegExp(search, 'i') }, { nip: new RegExp(search, 'i') }];
    const data = await Dosen.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data, total: data.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

dosenRouter.get('/:id', async (req, res) => {
  try {
    const data = await Dosen.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Dosen tidak ditemukan' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

dosenRouter.post('/', async (req, res) => {
  try {
    const data = new Dosen(req.body);
    await data.save();
    res.status(201).json({ success: true, data, message: 'Dosen berhasil ditambahkan' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

dosenRouter.put('/:id', async (req, res) => {
  try {
    const data = await Dosen.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Dosen tidak ditemukan' });
    res.json({ success: true, data, message: 'Data dosen berhasil diperbarui' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

dosenRouter.delete('/:id', async (req, res) => {
  try {
    const data = await Dosen.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Dosen tidak ditemukan' });
    res.json({ success: true, message: 'Dosen berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ========================
// API ROUTES - MATA KULIAH
// ========================
const mataKuliahRouter = express.Router();

mataKuliahRouter.get('/', async (req, res) => {
  try {
    const { search, jurusan, semester } = req.query;
    let filter = {};
    if (search) filter.$or = [{ nama: new RegExp(search, 'i') }, { kode: new RegExp(search, 'i') }];
    if (jurusan) filter.jurusan = jurusan;
    if (semester) filter.semester = parseInt(semester);
    const data = await MataKuliah.find(filter).populate('dosen_id', 'nama gelar').sort({ semester: 1 });
    res.json({ success: true, data, total: data.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

mataKuliahRouter.get('/:id', async (req, res) => {
  try {
    const data = await MataKuliah.findById(req.params.id).populate('dosen_id', 'nama gelar nip');
    if (!data) return res.status(404).json({ success: false, message: 'Mata kuliah tidak ditemukan' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

mataKuliahRouter.post('/', async (req, res) => {
  try {
    const data = new MataKuliah(req.body);
    await data.save();
    res.status(201).json({ success: true, data, message: 'Mata kuliah berhasil ditambahkan' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

mataKuliahRouter.put('/:id', async (req, res) => {
  try {
    const data = await MataKuliah.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Mata kuliah tidak ditemukan' });
    res.json({ success: true, data, message: 'Mata kuliah berhasil diperbarui' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

mataKuliahRouter.delete('/:id', async (req, res) => {
  try {
    const data = await MataKuliah.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Mata kuliah tidak ditemukan' });
    res.json({ success: true, message: 'Mata kuliah berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ========================
// API ROUTES - KRS
// ========================
const krsRouter = express.Router();

krsRouter.get('/', async (req, res) => {
  try {
    const { mahasiswa_id, tahun_akademik } = req.query;
    let filter = {};
    if (mahasiswa_id) filter.mahasiswa_id = mahasiswa_id;
    if (tahun_akademik) filter.tahun_akademik = tahun_akademik;
    const data = await KRS.find(filter)
      .populate('mahasiswa_id', 'nama nim')
      .populate('mata_kuliah_id', 'nama kode sks')
      .sort({ createdAt: -1 });
    res.json({ success: true, data, total: data.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

krsRouter.post('/', async (req, res) => {
  try {
    const data = new KRS(req.body);
    await data.save();
    res.status(201).json({ success: true, data, message: 'KRS berhasil ditambahkan' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

krsRouter.put('/:id', async (req, res) => {
  try {
    const data = await KRS.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'KRS tidak ditemukan' });
    res.json({ success: true, data, message: 'KRS berhasil diperbarui' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

krsRouter.delete('/:id', async (req, res) => {
  try {
    const data = await KRS.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'KRS tidak ditemukan' });
    res.json({ success: true, message: 'KRS berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ========================
// STATS ROUTE
// ========================
app.get('/api/stats', async (req, res) => {
  try {
    const [totalMahasiswa, totalDosen, totalMatkul, totalKRS] = await Promise.all([
      Mahasiswa.countDocuments(),
      Dosen.countDocuments(),
      MataKuliah.countDocuments(),
      KRS.countDocuments()
    ]);
    const mahasiswaAktif = await Mahasiswa.countDocuments({ status: 'Aktif' });
    res.json({ success: true, data: { totalMahasiswa, totalDosen, totalMatkul, totalKRS, mahasiswaAktif } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Register Routes
app.use('/api/mahasiswa', mahasiswaRouter);
app.use('/api/dosen', dosenRouter);
app.use('/api/mata-kuliah', mataKuliahRouter);
app.use('/api/krs', krsRouter);

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API Kampus berjalan',
    db_status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Catch-all untuk SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});

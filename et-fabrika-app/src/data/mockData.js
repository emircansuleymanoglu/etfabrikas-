// ─── MOCK DATA ───────────────────────────────────────────────────
export const EQUIPMENT_TYPES = {
  // İş ekipmanları
  bicak:    { label: 'Bıçak',            category: 'is',  icon: '🔪', color: '#E74C3C' },
  masat:    { label: 'Masat',            category: 'is',  icon: '🗡️', color: '#E67E22' },
  ayakkabi: { label: 'İş Ayakkabısı',   category: 'is',  icon: '👢', color: '#E67E22' },
  // Ev ekipmanları
  yatak:    { label: 'Yatak',            category: 'ev',  icon: '🛏️', color: '#3498DB' },
  dolap:    { label: 'Dolap',            category: 'ev',  icon: '🗄️', color: '#3498DB' },
  dosek:    { label: 'Döşek',            category: 'ev',  icon: '🛋️', color: '#9B59B6' },
  buzdolabi:{ label: 'Küçük Buzdolabı', category: 'ev',  icon: '❄️', color: '#1ABC9C' },
}

export const ROOMS = [
  { id: 'R101', address: 'Organize Sanayi, Blok A', no: '101', capacity: 4 },
  { id: 'R102', address: 'Organize Sanayi, Blok A', no: '102', capacity: 4 },
  { id: 'R103', address: 'Organize Sanayi, Blok A', no: '103', capacity: 2 },
  { id: 'R201', address: 'Organize Sanayi, Blok B', no: '201', capacity: 4 },
  { id: 'R202', address: 'Organize Sanayi, Blok B', no: '202', capacity: 4 },
  { id: 'R32',  address: 'Çalışan Konutları, X Binası', no: '32', capacity: 2 },
  { id: 'R33',  address: 'Çalışan Konutları, X Binası', no: '33', capacity: 2 },
]

export const initialEmployees = [
  {
    id: 'EMP001', ad: 'Mehmet Yılmaz', tc: '12345678901',
    telefon: '0532 111 2233', baslangic: '2024-01-15',
    durum: 'aktif', oda: 'R32',
    zimmet: {
      bicak:     { var: true,  imzali: true,  odemeKesik: true,  tarih: '2024-01-16' },
      masat:     { var: true,  imzali: true,  odemeKesik: false, tarih: '2024-01-16' },
      ayakkabi:  { var: true,  imzali: true,  odemeKesik: true,  tarih: '2024-01-16' },
      yatak:     { var: true,  imzali: true,  odemeKesik: false, tarih: '2024-01-16' },
      dolap:     { var: true,  imzali: true,  odemeKesik: false, tarih: '2024-01-16' },
      dosek:     { var: true,  imzali: true,  odemeKesik: false, tarih: '2024-01-16' },
      buzdolabi: { var: false, imzali: false, odemeKesik: false, tarih: null },
    }
  },
  {
    id: 'EMP002', ad: 'Ahmet Kaya', tc: '98765432109',
    telefon: '0533 444 5566', baslangic: '2024-03-01',
    durum: 'aktif', oda: 'R32',
    zimmet: {
      bicak:     { var: true,  imzali: true,  odemeKesik: true,  tarih: '2024-03-02' },
      masat:     { var: true,  imzali: false, odemeKesik: false, tarih: '2024-03-02' },
      ayakkabi:  { var: false, imzali: false, odemeKesik: false, tarih: null },
      yatak:     { var: true,  imzali: true,  odemeKesik: false, tarih: '2024-03-02' },
      dolap:     { var: true,  imzali: true,  odemeKesik: false, tarih: '2024-03-02' },
      dosek:     { var: false, imzali: false, odemeKesik: false, tarih: null },
      buzdolabi: { var: false, imzali: false, odemeKesik: false, tarih: null },
    }
  },
  {
    id: 'EMP003', ad: 'Fatih Demir', tc: '11223344556',
    telefon: '0545 777 8899', baslangic: '2023-08-10',
    durum: 'aktif', oda: 'R101',
    zimmet: {
      bicak:     { var: true,  imzali: true,  odemeKesik: true,  tarih: '2023-08-11' },
      masat:     { var: true,  imzali: true,  odemeKesik: true,  tarih: '2023-08-11' },
      ayakkabi:  { var: true,  imzali: true,  odemeKesik: true,  tarih: '2023-08-11' },
      yatak:     { var: true,  imzali: true,  odemeKesik: false, tarih: '2023-08-11' },
      dolap:     { var: true,  imzali: true,  odemeKesik: false, tarih: '2023-08-11' },
      dosek:     { var: true,  imzali: true,  odemeKesik: false, tarih: '2023-08-11' },
      buzdolabi: { var: true,  imzali: true,  odemeKesik: false, tarih: '2023-08-11' },
    }
  },
  {
    id: 'EMP004', ad: 'Ali Çelik', tc: '55667788990',
    telefon: '0546 222 3344', baslangic: '2024-06-20',
    durum: 'cikti', oda: null,
    zimmet: {
      bicak:     { var: true,  imzali: true,  odemeKesik: true,  tarih: '2024-06-21', iadeGerekli: true },
      masat:     { var: true,  imzali: true,  odemeKesik: true,  tarih: '2024-06-21', iadeGerekli: true },
      ayakkabi:  { var: true,  imzali: true,  odemeKesik: true,  tarih: '2024-06-21', iadeGerekli: false },
      yatak:     { var: true,  imzali: true,  odemeKesik: false, tarih: '2024-06-21', iadeGerekli: true },
      dolap:     { var: true,  imzali: true,  odemeKesik: false, tarih: '2024-06-21', iadeGerekli: true },
      dosek:     { var: true,  imzali: true,  odemeKesik: false, tarih: '2024-06-21', iadeGerekli: true },
      buzdolabi: { var: false, imzali: false, odemeKesik: false, tarih: null, iadeGerekli: false },
    }
  },
  {
    id: 'EMP005', ad: 'Hasan Şahin', tc: '33445566778',
    telefon: '0537 000 1122', baslangic: '2025-01-10',
    durum: 'aktif', oda: 'R201',
    zimmet: {
      bicak:     { var: false, imzali: false, odemeKesik: false, tarih: null },
      masat:     { var: false, imzali: false, odemeKesik: false, tarih: null },
      ayakkabi:  { var: false, imzali: false, odemeKesik: false, tarih: null },
      yatak:     { var: true,  imzali: true,  odemeKesik: false, tarih: '2025-01-10' },
      dolap:     { var: true,  imzali: false, odemeKesik: false, tarih: '2025-01-10' },
      dosek:     { var: false, imzali: false, odemeKesik: false, tarih: null },
      buzdolabi: { var: false, imzali: false, odemeKesik: false, tarih: null },
    }
  },
]

// Stok sayıları (toplam envanter)
export const STOK = {
  bicak:     { toplam: 12 },
  masat:     { toplam: 10 },
  ayakkabi:  { toplam: 15 },
  yatak:     { toplam: 20 },
  dolap:     { toplam: 18 },
  dosek:     { toplam: 20 },
  buzdolabi: { toplam: 8  },
}

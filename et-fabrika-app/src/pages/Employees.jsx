import React, { useState } from 'react'
import { EQUIPMENT_TYPES, ROOMS } from '../data/mockData.js'

/* ── Toggle component ──────────────────────────────────────────── */
function Toggle({ label, checked, onChange, disabled }) {
  return (
    <div className={`toggle-wrap${disabled ? ' disabled' : ''}`} onClick={() => !disabled && onChange(!checked)}>
      <div className={`toggle-track${checked ? ' on' : ''}`}>
        <div className="toggle-thumb" />
      </div>
      <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-condensed)', letterSpacing: 0.3 }}>{label}</span>
    </div>
  )
}

/* ── Employee detail modal ─────────────────────────────────────── */
function EmployeeDetail({ emp, updateZimmet, onTerminate, onClose }) {
  const [tab, setTab] = useState('is')
  const oda = ROOMS.find(r => r.id === emp.oda)
  const cats = tab === 'is' ? ['bicak', 'masat', 'ayakkabi'] : ['yatak', 'dolap', 'dosek', 'buzdolabi']

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
        {/* Modal header */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 22 }}>
          <div className="avatar avatar-lg">{emp.ad.charAt(0)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: 1 }}>{emp.ad.toUpperCase()}</h2>
              <span className={`badge ${emp.durum === 'aktif' ? 'badge-green' : 'badge-red'}`}>
                {emp.durum === 'aktif' ? 'Aktif' : 'İşten Ayrıldı'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 5, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span>{emp.id}</span>
              <span>TC: {emp.tc}</span>
              <span>{emp.telefon}</span>
              {oda && <span>Oda: {oda.address} No:{oda.no}</span>}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>Başlangıç: {emp.baslangic}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            {emp.durum === 'aktif' && (
              <button className="btn btn-danger" onClick={() => {
                if (window.confirm('Bu çalışanı işten çıkarmak istediğinizden emin misiniz?')) {
                  onTerminate(emp.id); onClose()
                }
              }}>İşten Çıkar</button>
            )}
            <button className="btn btn-ghost" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs" style={{ marginBottom: 16 }}>
          <button className={`tab-btn ${tab === 'is' ? 'active' : ''}`} onClick={() => setTab('is')}>🔪 İş Ekipmanları</button>
          <button className={`tab-btn ${tab === 'ev' ? 'active' : ''}`} onClick={() => setTab('ev')}>🛏️ Ev Ekipmanları</button>
        </div>

        {/* Zimmet list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {cats.map(key => {
            const type = EQUIPMENT_TYPES[key]
            const z = emp.zimmet[key]
            const statusColor = z.var && z.imzali ? 'var(--green)' : z.var ? 'var(--amber-400)' : 'var(--surface-4)'
            return (
              <div key={key} className="card-inset" style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: z.var ? 12 : 0 }}>
                  <span style={{ fontSize: 24, opacity: z.var ? 1 : 0.3 }}>{type.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{type.label}</div>
                    {z.tarih && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Teslim: {z.tarih}</div>}
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor }} />
                </div>
                {z.var && (
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', paddingLeft: 36 }}>
                    <Toggle label="Teslim Edildi" checked={z.var} onChange={v => updateZimmet(emp.id, key, 'var', v)} />
                    <Toggle label="İmzalı Onay" checked={z.imzali} onChange={v => updateZimmet(emp.id, key, 'imzali', v)} disabled={!z.var} />
                    <Toggle label="Öd. Kesiliyor" checked={z.odemeKesik} onChange={v => updateZimmet(emp.id, key, 'odemeKesik', v)} disabled={!z.var} />
                  </div>
                )}
                {!z.var && (
                  <div style={{ paddingLeft: 36 }}>
                    <button className="btn btn-ghost" style={{ height: 30, fontSize: 11 }}
                      onClick={() => updateZimmet(emp.id, key, 'var', true)}>
                      + Teslim Et
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ── Add employee modal ────────────────────────────────────────── */
function AddModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ ad: '', tc: '', telefon: '', baslangic: new Date().toISOString().split('T')[0], oda: '' })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 1, marginBottom: 20 }}>YENİ ÇALIŞAN</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          <div className="field">
            <label>Ad Soyad *</label>
            <input className="input" value={form.ad} onChange={e => set('ad', e.target.value)} placeholder="Mehmet Yılmaz" />
          </div>
          <div className="field">
            <label>TC Kimlik No *</label>
            <input className="input" value={form.tc} onChange={e => set('tc', e.target.value)} placeholder="12345678901" maxLength={11} />
          </div>
          <div className="field">
            <label>Telefon</label>
            <input className="input" value={form.telefon} onChange={e => set('telefon', e.target.value)} placeholder="0532 000 0000" />
          </div>
          <div className="field">
            <label>İşe Başlangıç</label>
            <input className="input" type="date" value={form.baslangic} onChange={e => set('baslangic', e.target.value)} />
          </div>
          <div className="field">
            <label>Oda</label>
            <select className="select" value={form.oda} onChange={e => set('oda', e.target.value)}>
              <option value="">— Oda Seçin —</option>
              {ROOMS.map(r => <option key={r.id} value={r.id}>{r.address} / No: {r.no}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { if (!form.ad || !form.tc) return; onAdd(form); onClose() }}>Kaydet</button>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>İptal</button>
        </div>
      </div>
    </div>
  )
}

/* ── Main Employees page ───────────────────────────────────────── */
export default function Employees({ employees, updateZimmet, terminateEmployee, addEmployee }) {
  const [detail, setDetail] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('hepsi')

  const filtered = employees.filter(e => {
    const q = search.toLowerCase()
    const matchS = !q || e.ad.toLowerCase().includes(q) || e.tc.includes(q) || e.id.toLowerCase().includes(q)
    const matchF = filter === 'hepsi' || e.durum === filter
    return matchS && matchF
  })

  return (
    <div className="animate-in page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <div className="label-upper" style={{ marginBottom: 6 }}>Personel Yönetimi</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: 1.5, lineHeight: 1 }}>ÇALIŞANLAR</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Yeni Çalışan</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <input className="input" style={{ maxWidth: 280 }} value={search}
          onChange={e => setSearch(e.target.value)} placeholder="İsim, TC veya ID ara..." />
        <div style={{ display: 'flex', gap: 6 }}>
          {['hepsi', 'aktif', 'cikti'].map(f => (
            <button key={f} className={`btn btn-ghost ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}>
              {{ hepsi: 'Tümü', aktif: 'Aktif', cikti: 'Ayrılanlar' }[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="table-outer">
        {/* Head */}
        <div className="scroll-x">
        <div style={{ minWidth: 520 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '44px 1fr 120px 110px 110px 40px',
            gap: 0, padding: '10px 20px', background: 'var(--surface-2)',
          }}>
            {['#', 'ÇALIŞAN', 'ODA', 'BAŞLANGIÇ', 'DURUM', ''].map(h => (
              <div key={h} className="label-upper" style={{ fontSize: 9 }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((e, i) => {
            const oda = ROOMS.find(r => r.id === e.oda)
            const bekleyen = Object.values(e.zimmet).filter(z => z.var && !z.imzali).length
            return (
              <div key={e.id} className="table-row" style={{
                display: 'grid', gridTemplateColumns: '44px 1fr 120px 110px 110px 40px',
                gap: 0, padding: '14px 20px', alignItems: 'center',
              }} onClick={() => setDetail(e)}>
                <span style={{ fontFamily: 'var(--font-condensed)', fontSize: 12, color: 'var(--text-muted)' }}>{i + 1}</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="avatar avatar-sm">{e.ad.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{e.ad}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{e.id}</div>
                  </div>
                  {bekleyen > 0 && (
                    <span className="badge badge-amber" style={{ fontSize: 9 }}>{bekleyen} İmza</span>
                  )}
                </div>

                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{oda ? `No:${oda.no}` : '—'}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e.baslangic}</span>
                <span className={`badge ${e.durum === 'aktif' ? 'badge-green' : 'badge-red'}`}>
                  {e.durum === 'aktif' ? 'Aktif' : 'Ayrıldı'}
                </span>
                <span style={{ color: 'var(--text-muted)', textAlign: 'right' }}>›</span>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-condensed)', letterSpacing: 1 }}>
              SONUÇ BULUNAMADI
            </div>
          )}
        </div>
        </div>
      </div>

      {showAdd && <AddModal onAdd={addEmployee} onClose={() => setShowAdd(false)} />}
      {detail && (
        <EmployeeDetail
          emp={employees.find(e => e.id === detail.id) || detail}
          updateZimmet={updateZimmet}
          onTerminate={terminateEmployee}
          onClose={() => setDetail(null)}
        />
      )}
    </div>
  )
}

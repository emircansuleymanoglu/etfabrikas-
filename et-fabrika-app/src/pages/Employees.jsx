import React, { useState } from 'react'
import { EQUIPMENT_TYPES, ROOMS } from '../data/mockData.js'

function Toggle({ label, checked, onChange, disabled }) {
  return (
    <div className={`toggle-wrap${disabled ? ' disabled' : ''}`} onClick={() => !disabled && onChange(!checked)}>
      <div className={`toggle-track${checked ? ' on' : ''}`}>
        <div className="toggle-thumb" />
      </div>
      <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{label}</span>
    </div>
  )
}

function EmployeeDetail({ emp, updateZimmet, onTerminate, onClose }) {
  const [tab, setTab] = useState('is')
  const oda = ROOMS.find(r => r.id === emp.oda)
  const cats = tab === 'is' ? ['bicak', 'masat', 'ayakkabi'] : ['yatak', 'dolap', 'dosek', 'buzdolabi']

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>

        {/* ── Header — always visible at top ── */}
        <div style={{
          display: 'flex', gap: 12, alignItems: 'flex-start',
          marginBottom: 18, paddingBottom: 18,
          borderBottom: '1px solid var(--border)',
        }}>
          <div className="avatar avatar-lg">{emp.ad.charAt(0)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>{emp.ad}</h2>
              <span className={`badge ${emp.durum === 'aktif' ? 'badge-green' : 'badge-red'}`}>
                {emp.durum === 'aktif' ? 'Aktif' : 'İşten Ayrıldı'}
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 14px', fontSize: 12, color: 'var(--text-3)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{emp.id}</span>
              <span>TC: {emp.tc}</span>
              <span>{emp.telefon}</span>
              {oda && <span>{oda.address} No:{oda.no}</span>}
              <span>Başlangıç: {emp.baslangic}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {emp.durum === 'aktif' && (
              <button className="btn btn-danger" style={{ fontSize: 12 }} onClick={() => {
                if (window.confirm('Bu çalışanı işten çıkarmak istediğinizden emin misiniz?')) {
                  onTerminate(emp.id); onClose()
                }
              }}>İşten Çıkar</button>
            )}
            <button className="btn btn-ghost" style={{ padding: '0 10px' }} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="tabs" style={{ marginBottom: 14 }}>
          <button className={`tab-btn${tab === 'is' ? ' active' : ''}`} onClick={() => setTab('is')}>🔪 İş Ekipmanları</button>
          <button className={`tab-btn${tab === 'ev' ? ' active' : ''}`} onClick={() => setTab('ev')}>🛏️ Ev Ekipmanları</button>
        </div>

        {/* ── Zimmet items ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {cats.map(key => {
            const type = EQUIPMENT_TYPES[key]
            const z = emp.zimmet[key]
            const dot = z.var && z.imzali ? 'var(--green)' : z.var ? 'var(--amber)' : 'var(--border-mid)'
            return (
              <div key={key} className="card-flat" style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: z.var ? 10 : 0 }}>
                  <span style={{ fontSize: 22, opacity: z.var ? 1 : 0.3 }}>{type.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{type.label}</div>
                    {z.tarih && <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Teslim: {z.tarih}</div>}
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: dot, flexShrink: 0 }} />
                </div>
                {z.var ? (
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', paddingLeft: 32 }}>
                    <Toggle label="Teslim Edildi" checked={z.var}       onChange={v => updateZimmet(emp.id, key, 'var', v)} />
                    <Toggle label="İmzalı Onay"   checked={z.imzali}    onChange={v => updateZimmet(emp.id, key, 'imzali', v)} disabled={!z.var} />
                    <Toggle label="Öd. Kesiliyor" checked={z.odemeKesik} onChange={v => updateZimmet(emp.id, key, 'odemeKesik', v)} disabled={!z.var} />
                  </div>
                ) : (
                  <div style={{ paddingLeft: 32 }}>
                    <button className="btn btn-ghost" style={{ height: 28, fontSize: 12 }}
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

function AddModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ ad: '', tc: '', telefon: '', baslangic: new Date().toISOString().split('T')[0], oda: '' })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3, marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
          Yeni Çalışan Ekle
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
          <div className="field"><label>Ad Soyad *</label><input className="input" value={form.ad} onChange={e => set('ad', e.target.value)} placeholder="Mehmet Yılmaz" /></div>
          <div className="field"><label>TC Kimlik No *</label><input className="input" value={form.tc} onChange={e => set('tc', e.target.value)} placeholder="12345678901" maxLength={11} /></div>
          <div className="field"><label>Telefon</label><input className="input" value={form.telefon} onChange={e => set('telefon', e.target.value)} placeholder="0532 000 0000" /></div>
          <div className="field"><label>İşe Başlangıç</label><input className="input" type="date" value={form.baslangic} onChange={e => set('baslangic', e.target.value)} /></div>
          <div className="field">
            <label>Oda</label>
            <select className="select" value={form.oda} onChange={e => set('oda', e.target.value)}>
              <option value="">— Seçiniz —</option>
              {ROOMS.map(r => <option key={r.id} value={r.id}>{r.address} / No: {r.no}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { if (!form.ad || !form.tc) return; onAdd(form); onClose() }}>Kaydet</button>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>İptal</button>
        </div>
      </div>
    </div>
  )
}

export default function Employees({ employees, updateZimmet, terminateEmployee, addEmployee }) {
  const [detail, setDetail] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('hepsi')

  const filtered = employees.filter(e => {
    const q = search.toLowerCase()
    return (!q || e.ad.toLowerCase().includes(q) || e.tc.includes(q) || e.id.toLowerCase().includes(q))
      && (filter === 'hepsi' || e.durum === filter)
  })

  return (
    <div className="animate-in page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500, marginBottom: 4 }}>Personel Yönetimi</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>Çalışanlar</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Yeni Çalışan</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <input className="input" style={{ maxWidth: 260, flex: '1 1 200px' }} value={search}
          onChange={e => setSearch(e.target.value)} placeholder="İsim, TC veya ID ara..." />
        <div style={{ display: 'flex', gap: 6 }}>
          {['hepsi', 'aktif', 'cikti'].map(f => (
            <button key={f} className={`btn btn-ghost${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
              {{ hepsi: 'Tümü', aktif: 'Aktif', cikti: 'Ayrılanlar' }[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="table-outer">
        <div className="scroll-x">
          <div style={{ minWidth: 500 }}>
            <div className="table-head" style={{
              display: 'grid', gridTemplateColumns: '40px 1fr 110px 110px 100px 36px',
              padding: '9px 18px',
            }}>
              {['#','Çalışan','Oda','Başlangıç','Durum',''].map(h => (
                <div key={h} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)' }}>{h}</div>
              ))}
            </div>
            {filtered.map((e, i) => {
              const oda = ROOMS.find(r => r.id === e.oda)
              const bekl = Object.values(e.zimmet).filter(z => z.var && !z.imzali).length
              return (
                <div key={e.id} className="table-row" style={{
                  display: 'grid', gridTemplateColumns: '40px 1fr 110px 110px 100px 36px',
                  padding: '12px 18px', alignItems: 'center',
                }} onClick={() => setDetail(e)}>
                  <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>{i + 1}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar avatar-sm">{e.ad.charAt(0)}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{e.ad}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{e.id}</div>
                    </div>
                    {bekl > 0 && <span className="badge badge-amber" style={{ fontSize: 10 }}>{bekl} imza</span>}
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{oda ? `No:${oda.no}` : '—'}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{e.baslangic}</span>
                  <span className={`badge ${e.durum === 'aktif' ? 'badge-green' : 'badge-red'}`}>
                    {e.durum === 'aktif' ? 'Aktif' : 'Ayrıldı'}
                  </span>
                  <span style={{ color: 'var(--text-3)', textAlign: 'right', fontSize: 16 }}>›</span>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>Sonuç bulunamadı</div>
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

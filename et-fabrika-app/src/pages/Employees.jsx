import React, { useState } from 'react'
import { EQUIPMENT_TYPES, ROOMS } from '../data/mockData.js'

function StatusBadge({ durum }) {
  const cfg = durum === 'aktif'
    ? { bg: 'rgba(39,174,96,0.15)', color: 'var(--green2)', label: 'Aktif' }
    : { bg: 'rgba(192,57,43,0.15)', color: 'var(--red2)', label: 'İşten Ayrıldı' }
  return (
    <span style={{ background: cfg.bg, color: cfg.color, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>
      {cfg.label}
    </span>
  )
}

function ZimmetBadge({ z, tip }) {
  if (!z.var) return <span style={{ color: 'var(--text3)', fontSize: 12 }}>—</span>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 12, color: z.imzali ? 'var(--green2)' : 'var(--amber2)' }}>
        {z.imzali ? '✓ İmzalı' : '⏳ İmza Bekl.'}
      </span>
      <span style={{ fontSize: 11, color: z.odemeKesik ? 'var(--green2)' : 'var(--text3)' }}>
        {z.odemeKesik ? 'Öd. Kesiliyor' : 'Öd. Kesilmedi'}
      </span>
      {z.iadeGerekli && <span style={{ fontSize: 11, color: 'var(--amber2)' }}>↩ İade Gerekli</span>}
    </div>
  )
}

function EmployeeDetail({ emp, onUpdate, onTerminate, onClose, updateZimmet }) {
  const [tab, setTab] = useState('is')
  const oda = ROOMS.find(r => r.id === emp.oda)

  const cats = tab === 'is' ? ['bicak', 'masat', 'ayakkabi'] : ['yatak', 'dolap', 'dosek', 'buzdolabi']

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 14, width: '100%', maxWidth: 700, maxHeight: '90vh',
        overflow: 'auto', padding: '28px 32px', position: 'relative'
      }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, background: 'var(--bg3)',
          border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text2)',
          padding: '4px 10px', fontSize: 13
        }}>✕</button>

        {/* Header */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 24 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%', background: 'var(--red)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Syne', fontWeight: 800, fontSize: 20
          }}>{emp.ad.charAt(0)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>{emp.ad}</h2>
              <StatusBadge durum={emp.durum} />
            </div>
            <div style={{ color: 'var(--text2)', fontSize: 12, marginTop: 4 }}>
              {emp.id} · TC: {emp.tc} · {emp.telefon}
            </div>
            <div style={{ color: 'var(--text3)', fontSize: 12, marginTop: 2 }}>
              Başlangıç: {emp.baslangic}
              {oda && ` · Oda: ${oda.address} No:${oda.no}`}
            </div>
          </div>
          {emp.durum === 'aktif' && (
            <button onClick={() => { if(window.confirm('İşten çıkarılsın mı?')) { onTerminate(emp.id); onClose() } }} style={{
              background: 'rgba(192,57,43,0.15)', border: '1px solid var(--red)',
              color: 'var(--red2)', borderRadius: 6, padding: '7px 14px', fontSize: 12, fontWeight: 600
            }}>İşten Çıkar</button>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 20, background: 'var(--bg3)', borderRadius: 8, padding: 4 }}>
          {[{ id: 'is', label: '🔪 İş Ekipmanları' }, { id: 'ev', label: '🛏️ Ev Ekipmanları' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '8px 0', borderRadius: 6, border: 'none',
              background: tab === t.id ? 'var(--bg2)' : 'transparent',
              color: tab === t.id ? 'var(--text)' : 'var(--text3)',
              fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
              boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.3)' : 'none'
            }}>{t.label}</button>
          ))}
        </div>

        {/* Zimmet grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cats.map(key => {
            const type = EQUIPMENT_TYPES[key]
            const z = emp.zimmet[key]
            return (
              <div key={key} style={{
                background: 'var(--bg3)', border: `1px solid ${z.var ? 'var(--border2)' : 'var(--border)'}`,
                borderRadius: 8, padding: '14px 16px',
                display: 'grid', gridTemplateColumns: '140px 1fr auto',
                alignItems: 'center', gap: 16
              }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 20 }}>{type.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{type.label}</div>
                    {z.tarih && <div style={{ fontSize: 11, color: 'var(--text3)' }}>{z.tarih}</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Toggle label="Teslim Edildi" checked={z.var}
                    onChange={v => updateZimmet(emp.id, key, 'var', v)} color="var(--blue2)" />
                  <Toggle label="İmzalı Onay" checked={z.imzali}
                    onChange={v => updateZimmet(emp.id, key, 'imzali', v)} color="var(--green2)" disabled={!z.var} />
                  <Toggle label="Öd. Kesiliyor" checked={z.odemeKesik}
                    onChange={v => updateZimmet(emp.id, key, 'odemeKesik', v)} color="var(--accent2)" disabled={!z.var} />
                </div>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: z.var && z.imzali ? 'var(--green2)' : z.var ? 'var(--amber2)' : 'var(--border2)'
                }} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Toggle({ label, checked, onChange, color, disabled }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1 }}>
      <div onClick={() => !disabled && onChange(!checked)} style={{
        width: 32, height: 18, borderRadius: 9, background: checked ? color : 'var(--border2)',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0
      }}>
        <div style={{
          width: 14, height: 14, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 2, left: checked ? 16 : 2, transition: 'left 0.2s'
        }} />
      </div>
      <span style={{ fontSize: 11, color: 'var(--text2)' }}>{label}</span>
    </label>
  )
}

export default function Employees({ employees, updateZimmet, terminateEmployee, addEmployee }) {
  const [detail, setDetail] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('hepsi')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ ad: '', tc: '', telefon: '', baslangic: new Date().toISOString().split('T')[0], oda: '' })

  const filtered = employees.filter(e => {
    const q = search.toLowerCase()
    const matchSearch = !q || e.ad.toLowerCase().includes(q) || e.tc.includes(q) || e.id.toLowerCase().includes(q)
    const matchFilter = filter === 'hepsi' || e.durum === filter
    return matchSearch && matchFilter
  })

  const handleAdd = () => {
    if (!form.ad || !form.tc) return
    addEmployee(form)
    setShowAdd(false)
    setForm({ ad: '', tc: '', telefon: '', baslangic: new Date().toISOString().split('T')[0], oda: '' })
  }

  return (
    <div className="animate-in" style={{ padding: '32px 36px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>Çalışanlar</h1>
        <button onClick={() => setShowAdd(true)} style={{
          background: 'var(--red)', color: '#fff', border: 'none',
          borderRadius: 8, padding: '10px 20px', fontWeight: 600, fontSize: 13
        }}>+ Yeni Çalışan</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ara: isim, TC, ID..."
          style={{
            flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8,
            color: 'var(--text)', padding: '9px 14px', fontSize: 13, outline: 'none'
          }} />
        {['hepsi', 'aktif', 'cikti'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '9px 16px', borderRadius: 8, border: `1px solid ${filter === f ? 'var(--red)' : 'var(--border)'}`,
            background: filter === f ? 'rgba(192,57,43,0.15)' : 'var(--bg2)',
            color: filter === f ? 'var(--red2)' : 'var(--text2)', fontSize: 13, fontWeight: filter === f ? 600 : 400
          }}>{{ hepsi: 'Hepsi', aktif: 'Aktif', cikti: 'İşten Ayrılanlar' }[f]}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '50px 1fr 130px 120px 100px 80px',
          gap: 0, padding: '10px 20px', background: 'var(--bg3)',
          fontSize: 11, color: 'var(--text3)', fontWeight: 600, letterSpacing: 0.5
        }}>
          <span>#</span><span>ÇALIŞAN</span><span>ODA</span><span>BAŞLANGIÇ</span><span>DURUM</span><span></span>
        </div>
        {filtered.map((e, i) => {
          const oda = ROOMS.find(r => r.id === e.oda)
          const eksik = Object.values(e.zimmet).filter(z => z.var && !z.imzali).length
          return (
            <div key={e.id} style={{
              display: 'grid', gridTemplateColumns: '50px 1fr 130px 120px 100px 80px',
              gap: 0, padding: '14px 20px', borderTop: '1px solid var(--border)',
              alignItems: 'center', transition: 'background 0.1s',
              cursor: 'pointer'
            }}
              onMouseEnter={ev => ev.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
              onClick={() => setDetail(e)}>
              <span style={{ color: 'var(--text3)', fontSize: 12 }}>{i + 1}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', background: 'var(--red)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Syne', fontWeight: 700, fontSize: 14
                }}>{e.ad.charAt(0)}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{e.ad}</div>
                  <div style={{ color: 'var(--text3)', fontSize: 11 }}>{e.id} · {e.telefon}</div>
                </div>
                {eksik > 0 && <span style={{ background: 'rgba(230,126,34,0.2)', color: 'var(--amber2)', borderRadius: 4, fontSize: 10, padding: '2px 6px', fontWeight: 600 }}>
                  {eksik} imza bekl.
                </span>}
              </div>
              <span style={{ fontSize: 12, color: 'var(--text2)' }}>{oda ? `No:${oda.no}` : '—'}</span>
              <span style={{ fontSize: 12, color: 'var(--text3)' }}>{e.baslangic}</span>
              <StatusBadge durum={e.durum} />
              <span style={{ color: 'var(--text3)', textAlign: 'right', fontSize: 18 }}>›</span>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text3)' }}>Sonuç bulunamadı</div>
        )}
      </div>

      {/* Add modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowAdd(false)}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 32px', width: 440 }}
            onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Yeni Çalışan Ekle</h2>
            {[
              ['ad', 'Ad Soyad *'], ['tc', 'TC Kimlik No *'], ['telefon', 'Telefon'],
              ['baslangic', 'İşe Başlangıç', 'date']
            ].map(([key, label, type]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>{label}</label>
                <input type={type || 'text'} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 7, color: 'var(--text)', padding: '9px 12px', fontSize: 13, outline: 'none' }} />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Oda</label>
              <select value={form.oda} onChange={e => setForm(p => ({ ...p, oda: e.target.value }))}
                style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 7, color: 'var(--text)', padding: '9px 12px', fontSize: 13, outline: 'none' }}>
                <option value="">— Seçiniz —</option>
                {ROOMS.map(r => <option key={r.id} value={r.id}>{r.address} No:{r.no}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleAdd} style={{ flex: 1, background: 'var(--red)', border: 'none', color: '#fff', borderRadius: 8, padding: '11px', fontWeight: 600, fontSize: 13 }}>Ekle</button>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: 8, padding: '11px', fontSize: 13 }}>İptal</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail modal */}
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

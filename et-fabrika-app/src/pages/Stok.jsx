import React, { useState } from 'react'
import { EQUIPMENT_TYPES } from '../data/mockData.js'

function EkipmanCard({ keyName, data, onSelect }) {
  const type = EQUIPMENT_TYPES[keyName]
  const pct = data.toplam > 0 ? Math.round((data.verildi / data.toplam) * 100) : 0
  return (
    <div className="card" style={{ padding: '18px', cursor: 'pointer' }} onClick={() => onSelect(keyName)}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 26 }}>{type.icon}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{type.label}</div>
            <span className={`badge ${type.category === 'is' ? 'badge-muted' : 'badge-blue'}`} style={{ fontSize: 10, marginTop: 4 }}>
              {type.category === 'is' ? 'İş' : 'Ev'}
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -1, lineHeight: 1 }}>{data.stokta}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>stokta</div>
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{data.verildi}/{data.toplam} dağıtıldı</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{pct}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%`, background: 'var(--text-1)' }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
        {[{v:data.verildi,l:'Verildi'},{v:data.imzali,l:'İmzalı'},{v:data.odemeKesik,l:'Öd.Kesik'}].map(s => (
          <div key={s.l} className="card-flat" style={{ padding: '8px 6px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>{s.v}</div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 500, marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DetailModal({ keyName, employees, onClose }) {
  const type = EQUIPMENT_TYPES[keyName]
  const list = employees.filter(e => e.zimmet[keyName]?.var)
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 32 }}>{type.icon}</span>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>{type.label}</h2>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{list.length} çalışanda zimmetli</div>
          </div>
          <button className="btn btn-ghost" style={{ padding: '0 10px' }} onClick={onClose}>✕</button>
        </div>
        {list.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text-3)', padding: '28px 0', fontSize: 13 }}>Henüz kimseye verilmemiş</div>}
        {list.map(e => {
          const z = e.zimmet[keyName]
          return (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
              <div className="avatar avatar-sm">{e.ad.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{e.ad}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{e.id} · {z.tarih}</div>
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                <span className={`badge ${z.imzali ? 'badge-green' : 'badge-amber'}`}>{z.imzali ? 'İmzalı' : 'İmzasız'}</span>
                <span className={`badge ${z.odemeKesik ? 'badge-amber' : 'badge-muted'}`}>{z.odemeKesik ? 'Öd.Kesik' : 'Öd.Yok'}</span>
                <span className={`badge ${e.durum === 'aktif' ? 'badge-green' : 'badge-red'}`}>{e.durum === 'aktif' ? 'Aktif' : 'Ayrıldı'}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Stok({ stats, employees }) {
  const [selected, setSelected] = useState(null)
  const [cat, setCat] = useState('hepsi')
  const keys = Object.keys(stats.ekipman).filter(k => cat === 'hepsi' || EQUIPMENT_TYPES[k].category === cat)

  return (
    <div className="animate-in page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500, marginBottom: 4 }}>Envanter</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>Stok / Zimmet</h1>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['hepsi','is','ev'].map(f => (
            <button key={f} className={`btn btn-ghost${cat === f ? ' active' : ''}`} onClick={() => setCat(f)}>
              {{ hepsi:'Tümü', is:'🔪 İş', ev:'🛏 Ev' }[f]}
            </button>
          ))}
        </div>
      </div>
      <div className="grid-cards">
        {keys.map(k => <EkipmanCard key={k} keyName={k} data={stats.ekipman[k]} onSelect={setSelected} />)}
      </div>
      {selected && <DetailModal keyName={selected} employees={employees} onClose={() => setSelected(null)} />}
    </div>
  )
}

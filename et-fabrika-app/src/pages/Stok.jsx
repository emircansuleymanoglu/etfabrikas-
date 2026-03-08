import React, { useState } from 'react'
import { EQUIPMENT_TYPES } from '../data/mockData.js'

function EkipmanCard({ keyName, data, onSelect }) {
  const type = EQUIPMENT_TYPES[keyName]
  const pct = data.toplam > 0 ? Math.round((data.verildi / data.toplam) * 100) : 0
  const isWork = type.category === 'is'

  return (
    <div className="card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => onSelect(keyName)}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>{type.icon}</span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 0.5 }}>{type.label.toUpperCase()}</div>
            <span className={`badge ${isWork ? 'badge-amber' : 'badge-blue'}`} style={{ fontSize: 9, marginTop: 4 }}>
              {isWork ? 'İŞ EKİPMANI' : 'EV EKİPMANI'}
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, lineHeight: 1, color: 'var(--text-primary)', letterSpacing: 1 }}>{data.stokta}</div>
          <div className="label-upper" style={{ fontSize: 9, marginTop: 3 }}>Stokta</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{data.verildi}/{data.toplam} dağıtıldı</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pct}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%`, background: isWork ? 'var(--amber-400)' : 'var(--blue)' }} />
        </div>
      </div>

      {/* Mini stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {[
          { v: data.verildi,    l: 'Verildi',   c: 'var(--blue)' },
          { v: data.imzali,     l: 'İmzalı',    c: 'var(--green)' },
          { v: data.odemeKesik, l: 'Öd.Kesik',  c: 'var(--amber-400)' },
        ].map(s => (
          <div key={s.l} className="card-inset" style={{ padding: '10px 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: s.c, lineHeight: 1, letterSpacing: 0.5 }}>{s.v}</div>
            <div className="label-upper" style={{ fontSize: 9, marginTop: 4 }}>{s.l}</div>
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
      <div className="modal" style={{ maxWidth: 580 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 36 }}>{type.icon}</span>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: 1 }}>{type.label.toUpperCase()}</h2>
            <div className="label-upper" style={{ marginTop: 4 }}>{list.length} çalışanda zimmetli</div>
          </div>
          <button className="btn btn-ghost" onClick={onClose}>✕</button>
        </div>

        {list.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0', fontFamily: 'var(--font-condensed)', letterSpacing: 1 }}>
            HENÜz KİMSEYE VERİLMEMİŞ
          </div>
        )}

        {list.map(e => {
          const z = e.zimmet[keyName]
          return (
            <div key={e.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 0', borderBottom: '1px solid var(--border-subtle)',
            }}>
              <div className="avatar avatar-sm">{e.ad.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{e.ad}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{e.id} · {z.tarih}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
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

  const keys = Object.keys(stats.ekipman).filter(k =>
    cat === 'hepsi' || EQUIPMENT_TYPES[k].category === cat
  )

  return (
    <div className="animate-in page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="label-upper" style={{ marginBottom: 6 }}>Envanter Durumu</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: 1.5, lineHeight: 1 }}>STOK / ZİMMET</h1>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['hepsi', 'is', 'ev'].map(f => (
            <button key={f} className={`btn btn-ghost ${cat === f ? 'active' : ''}`} onClick={() => setCat(f)}>
              {{ hepsi: 'Tümü', is: '🔪 İş', ev: '🛏 Ev' }[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-cards">
        {keys.map(k => (
          <EkipmanCard key={k} keyName={k} data={stats.ekipman[k]} onSelect={setSelected} />
        ))}
      </div>

      {selected && <DetailModal keyName={selected} employees={employees} onClose={() => setSelected(null)} />}
    </div>
  )
}

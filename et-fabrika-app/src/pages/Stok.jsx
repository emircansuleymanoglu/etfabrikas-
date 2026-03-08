import React, { useState } from 'react'
import { EQUIPMENT_TYPES } from '../data/mockData.js'

function EkipmanCard({ keyName, data, employees, onSelectEkipman }) {
  const type = EQUIPMENT_TYPES[keyName]
  const pct = data.toplam > 0 ? Math.round((data.verildi / data.toplam) * 100) : 0
  return (
    <div onClick={() => onSelectEkipman(keyName)} style={{
      background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
      padding: '20px', cursor: 'pointer', transition: 'border-color 0.15s'
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 28 }}>{type.icon}</span>
          <div>
            <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15 }}>{type.label}</div>
            <span style={{
              fontSize: 10, padding: '2px 7px', borderRadius: 10, fontWeight: 600,
              background: type.category === 'is' ? 'rgba(192,57,43,0.15)' : 'rgba(52,152,219,0.15)',
              color: type.category === 'is' ? 'var(--red2)' : 'var(--blue2)'
            }}>{type.category === 'is' ? 'İŞ EKİPMANI' : 'EV EKİPMANI'}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{data.stokta}</div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>stokta kalan</div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text2)' }}>{data.verildi} / {data.toplam} dağıtıldı</span>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>{pct}%</span>
        </div>
        <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 3 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: type.color, borderRadius: 3 }} />
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[
          { v: data.verildi, label: 'Verildi', color: 'var(--blue2)' },
          { v: data.imzali, label: 'İmzalı', color: 'var(--green2)' },
          { v: data.odemeKesik, label: 'Öd. Kesik', color: 'var(--accent2)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg3)', borderRadius: 6, padding: '10px 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 700, color: s.color }}>{s.v}</div>
            <div style={{ fontSize: 10, color: 'var(--text3)' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EkipmanDetail({ keyName, employees, onClose }) {
  const type = EQUIPMENT_TYPES[keyName]
  const empsWithItem = employees.filter(e => e.zimmet[keyName]?.var)

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, width: '100%', maxWidth: 600, maxHeight: '80vh', overflow: 'auto', padding: '28px 32px' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 32 }}>{type.icon}</span>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>{type.label}</h2>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>{empsWithItem.length} çalışanda zimmetli</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text2)', padding: '4px 10px' }}>✕</button>
        </div>

        {empsWithItem.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text3)', padding: '32px 0' }}>Henüz kimseye verilmemiş</div>}

        {empsWithItem.map(e => {
          const z = e.zimmet[keyName]
          return (
            <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{e.ad}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{e.id} · {z.tarih}</div>
              </div>
              <Tag v={z.imzali} yes="İmzalı" no="İmzasız" yesC="var(--green2)" noC="var(--amber2)" />
              <Tag v={z.odemeKesik} yes="Öd. Kesik" no="Öd. Yok" yesC="var(--accent2)" noC="var(--text3)" />
              <Tag v={e.durum === 'aktif'} yes="Aktif" no="Ayrıldı" yesC="var(--green2)" noC="var(--red2)" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Tag({ v, yes, no, yesC, noC }) {
  return <span style={{ fontSize: 11, fontWeight: 600, color: v ? yesC : noC, background: `${v ? yesC : noC}22`, borderRadius: 4, padding: '3px 8px' }}>{v ? yes : no}</span>
}

export default function Stok({ stats, employees }) {
  const [selected, setSelected] = useState(null)
  const [catFilter, setCatFilter] = useState('hepsi')

  const keys = Object.keys(EQUIPMENT_TYPES).filter(k =>
    catFilter === 'hepsi' || EQUIPMENT_TYPES[k].category === catFilter
  )

  return (
    <div className="animate-in" style={{ padding: '32px 36px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>Stok & Zimmet</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {['hepsi', 'is', 'ev'].map(f => (
            <button key={f} onClick={() => setCatFilter(f)} style={{
              padding: '8px 16px', borderRadius: 8, border: `1px solid ${catFilter === f ? 'var(--red)' : 'var(--border)'}`,
              background: catFilter === f ? 'rgba(192,57,43,0.15)' : 'var(--bg2)',
              color: catFilter === f ? 'var(--red2)' : 'var(--text2)', fontSize: 12, fontWeight: catFilter === f ? 600 : 400
            }}>{{ hepsi: 'Tümü', is: '🔪 İş', ev: '🛏️ Ev' }[f]}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {keys.map(k => (
          <EkipmanCard key={k} keyName={k} data={stats.ekipman[k]} employees={employees} onSelectEkipman={setSelected} />
        ))}
      </div>

      {selected && <EkipmanDetail keyName={selected} employees={employees} onClose={() => setSelected(null)} />}
    </div>
  )
}

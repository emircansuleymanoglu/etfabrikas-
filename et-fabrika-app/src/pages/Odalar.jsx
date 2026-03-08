import React from 'react'
import { ROOMS, EQUIPMENT_TYPES } from '../data/mockData.js'

export default function Odalar({ employees }) {
  return (
    <div className="animate-in page">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500, marginBottom: 4 }}>Konut</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>Oda Takibi</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 12 }}>
        {ROOMS.map(oda => {
          const occupants = employees.filter(e => e.oda === oda.id && e.durum === 'aktif')
          const pct = Math.round((occupants.length / oda.capacity) * 100)
          const dolu = occupants.length >= oda.capacity
          return (
            <div key={oda.id} className="card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>Oda {oda.no}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{oda.address}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: dolu ? 'var(--red)' : 'var(--green)', letterSpacing: -0.5, lineHeight: 1 }}>
                    {occupants.length}/{oda.capacity}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)' }}>kapasite</div>
                </div>
              </div>
              <div className="progress-track" style={{ marginBottom: 14 }}>
                <div className="progress-fill" style={{ width: `${pct}%`, background: dolu ? 'var(--red)' : 'var(--text-1)' }} />
              </div>
              {occupants.length === 0
                ? <div style={{ fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic' }}>Boş oda</div>
                : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {occupants.map(e => {
                      const evK = ['yatak','dolap','dosek','buzdolabi']
                      const eksik = evK.filter(k => !e.zimmet[k]?.var).length
                      const imzasiz = evK.filter(k => e.zimmet[k]?.var && !e.zimmet[k]?.imzali).length
                      return (
                        <div key={e.id} className="card-flat" style={{ padding: '10px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              <div className="avatar avatar-sm">{e.ad.charAt(0)}</div>
                              <span style={{ fontSize: 13, fontWeight: 600 }}>{e.ad}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 4 }}>
                              {imzasiz > 0 && <span className="badge badge-amber" style={{ fontSize: 10 }}>{imzasiz} imza</span>}
                              {eksik > 0 && <span className="badge badge-blue" style={{ fontSize: 10 }}>{eksik} eksik</span>}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {evK.map(k => (
                              <span key={k} title={EQUIPMENT_TYPES[k].label} style={{
                                fontSize: 17, opacity: e.zimmet[k]?.var ? 1 : 0.2,
                              }}>{EQUIPMENT_TYPES[k].icon}</span>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}

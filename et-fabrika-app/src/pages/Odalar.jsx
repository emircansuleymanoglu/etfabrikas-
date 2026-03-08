import React from 'react'
import { ROOMS, EQUIPMENT_TYPES } from '../data/mockData.js'

export default function Odalar({ employees }) {
  return (
    <div className="animate-in page">
      <div style={{ marginBottom: 24 }}>
        <div className="label-upper" style={{ marginBottom: 6 }}>Konut Durumu</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: 1.5, lineHeight: 1 }}>ODA TAKİBİ</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {ROOMS.map(oda => {
          const occupants = employees.filter(e => e.oda === oda.id && e.durum === 'aktif')
          const pct = Math.round((occupants.length / oda.capacity) * 100)
          const dolu = occupants.length >= oda.capacity

          return (
            <div key={oda.id} className="card" style={{ padding: '20px' }}>
              {/* Room header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 1, lineHeight: 1 }}>ODA {oda.no}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{oda.address}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: dolu ? 'var(--red)' : 'var(--green)', lineHeight: 1 }}>
                    {occupants.length}/{oda.capacity}
                  </div>
                  <div className="label-upper" style={{ fontSize: 9, marginTop: 3 }}>Kapasite</div>
                </div>
              </div>

              {/* Capacity bar */}
              <div className="progress-track" style={{ marginBottom: 16 }}>
                <div className="progress-fill" style={{ width: `${pct}%`, background: dolu ? 'var(--red)' : 'var(--green)' }} />
              </div>

              {/* Occupants */}
              {occupants.length === 0 ? (
                <div style={{ fontFamily: 'var(--font-condensed)', fontSize: 12, letterSpacing: 1, color: 'var(--text-muted)', padding: '8px 0' }}>
                  BOŞ ODA
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {occupants.map(e => {
                    const evKeys = ['yatak', 'dolap', 'dosek', 'buzdolabi']
                    const eksik = evKeys.filter(k => !e.zimmet[k]?.var).length
                    const imzasiz = evKeys.filter(k => e.zimmet[k]?.var && !e.zimmet[k]?.imzali).length

                    return (
                      <div key={e.id} className="card-inset" style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <div className="avatar avatar-sm">{e.ad.charAt(0)}</div>
                            <span style={{ fontWeight: 600, fontSize: 13 }}>{e.ad}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 4 }}>
                            {imzasiz > 0 && <span className="badge badge-amber" style={{ fontSize: 9 }}>{imzasiz} İmza</span>}
                            {eksik > 0 && <span className="badge badge-blue" style={{ fontSize: 9 }}>{eksik} Eksik</span>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {evKeys.map(k => {
                            const z = e.zimmet[k]
                            const type = EQUIPMENT_TYPES[k]
                            return (
                              <span key={k} title={type.label} style={{
                                fontSize: 18, opacity: z.var ? 1 : 0.2,
                                filter: z.var && !z.imzali ? 'sepia(1)' : 'none',
                              }}>{type.icon}</span>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

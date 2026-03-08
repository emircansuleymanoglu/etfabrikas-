import React from 'react'
import { ROOMS, EQUIPMENT_TYPES } from '../data/mockData.js'

export default function Odalar({ employees }) {
  return (
    <div className="animate-in" style={{ padding: '32px 36px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>Oda Takibi</h1>
        <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 4 }}>Çalışan konutları ve oda zimmet durumu</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {ROOMS.map(oda => {
          const occupants = employees.filter(e => e.oda === oda.id && e.durum === 'aktif')
          const fullPct = Math.round((occupants.length / oda.capacity) * 100)

          return (
            <div key={oda.id} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '20px', overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18 }}>No: {oda.no}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{oda.address}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, color: occupants.length >= oda.capacity ? 'var(--red2)' : 'var(--green2)' }}>
                    {occupants.length}/{oda.capacity}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text3)' }}>kapasite</div>
                </div>
              </div>

              {/* Capacity bar */}
              <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 2, marginBottom: 16 }}>
                <div style={{ height: '100%', width: `${fullPct}%`, background: fullPct >= 100 ? 'var(--red)' : 'var(--green)', borderRadius: 2 }} />
              </div>

              {/* Occupants */}
              {occupants.length === 0 ? (
                <div style={{ color: 'var(--text3)', fontSize: 12, padding: '8px 0' }}>Bu odada kimse kalmıyor</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {occupants.map(e => {
                    const evEkipman = ['yatak', 'dolap', 'dosek', 'buzdolabi']
                    const eksikler = evEkipman.filter(k => !e.zimmet[k]?.var)
                    const imzasizlar = evEkipman.filter(k => e.zimmet[k]?.var && !e.zimmet[k]?.imzali)

                    return (
                      <div key={e.id} style={{
                        background: 'var(--bg3)', borderRadius: 8, padding: '12px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{e.ad}</div>
                          <div style={{ display: 'flex', gap: 4 }}>
                            {imzasizlar.length > 0 && <span style={{ background: 'rgba(230,126,34,0.2)', color: 'var(--amber2)', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4 }}>
                              {imzasizlar.length} imza bekl.
                            </span>}
                            {eksikler.length > 0 && <span style={{ background: 'rgba(52,152,219,0.15)', color: 'var(--blue2)', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4 }}>
                              {eksikler.length} eksik
                            </span>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {evEkipman.map(k => {
                            const z = e.zimmet[k]
                            const type = EQUIPMENT_TYPES[k]
                            const color = !z.var ? 'var(--text3)' : z.imzali ? 'var(--green2)' : 'var(--amber2)'
                            return (
                              <span key={k} title={type.label} style={{ fontSize: 18, opacity: z.var ? 1 : 0.25, filter: z.var && !z.imzali ? 'hue-rotate(30deg)' : 'none' }}>
                                {type.icon}
                              </span>
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

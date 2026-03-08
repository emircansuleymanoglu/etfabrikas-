import React from 'react'
import { EQUIPMENT_TYPES } from '../data/mockData.js'

export default function Iade({ employees, updateZimmet }) {
  const iadeList = []

  employees.filter(e => e.durum === 'cikti').forEach(emp => {
    Object.entries(emp.zimmet).forEach(([key, z]) => {
      if (z.var) {
        iadeList.push({ emp, key, z })
      }
    })
  })

  const grouped = {}
  iadeList.forEach(item => {
    if (!grouped[item.emp.id]) grouped[item.emp.id] = { emp: item.emp, items: [] }
    grouped[item.emp.id].items.push(item)
  })

  const handleIadeAl = (empId, key) => {
    updateZimmet(empId, key, 'var', false)
    updateZimmet(empId, key, 'imzali', false)
    updateZimmet(empId, key, 'iadeGerekli', false)
  }

  const toplam = iadeList.length

  return (
    <div className="animate-in" style={{ padding: '32px 36px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>İade Listesi</h1>
        <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 4 }}>
          İşten ayrılan çalışanlardan alınacak ekipmanlar
        </p>
      </div>

      {/* Summary banner */}
      <div style={{
        background: toplam > 0 ? 'rgba(230,126,34,0.1)' : 'rgba(39,174,96,0.1)',
        border: `1px solid ${toplam > 0 ? 'rgba(230,126,34,0.3)' : 'rgba(39,174,96,0.3)'}`,
        borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: 24,
        display: 'flex', gap: 16, alignItems: 'center'
      }}>
        <span style={{ fontSize: 32 }}>{toplam > 0 ? '⚠️' : '✅'}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: toplam > 0 ? 'var(--amber2)' : 'var(--green2)' }}>
            {toplam > 0 ? `${toplam} ekipman iade bekleniyor` : 'Tüm iadeler tamamlandı'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
            {Object.keys(grouped).length} eski çalışanda zimmetli ekipman mevcut
          </div>
        </div>
      </div>

      {/* Per employee */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {Object.values(grouped).map(({ emp, items }) => (
          <div key={emp.id} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', overflow: 'hidden'
          }}>
            {/* Employee header */}
            <div style={{
              padding: '16px 20px', background: 'var(--bg3)', borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', background: 'var(--red)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Syne', fontWeight: 700, fontSize: 15
                }}>{emp.ad.charAt(0)}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{emp.ad}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{emp.id} · Başlangıç: {emp.baslangic}</div>
                </div>
              </div>
              <span style={{ background: 'rgba(192,57,43,0.15)', color: 'var(--red2)', borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 600 }}>
                {items.length} kalem
              </span>
            </div>

            {/* Items */}
            <div style={{ padding: '8px 0' }}>
              {items.map(({ key, z }) => {
                const type = EQUIPMENT_TYPES[key]
                const iadeAlindi = !z.var
                return (
                  <div key={key} style={{
                    display: 'grid', gridTemplateColumns: '1fr auto auto auto auto',
                    gap: 16, alignItems: 'center', padding: '12px 20px',
                    borderBottom: '1px solid var(--border)',
                    opacity: iadeAlindi ? 0.4 : 1
                  }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 20 }}>{type.icon}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{type.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>Verildiği tarih: {z.tarih || '—'}</div>
                      </div>
                    </div>

                    <Tag v={z.imzali} yes="İmzalı Zimmet" no="İmzasız" yesC="var(--green2)" noC="var(--amber2)" />
                    <Tag v={z.odemeKesik} yes="Öd. Kesildi" no="Öd. Kesilmedi" yesC="var(--accent2)" noC="var(--text3)" />
                    <Tag v={z.iadeGerekli} yes="İade Gerekli" no="İade Gerekmez" yesC="var(--amber2)" noC="var(--text3)" />

                    {!iadeAlindi ? (
                      <button onClick={() => handleIadeAl(emp.id, key)} style={{
                        background: 'var(--green)', border: 'none', color: '#fff',
                        borderRadius: 6, padding: '7px 14px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap'
                      }}>✓ İade Alındı</button>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--green2)', fontWeight: 600 }}>✓ Teslim Alındı</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {Object.keys(grouped).length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text3)', padding: '60px 0', fontSize: 15 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            İade bekleyen ekipman bulunmuyor
          </div>
        )}
      </div>
    </div>
  )
}

function Tag({ v, yes, no, yesC, noC }) {
  return <span style={{ fontSize: 11, fontWeight: 600, color: v ? yesC : noC, background: `${v ? yesC : noC}22`, borderRadius: 4, padding: '3px 8px', whiteSpace: 'nowrap' }}>{v ? yes : no}</span>
}

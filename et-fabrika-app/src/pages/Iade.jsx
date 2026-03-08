import React from 'react'
import { EQUIPMENT_TYPES } from '../data/mockData.js'

function Tag({ v, yes, no, yesC, noC }) {
  return (
    <span className={`badge ${v ? yesC : noC}`}>{v ? yes : no}</span>
  )
}

export default function Iade({ employees, updateZimmet }) {
  const iadeList = []
  employees.filter(e => e.durum === 'cikti').forEach(emp => {
    Object.entries(emp.zimmet).forEach(([key, z]) => {
      if (z.var) iadeList.push({ emp, key, z })
    })
  })

  const grouped = {}
  iadeList.forEach(item => {
    if (!grouped[item.emp.id]) grouped[item.emp.id] = { emp: item.emp, items: [] }
    grouped[item.emp.id].items.push(item)
  })

  const handleIade = (empId, key) => {
    updateZimmet(empId, key, 'var', false)
    updateZimmet(empId, key, 'imzali', false)
    updateZimmet(empId, key, 'iadeGerekli', false)
  }

  const toplam = iadeList.length

  return (
    <div className="animate-in page">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div className="label-upper" style={{ marginBottom: 6 }}>İşten Ayrılan Personel</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: 1.5, lineHeight: 1 }}>İADE LİSTESİ</h1>
      </div>

      {/* Summary banner */}
      <div style={{
        display: 'flex', gap: 14, alignItems: 'center', padding: '14px 18px',
        borderRadius: 'var(--r-md)', marginBottom: 20,
        background: toplam > 0 ? 'rgba(245,166,35,0.07)' : 'rgba(34,197,94,0.07)',
        border: `1px solid ${toplam > 0 ? 'rgba(245,166,35,0.2)' : 'rgba(34,197,94,0.2)'}`,
      }}>
        <span style={{ fontSize: 28 }}>{toplam > 0 ? '⚠️' : '✅'}</span>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 0.5,
            color: toplam > 0 ? 'var(--amber-400)' : 'var(--green)',
          }}>
            {toplam > 0 ? `${toplam} KALEM İADE BEKLİYOR` : 'TÜM İADELER TAMAMLANDI'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
            {Object.keys(grouped).length} eski çalışanda zimmetli ekipman mevcut
          </div>
        </div>
      </div>

      {/* Per employee */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {Object.values(grouped).map(({ emp, items }) => (
          <div key={emp.id} className="card" style={{ overflow: 'hidden' }}>
            {/* Employee row */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 20px', background: 'var(--surface-2)',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div className="avatar avatar-md">{emp.ad.charAt(0)}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, letterSpacing: 0.5 }}>{emp.ad.toUpperCase()}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.id} · Başlangıç: {emp.baslangic}</div>
                </div>
              </div>
              <span className="badge badge-red" style={{ fontSize: 11 }}>{items.length} Kalem</span>
            </div>

            {/* Items */}
            <div className="scroll-x">
              {items.map(({ key, z }) => {
                const type = EQUIPMENT_TYPES[key]
                return (
                  <div key={key} style={{
                    display: 'grid', gridTemplateColumns: '1fr auto auto auto auto',
                    gap: 12, alignItems: 'center',
                    padding: '12px 20px', minWidth: 480,
                    borderBottom: '1px solid var(--border-subtle)',
                    opacity: !z.var ? 0.4 : 1,
                  }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 22 }}>{type.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{type.label}</div>
                        {z.tarih && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{z.tarih}</div>}
                      </div>
                    </div>

                    <Tag v={z.imzali} yes="İmzalı" no="İmzasız" yesC="badge-green" noC="badge-amber" />
                    <Tag v={z.odemeKesik} yes="Öd.Kesildi" no="Öd.Kesilmedi" yesC="badge-amber" noC="badge-muted" />
                    <Tag v={z.iadeGerekli} yes="İade Gerekli" no="İade Gerekmez" yesC="badge-amber" noC="badge-muted" />

                    {z.var ? (
                      <button className="btn btn-primary" style={{ height: 30, fontSize: 11 }}
                        onClick={() => handleIade(emp.id, key)}>
                        ✓ İade Alındı
                      </button>
                    ) : (
                      <span className="badge badge-green" style={{ fontSize: 11 }}>✓ Teslim Alındı</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {Object.keys(grouped).length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 1 }}>
              İADE BEKLEYEN EKİPMAN YOK
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

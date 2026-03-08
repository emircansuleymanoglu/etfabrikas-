import React from 'react'
import { EQUIPMENT_TYPES } from '../data/mockData.js'

export default function Iade({ employees, updateZimmet }) {
  const iadeList = []
  employees.filter(e => e.durum === 'cikti').forEach(emp => {
    Object.entries(emp.zimmet).forEach(([key, z]) => {
      if (z.var) iadeList.push({ emp, key, z })
    })
  })
  const grouped = {}
  iadeList.forEach(({ emp, key, z }) => {
    if (!grouped[emp.id]) grouped[emp.id] = { emp, items: [] }
    grouped[emp.id].items.push({ key, z })
  })
  const toplam = iadeList.length

  const handleIade = (empId, key) => {
    updateZimmet(empId, key, 'var', false)
    updateZimmet(empId, key, 'imzali', false)
    updateZimmet(empId, key, 'iadeGerekli', false)
  }

  return (
    <div className="animate-in page">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500, marginBottom: 4 }}>İşten Ayrılan Personel</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>İade Listesi</h1>
      </div>

      <div style={{
        display: 'flex', gap: 12, alignItems: 'center',
        padding: '12px 16px', borderRadius: 'var(--r-md)', marginBottom: 18,
        background: toplam > 0 ? 'var(--amber-bg)' : 'var(--green-bg)',
        border: `1px solid ${toplam > 0 ? 'var(--amber-border)' : 'var(--green-border)'}`,
      }}>
        <span style={{ fontSize: 22 }}>{toplam > 0 ? '⚠️' : '✅'}</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: toplam > 0 ? 'var(--amber)' : 'var(--green)' }}>
            {toplam > 0 ? `${toplam} ekipman iade bekliyor` : 'Tüm iadeler tamamlandı'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
            {Object.keys(grouped).length} eski çalışanda zimmetli ekipman
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {Object.values(grouped).map(({ emp, items }) => (
          <div key={emp.id} className="card" style={{ overflow: 'hidden' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '13px 18px', background: 'var(--bg-subtle)',
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div className="avatar avatar-md">{emp.ad.charAt(0)}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{emp.ad}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{emp.id} · {emp.baslangic}</div>
                </div>
              </div>
              <span className="badge badge-red">{items.length} kalem</span>
            </div>
            <div className="scroll-x">
              {items.map(({ key, z }) => {
                const type = EQUIPMENT_TYPES[key]
                return (
                  <div key={key} style={{
                    display: 'grid', gridTemplateColumns: '1fr auto auto auto auto',
                    gap: 10, alignItems: 'center',
                    padding: '11px 18px', minWidth: 460,
                    borderBottom: '1px solid var(--border)',
                    opacity: !z.var ? 0.45 : 1,
                    background: !z.var ? 'var(--bg-subtle)' : 'var(--bg)',
                  }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 20 }}>{type.icon}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{type.label}</div>
                        {z.tarih && <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{z.tarih}</div>}
                      </div>
                    </div>
                    <span className={`badge ${z.imzali ? 'badge-green' : 'badge-amber'}`}>{z.imzali ? 'İmzalı' : 'İmzasız'}</span>
                    <span className={`badge ${z.odemeKesik ? 'badge-amber' : 'badge-muted'}`}>{z.odemeKesik ? 'Öd.Kesildi' : 'Öd.Yok'}</span>
                    <span className={`badge ${z.iadeGerekli ? 'badge-amber' : 'badge-muted'}`}>{z.iadeGerekli ? 'İade Gerekli' : 'İade Gerekmez'}</span>
                    {z.var
                      ? <button className="btn btn-primary" style={{ height: 28, fontSize: 11 }} onClick={() => handleIade(emp.id, key)}>✓ İade Alındı</button>
                      : <span className="badge badge-green">✓ Teslim Alındı</span>
                    }
                  </div>
                )
              })}
            </div>
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <div style={{ textAlign: 'center', padding: '52px 0', color: 'var(--text-3)', fontSize: 13 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            İade bekleyen ekipman bulunmuyor
          </div>
        )}
      </div>
    </div>
  )
}

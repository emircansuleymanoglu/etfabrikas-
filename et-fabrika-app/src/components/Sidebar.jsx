import React from 'react'
import { EQUIPMENT_TYPES } from '../data/mockData.js'

const NAV = [
  { id: 'dashboard', label: 'Genel Bakış',     icon: '▦' },
  { id: 'employees', label: 'Çalışanlar',       icon: '◉' },
  { id: 'stok',      label: 'Stok & Zimmet',    icon: '◈' },
  { id: 'odalar',    label: 'Oda Takibi',       icon: '⬡' },
  { id: 'iade',      label: 'İade Listesi',     icon: '↩' },
]

export default function Sidebar({ page, setPage, stats }) {
  return (
    <aside style={{
      width: 220, minHeight: '100vh', background: 'var(--bg2)',
      borderRight: '1px solid var(--border)', display: 'flex',
      flexDirection: 'column', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: 'var(--red)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 800, fontFamily: 'Syne'
          }}>P4</div>
          <div>
            <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, letterSpacing: 1, color: 'var(--text)' }}>PLAN4FLEX</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 1 }}>ZİMMET SİSTEMİ</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {NAV.map(n => {
          const active = page === n.id
          return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 20px', background: active ? 'rgba(192,57,43,0.15)' : 'transparent',
              border: 'none', borderLeft: active ? '3px solid var(--red)' : '3px solid transparent',
              color: active ? 'var(--text)' : 'var(--text2)',
              fontSize: 13, fontWeight: active ? 600 : 400,
              transition: 'all 0.15s', textAlign: 'left', cursor: 'pointer'
            }}>
              <span style={{ fontSize: 16, opacity: active ? 1 : 0.7 }}>{n.icon}</span>
              {n.label}
              {n.id === 'iade' && stats.ekipman && (() => {
                const total = Object.values(stats.ekipman).reduce((s, e) => s + e.iadeGerekli, 0)
                return total > 0 ? (
                  <span style={{
                    marginLeft: 'auto', background: 'var(--amber)', color: '#000',
                    borderRadius: 10, fontSize: 10, fontWeight: 700, padding: '2px 6px'
                  }}>{total}</span>
                ) : null
              })()}
            </button>
          )
        })}
      </nav>

      {/* Footer stats */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8 }}>AKTİF ÇALIŞAN</div>
        <div style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, color: 'var(--green2)', lineHeight: 1 }}>
          {stats.aktif}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>/ {stats.toplam} toplam</div>
      </div>
    </aside>
  )
}

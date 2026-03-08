import React, { useState, useEffect } from 'react'

const NAV = [
  { id: 'dashboard', label: 'Genel Bakış',   short: 'Bakış',   icon: '⊞' },
  { id: 'employees', label: 'Çalışanlar',    short: 'Çalışan', icon: '◎' },
  { id: 'stok',      label: 'Stok / Zimmet', short: 'Stok',    icon: '⊟' },
  { id: 'odalar',    label: 'Oda Takibi',    short: 'Odalar',  icon: '⬡' },
  { id: 'iade',      label: 'İade Listesi',  short: 'İade',    icon: '↩' },
]

function useIsMobile() {
  const [mob, setMob] = useState(window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setMob(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return mob
}

export default function Sidebar({ page, setPage, stats }) {
  const isMobile = useIsMobile()
  const iadeCount = stats.ekipman
    ? Object.values(stats.ekipman).reduce((s, e) => s + e.iadeGerekli, 0)
    : 0

  if (isMobile) {
    return (
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 300,
        background: '#fff', borderTop: '1px solid var(--border)',
        display: 'flex', paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
      }}>
        {NAV.map(n => {
          const active = page === n.id
          return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 3, padding: '10px 4px 8px',
              background: 'transparent', border: 'none',
              borderTop: `2px solid ${active ? 'var(--text-1)' : 'transparent'}`,
              color: active ? 'var(--text-1)' : 'var(--text-3)',
              cursor: 'pointer', position: 'relative', transition: 'all 0.12s',
            }}>
              <span style={{ fontSize: 17 }}>{n.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.3 }}>{n.short}</span>
              {n.id === 'iade' && iadeCount > 0 && (
                <span style={{
                  position: 'absolute', top: 6, right: '50%', transform: 'translateX(10px)',
                  background: 'var(--amber)', color: '#fff',
                  borderRadius: 99, fontSize: 9, fontWeight: 700,
                  padding: '1px 5px', lineHeight: 1.5,
                }}>{iadeCount}</span>
              )}
            </button>
          )
        })}
      </nav>
    )
  }

  return (
    <aside style={{
      width: 220, minHeight: '100vh',
      background: '#fff',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100,
    }}>
      <div style={{ padding: '20px 18px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, background: 'var(--bg-inverse)',
            borderRadius: 'var(--r-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: 0.3,
          }}>P4</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', letterSpacing: -0.2 }}>Plan4Flex</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Zimmet Sistemi</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '8px 0' }}>
        {NAV.map(n => {
          const active = page === n.id
          return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 9,
              padding: '9px 18px',
              background: active ? 'var(--bg-subtle)' : 'transparent',
              border: 'none',
              borderLeft: `2px solid ${active ? 'var(--text-1)' : 'transparent'}`,
              color: active ? 'var(--text-1)' : 'var(--text-3)',
              fontSize: 13.5, fontWeight: active ? 600 : 400,
              textAlign: 'left', cursor: 'pointer', transition: 'all 0.12s',
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-subtle)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: 13, width: 16, textAlign: 'center' }}>{n.icon}</span>
              {n.label}
              {n.id === 'iade' && iadeCount > 0 && (
                <span style={{
                  marginLeft: 'auto', background: 'var(--amber)', color: '#fff',
                  borderRadius: 99, fontSize: 10, fontWeight: 700, padding: '2px 7px',
                }}>{iadeCount}</span>
              )}
            </button>
          )
        })}
      </nav>

      <div style={{ padding: '16px 18px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4 }}>Aktif Çalışan</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-1)', letterSpacing: -1, lineHeight: 1 }}>{stats.aktif}</div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>/ {stats.toplam} toplam</div>
      </div>
    </aside>
  )
}

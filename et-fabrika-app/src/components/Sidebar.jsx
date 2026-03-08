import React, { useState, useEffect } from 'react'

const NAV = [
  { id: 'dashboard', label: 'Genel Bakış',   short: 'Bakış',   icon: '◼' },
  { id: 'employees', label: 'Çalışanlar',    short: 'Çalışan', icon: '◉' },
  { id: 'stok',      label: 'Stok / Zimmet', short: 'Stok',    icon: '◈' },
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

  /* ── MOBILE bottom bar ─────────────────────────────────────────── */
  if (isMobile) {
    return (
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 300,
        background: 'var(--surface-1)',
        borderTop: '1px solid var(--border-default)',
        display: 'flex',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {NAV.map(n => {
          const active = page === n.id
          return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 4, padding: '10px 4px 8px',
              background: 'transparent', border: 'none',
              borderTop: `2px solid ${active ? 'var(--amber-400)' : 'transparent'}`,
              color: active ? 'var(--amber-400)' : 'var(--text-muted)',
              cursor: 'pointer', position: 'relative', transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{n.icon}</span>
              <span style={{
                fontFamily: 'var(--font-condensed)', fontSize: 10,
                fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
              }}>{n.short}</span>
              {n.id === 'iade' && iadeCount > 0 && (
                <span style={{
                  position: 'absolute', top: 6, right: '50%', transform: 'translateX(10px)',
                  background: 'var(--amber-400)', color: 'var(--text-inverse)',
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

  /* ── DESKTOP sidebar ───────────────────────────────────────────── */
  return (
    <aside style={{
      width: 224, minHeight: '100vh',
      background: 'var(--surface-1)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100,
    }}>
      {/* Logo mark */}
      <div style={{
        padding: '22px 20px 20px',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38,
            background: 'var(--amber-400)',
            borderRadius: 'var(--r-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-inverse)',
            letterSpacing: 0.5, lineHeight: 1,
          }}>P4</div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 17, letterSpacing: 2,
              color: 'var(--text-primary)', lineHeight: 1,
            }}>PLAN4FLEX</div>
            <div className="label-upper" style={{ marginTop: 3 }}>Zimmet Sistemi</div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '10px 0' }}>
        {NAV.map(n => {
          const active = page === n.id
          return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 20px',
              background: active ? 'rgba(245,166,35,0.08)' : 'transparent',
              border: 'none',
              borderLeft: `3px solid ${active ? 'var(--amber-400)' : 'transparent'}`,
              color: active ? 'var(--text-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-condensed)', fontSize: 14, fontWeight: 600,
              letterSpacing: 0.5, textAlign: 'left', cursor: 'pointer',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'var(--text-secondary)' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' } }}
            >
              <span style={{ fontSize: 14, width: 18, textAlign: 'center', opacity: active ? 1 : 0.7 }}>{n.icon}</span>
              <span>{n.label}</span>
              {n.id === 'iade' && iadeCount > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: 'var(--amber-400)', color: 'var(--text-inverse)',
                  borderRadius: 99, fontSize: 10, fontWeight: 700, padding: '2px 7px',
                  fontFamily: 'var(--font-condensed)', lineHeight: 1.4,
                }}>{iadeCount}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer stat */}
      <div style={{
        padding: '16px 20px', borderTop: '1px solid var(--border-subtle)',
      }}>
        <div className="label-upper" style={{ marginBottom: 8 }}>Aktif Çalışan</div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 40,
          color: 'var(--amber-400)', lineHeight: 1, letterSpacing: 1,
        }}>{stats.aktif}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
          / {stats.toplam} toplam
        </div>
      </div>
    </aside>
  )
}

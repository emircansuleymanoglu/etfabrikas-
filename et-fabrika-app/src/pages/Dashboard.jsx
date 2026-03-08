import React from 'react'
import { EQUIPMENT_TYPES } from '../data/mockData.js'

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '20px 24px',
      display: 'flex', flexDirection: 'column', gap: 6
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 500, letterSpacing: 0.5 }}>{label}</div>
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <div style={{ fontFamily: 'Syne', fontSize: 36, fontWeight: 800, color: color || 'var(--text)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text3)' }}>{sub}</div>}
    </div>
  )
}

function EkipmanRow({ keyName, data }) {
  const type = EQUIPMENT_TYPES[keyName]
  const pct = data.toplam > 0 ? (data.verildi / data.toplam) * 100 : 0
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '160px 1fr 80px 80px 80px 80px',
      alignItems: 'center', gap: 16,
      padding: '14px 0', borderBottom: '1px solid var(--border)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 18 }}>{type.icon}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{type.label}</div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>{type.category === 'is' ? 'İş' : 'Ev'}</div>
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>{data.verildi}/{data.toplam} verildi</span>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>{Math.round(pct)}%</span>
        </div>
        <div style={{ height: 5, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: type.color, borderRadius: 3, transition: 'width 0.6s ease' }} />
        </div>
      </div>
      <Pill v={data.stokta} label="Stokta" color="var(--text2)" />
      <Pill v={data.verildi} label="Verildi" color="var(--blue2)" />
      <Pill v={data.odemeKesik} label="Öd. Kesik" color="var(--green2)" />
      <Pill v={data.iadeGerekli} label="İade Bekl." color={data.iadeGerekli > 0 ? 'var(--amber2)' : 'var(--text3)'} />
    </div>
  )
}

function Pill({ v, label, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 700, color }}>{v}</div>
      <div style={{ fontSize: 10, color: 'var(--text3)' }}>{label}</div>
    </div>
  )
}

export default function Dashboard({ stats, employees, setPage, setSelectedEmployee }) {
  const bekleyenImza = employees.filter(e =>
    Object.values(e.zimmet).some(z => z.var && !z.imzali)
  ).length

  const eksikEkipman = employees.filter(e =>
    e.durum === 'aktif' && Object.values(e.zimmet).some(z => !z.var)
  ).length

  return (
    <div className="animate-in" style={{ padding: '32px 36px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>Genel Bakış</h1>
        <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 4 }}>
          {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Top cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard label="AKTİF ÇALIŞAN" value={stats.aktif} sub={`${stats.cikti} işten çıkmış`} color="var(--green2)" icon="👷" />
        <StatCard label="TOPLAM STOK KALEMİ" value={Object.values(stats.ekipman).reduce((s,e) => s+e.toplam, 0)} sub="7 ekipman türü" color="var(--text)" icon="📦" />
        <StatCard label="İMZA BEKLİYOR" value={bekleyenImza} sub="çalışan" color={bekleyenImza > 0 ? 'var(--amber2)' : 'var(--green2)'} icon="✍️" />
        <StatCard label="İADE BEKLEYEN" value={Object.values(stats.ekipman).reduce((s,e) => s+e.iadeGerekli, 0)} sub="ekipman" color="var(--red2)" icon="↩" />
      </div>

      {/* Uyarılar */}
      {(bekleyenImza > 0 || eksikEkipman > 0) && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          {bekleyenImza > 0 && (
            <div style={{
              flex: 1, background: 'rgba(230,126,34,0.1)', border: '1px solid rgba(230,126,34,0.3)',
              borderRadius: 'var(--radius2)', padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center'
            }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--amber2)' }}>{bekleyenImza} çalışanın imzalanmamış zimmet belgesi var</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>Plan4Flex üzerinden onay alınması gerekiyor</div>
              </div>
            </div>
          )}
          {eksikEkipman > 0 && (
            <div style={{
              flex: 1, background: 'rgba(52,152,219,0.1)', border: '1px solid rgba(52,152,219,0.3)',
              borderRadius: 'var(--radius2)', padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center'
            }}>
              <span style={{ fontSize: 20 }}>ℹ️</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--blue2)' }}>{eksikEkipman} aktif çalışanın eksik ekipmanı var</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>Zimmet sayfasından teslim işlemi yapın</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ekipman tablosu */}
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '20px 24px'
      }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Ekipman Özeti</h2>
          <div style={{
            display: 'grid', gridTemplateColumns: '160px 1fr 80px 80px 80px 80px',
            gap: 16, fontSize: 11, color: 'var(--text3)', fontWeight: 600, letterSpacing: 0.5,
            paddingBottom: 8, borderBottom: '1px solid var(--border)', width: '100%'
          }}>
            <span>EKİPMAN</span>
            <span>DAĞILIM</span>
            <span style={{ textAlign: 'center' }}>STOKTA</span>
            <span style={{ textAlign: 'center' }}>VERİLDİ</span>
            <span style={{ textAlign: 'center' }}>ÖD. KESİK</span>
            <span style={{ textAlign: 'center' }}>İADE BEKL.</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {Object.entries(stats.ekipman).map(([k, v]) => (
            <EkipmanRow key={k} keyName={k} data={v} />
          ))}
        </div>
      </div>
    </div>
  )
}

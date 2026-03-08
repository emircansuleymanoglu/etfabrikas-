import React from 'react'
import { EQUIPMENT_TYPES } from '../data/mockData.js'

function StatCard({ label, value, sub, color, dot }) {
  return (
    <div className="card" style={{ padding: '20px' }}>
      <div className="label-upper" style={{ marginBottom: 10 }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 42,
        color: color || 'var(--text-primary)', lineHeight: 1, letterSpacing: 1,
      }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{sub}</div>}
    </div>
  )
}

function EkipmanRow({ keyName, data }) {
  const type = EQUIPMENT_TYPES[keyName]
  const pct = data.toplam > 0 ? (data.verildi / data.toplam) * 100 : 0

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '180px 1fr 72px 72px 72px 72px',
      alignItems: 'center', gap: 16,
      padding: '13px 0',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      {/* Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          fontSize: 22, width: 32, textAlign: 'center',
          opacity: data.verildi > 0 ? 1 : 0.35,
        }}>{type.icon}</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{type.label}</div>
          <div style={{
            fontFamily: 'var(--font-condensed)', fontSize: 10, fontWeight: 700,
            letterSpacing: 1.5, textTransform: 'uppercase',
            color: type.category === 'is' ? 'var(--amber-400)' : 'var(--blue)',
          }}>{type.category === 'is' ? 'İş' : 'Ev'}</div>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{data.verildi} / {data.toplam}</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{Math.round(pct)}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%`, background: type.category === 'is' ? 'var(--amber-400)' : 'var(--blue)' }} />
        </div>
      </div>

      {/* Cols */}
      <Metric v={data.stokta}     label="STOKTA"    color="var(--text-secondary)" />
      <Metric v={data.verildi}    label="VERİLDİ"   color="var(--blue)" />
      <Metric v={data.odemeKesik} label="ÖD.KESİK"  color="var(--green)" />
      <Metric v={data.iadeGerekli} label="İADE"     color={data.iadeGerekli > 0 ? 'var(--amber-400)' : 'var(--text-muted)'} />
    </div>
  )
}

function Metric({ v, label, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color, lineHeight: 1, letterSpacing: 0.5 }}>{v}</div>
      <div className="label-upper" style={{ marginTop: 3, fontSize: 9 }}>{label}</div>
    </div>
  )
}

function Alert({ icon, title, sub, color, borderColor }) {
  return (
    <div style={{
      flex: 1, display: 'flex', gap: 12, alignItems: 'flex-start',
      padding: '12px 16px', borderRadius: 'var(--r-md)',
      background: `rgba(${color},0.07)`,
      border: `1px solid rgba(${color},0.2)`,
    }}>
      <span style={{ fontSize: 18, marginTop: 1 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: `rgb(${color})` }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>
      </div>
    </div>
  )
}

export default function Dashboard({ stats, employees }) {
  const bekleyenImza = employees.filter(e =>
    Object.values(e.zimmet).some(z => z.var && !z.imzali)
  ).length
  const eksikEkipman = employees.filter(e =>
    e.durum === 'aktif' && Object.values(e.zimmet).some(z => !z.var)
  ).length
  const iadeTopla = Object.values(stats.ekipman).reduce((s, e) => s + e.iadeGerekli, 0)

  return (
    <div className="animate-in page">
      {/* Page header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div className="label-upper" style={{ marginBottom: 6 }}>
            {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: 1.5, lineHeight: 1 }}>
            GENEL BAKIŞ
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-condensed)', letterSpacing: 1 }}>
            CANLI
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid-stats" style={{ marginBottom: 20 }}>
        <StatCard label="Aktif Çalışan"   value={stats.aktif}   sub={`${stats.cikti} işten ayrıldı`}  color="var(--amber-400)" />
        <StatCard label="Toplam Stok"     value={Object.values(stats.ekipman).reduce((s,e)=>s+e.toplam,0)} sub="7 ekipman türü" color="var(--text-primary)" />
        <StatCard label="İmza Bekliyor"   value={bekleyenImza}  sub="çalışan"  color={bekleyenImza > 0 ? 'var(--amber-400)' : 'var(--green)'} />
        <StatCard label="İade Bekleyen"   value={iadeTopla}     sub="ekipman"  color={iadeTopla > 0 ? 'var(--red)' : 'var(--green)'} />
      </div>

      {/* Alerts */}
      {(bekleyenImza > 0 || eksikEkipman > 0) && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          {bekleyenImza > 0 && (
            <Alert icon="⚠️" color="245,166,35"
              title={`${bekleyenImza} çalışanın imzalanmamış zimmet belgesi var`}
              sub="Plan4Flex üzerinden dijital onay alınmalı" />
          )}
          {eksikEkipman > 0 && (
            <Alert icon="ℹ️" color="56,189,248"
              title={`${eksikEkipman} aktif çalışanın eksik ekipmanı var`}
              sub="Zimmet sayfasından teslim işlemi yapın" />
          )}
        </div>
      )}

      {/* Equipment summary table */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 1 }}>EKİPMAN ÖZETİ</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <LegendDot color="var(--amber-400)" label="İş" />
            <LegendDot color="var(--blue)" label="Ev" />
          </div>
        </div>

        <div className="scroll-x">
          <div style={{ minWidth: 600 }}>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr 72px 72px 72px 72px',
              gap: 16, paddingBottom: 10,
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              {['EKİPMAN', 'DAĞILIM', 'STOKTA', 'VERİLDİ', 'ÖD.KESİK', 'İADE'].map(h => (
                <div key={h} className="label-upper" style={{ fontSize: 9, textAlign: h !== 'EKİPMAN' && h !== 'DAĞILIM' ? 'center' : 'left' }}>{h}</div>
              ))}
            </div>
            {Object.entries(stats.ekipman).map(([k, v]) => (
              <EkipmanRow key={k} keyName={k} data={v} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function LegendDot({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
      <span className="label-upper" style={{ fontSize: 10 }}>{label}</span>
    </div>
  )
}

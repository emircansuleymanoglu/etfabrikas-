import React from 'react'
import { EQUIPMENT_TYPES } from '../data/mockData.js'

function StatCard({ label, value, sub, color }) {
  return (
    <div className="card" style={{ padding: '18px 20px' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{label}</div>
      <div className="stat-val" style={{ color: color || 'var(--text-1)' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 5 }}>{sub}</div>}
    </div>
  )
}

function EkipmanRow({ keyName, data }) {
  const type = EQUIPMENT_TYPES[keyName]
  const pct = data.toplam > 0 ? (data.verildi / data.toplam) * 100 : 0
  const barColor = type.category === 'is' ? 'var(--text-1)' : '#71717A'
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '180px 1fr 68px 68px 68px 68px',
      alignItems: 'center', gap: 16,
      padding: '12px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 20, opacity: data.verildi > 0 ? 1 : 0.4 }}>{type.icon}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{type.label}</div>
          <div style={{ fontSize: 11, color: type.category === 'is' ? 'var(--text-1)' : 'var(--text-3)', fontWeight: 500 }}>
            {type.category === 'is' ? 'İş' : 'Ev'}
          </div>
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{data.verildi} / {data.toplam}</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{Math.round(pct)}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%`, background: barColor }} />
        </div>
      </div>
      <Col v={data.stokta}      label="Stokta"   c="var(--text-1)" />
      <Col v={data.verildi}     label="Verildi"  c="var(--text-1)" />
      <Col v={data.odemeKesik}  label="Öd.Kesik" c={data.odemeKesik > 0 ? 'var(--green)' : 'var(--text-3)'} />
      <Col v={data.iadeGerekli} label="İade"     c={data.iadeGerekli > 0 ? 'var(--amber)' : 'var(--text-3)'} />
    </div>
  )
}

function Col({ v, label, c }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: c, letterSpacing: -0.5 }}>{v}</div>
      <div style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 500, marginTop: 1 }}>{label}</div>
    </div>
  )
}

export default function Dashboard({ stats, employees }) {
  const bekleyenImza = employees.filter(e => Object.values(e.zimmet).some(z => z.var && !z.imzali)).length
  const iadeTopla = Object.values(stats.ekipman).reduce((s, e) => s + e.iadeGerekli, 0)
  const eksik = employees.filter(e => e.durum === 'aktif' && Object.values(e.zimmet).some(z => !z.var)).length

  return (
    <div className="animate-in page">
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500, marginBottom: 4 }}>
          {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>Genel Bakış</h1>
      </div>

      <div className="grid-stats" style={{ marginBottom: 16 }}>
        <StatCard label="Aktif Çalışan"  value={stats.aktif}  sub={`${stats.cikti} işten ayrıldı`} />
        <StatCard label="Toplam Stok"    value={Object.values(stats.ekipman).reduce((s,e)=>s+e.toplam,0)} sub="7 ekipman türü" />
        <StatCard label="İmza Bekliyor"  value={bekleyenImza} sub="çalışan" color={bekleyenImza > 0 ? 'var(--amber)' : 'var(--green)'} />
        <StatCard label="İade Bekleyen"  value={iadeTopla}    sub="ekipman" color={iadeTopla > 0 ? 'var(--red)' : 'var(--green)'} />
      </div>

      {(bekleyenImza > 0 || eksik > 0) && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          {bekleyenImza > 0 && <Alert color="amber" icon="⚠️" text={`${bekleyenImza} çalışanın imzalanmamış zimmet belgesi var — Plan4Flex üzerinden onay alınmalı`} />}
          {eksik > 0 && <Alert color="blue" icon="ℹ️" text={`${eksik} aktif çalışanın eksik ekipmanı var`} />}
        </div>
      )}

      <div className="card" style={{ padding: '18px 20px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Ekipman Özeti</div>
        <div className="scroll-x">
          <div style={{ minWidth: 580 }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '180px 1fr 68px 68px 68px 68px',
              gap: 16, paddingBottom: 10, borderBottom: '1px solid var(--border)',
            }}>
              {['Ekipman','Dağılım','Stokta','Verildi','Öd.Kesik','İade'].map(h => (
                <div key={h} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textAlign: h !== 'Ekipman' && h !== 'Dağılım' ? 'center' : 'left' }}>{h}</div>
              ))}
            </div>
            {Object.entries(stats.ekipman).map(([k, v]) => <EkipmanRow key={k} keyName={k} data={v} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

function Alert({ color, icon, text }) {
  const colors = {
    amber: { bg: 'var(--amber-bg)', border: 'var(--amber-border)', text: 'var(--amber)' },
    blue:  { bg: 'var(--blue-bg)',  border: 'var(--blue-border)',  text: 'var(--blue)' },
  }
  const c = colors[color]
  return (
    <div style={{
      flex: 1, minWidth: 240, display: 'flex', gap: 10, alignItems: 'flex-start',
      padding: '10px 14px', borderRadius: 'var(--r-md)',
      background: c.bg, border: `1px solid ${c.border}`,
    }}>
      <span style={{ fontSize: 14, marginTop: 1 }}>{icon}</span>
      <span style={{ fontSize: 13, color: c.text, fontWeight: 500 }}>{text}</span>
    </div>
  )
}

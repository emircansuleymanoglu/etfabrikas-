import React from 'react'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Employees from './pages/Employees.jsx'
import Stok from './pages/Stok.jsx'
import Odalar from './pages/Odalar.jsx'
import Iade from './pages/Iade.jsx'
import { useStore } from './hooks/useStore.js'

export default function App() {
  const store = useStore()

  const pages = {
    dashboard: <Dashboard stats={store.stats} employees={store.employees} setPage={store.setPage} />,
    employees: <Employees employees={store.employees} updateZimmet={store.updateZimmet} terminateEmployee={store.terminateEmployee} addEmployee={store.addEmployee} />,
    stok:      <Stok stats={store.stats} employees={store.employees} />,
    odalar:    <Odalar employees={store.employees} />,
    iade:      <Iade employees={store.employees} updateZimmet={store.updateZimmet} />,
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar page={store.page} setPage={store.setPage} stats={store.stats} />
      <main style={{ marginLeft: 220, flex: 1, minHeight: '100vh', background: 'var(--bg)' }}>
        {pages[store.page] || pages.dashboard}
      </main>
    </div>
  )
}

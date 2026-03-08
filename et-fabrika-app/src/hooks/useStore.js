import { useState, useCallback } from 'react'
import { initialEmployees, STOK, EQUIPMENT_TYPES } from '../data/mockData.js'

export function useStore() {
  const [employees, setEmployees] = useState(initialEmployees)
  const [page, setPage] = useState('dashboard')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [modal, setModal] = useState(null) // { type, data }

  // Hesaplamalar
  const stats = (() => {
    const aktif = employees.filter(e => e.durum === 'aktif')
    const cikti = employees.filter(e => e.durum === 'cikti')

    const result = {}
    Object.keys(EQUIPMENT_TYPES).forEach(key => {
      const verildi = employees.filter(e => e.zimmet[key]?.var).length
      const imzali = employees.filter(e => e.zimmet[key]?.imzali).length
      const odemeKesik = employees.filter(e => e.zimmet[key]?.odemeKesik).length
      const iadeGerekli = employees.filter(e => e.zimmet[key]?.iadeGerekli && e.durum === 'cikti').length
      const stokta = (STOK[key]?.toplam || 0) - verildi

      result[key] = { verildi, imzali, odemeKesik, iadeGerekli, stokta, toplam: STOK[key]?.toplam || 0 }
    })

    return { aktif: aktif.length, cikti: cikti.length, toplam: employees.length, ekipman: result }
  })()

  const addEmployee = useCallback((emp) => {
    const newEmp = {
      id: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      ...emp,
      durum: 'aktif',
      zimmet: Object.fromEntries(
        Object.keys(EQUIPMENT_TYPES).map(k => [k, { var: false, imzali: false, odemeKesik: false, tarih: null }])
      )
    }
    setEmployees(prev => [...prev, newEmp])
    return newEmp
  }, [employees.length])

  const updateZimmet = useCallback((empId, key, field, value) => {
    setEmployees(prev => prev.map(e => {
      if (e.id !== empId) return e
      return {
        ...e,
        zimmet: {
          ...e.zimmet,
          [key]: { ...e.zimmet[key], [field]: value, tarih: value && !e.zimmet[key].tarih ? new Date().toISOString().split('T')[0] : e.zimmet[key].tarih }
        }
      }
    }))
  }, [])

  const terminateEmployee = useCallback((empId) => {
    setEmployees(prev => prev.map(e => {
      if (e.id !== empId) return e
      const newZimmet = {}
      Object.keys(e.zimmet).forEach(k => {
        newZimmet[k] = {
          ...e.zimmet[k],
          iadeGerekli: e.zimmet[k].var && EQUIPMENT_TYPES[k].category === 'is'
        }
      })
      return { ...e, durum: 'cikti', oda: null, zimmet: newZimmet }
    }))
  }, [])

  return {
    employees, setEmployees,
    page, setPage,
    selectedEmployee, setSelectedEmployee,
    modal, setModal,
    stats,
    addEmployee,
    updateZimmet,
    terminateEmployee
  }
}

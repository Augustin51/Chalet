'use client'
import { createContext, useContext, ReactNode } from 'react'

export const AdminContext = createContext(false)

export default function AdminProvider({
  isAdmin,
  children,
}: {
  isAdmin: boolean
  children: ReactNode
}) {
  return (
    <AdminContext.Provider value={isAdmin}>
      {children}
    </AdminContext.Provider>
  )
}

// Hook pratique pour les composants
export const useAdmin = () => useContext(AdminContext)

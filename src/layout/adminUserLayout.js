import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminUserLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default AdminUserLayout

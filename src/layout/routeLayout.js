import React from 'react'
import { Outlet } from 'react-router-dom'

const RoutesLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default RoutesLayout

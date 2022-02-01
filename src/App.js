import "regenerator-runtime/runtime"
import React, { useEffect, useState } from "react"
import "./global.css"
import "./scss/AppStyles.scss"
import bootstrap from "bootstrap"
import Home from "./screens/Home"
import Search from "./screens/Search"
import Mint from "./screens/Mint"

import { BrowserRouter, Routes, Route } from "react-router-dom"
import MyNavbar from "./components/Navbar"
import NeedToLogin from "./screens/needToLogin"
import AccountInfo from "./screens/AccountInfo"
import Sell from "./screens/Sell"
import "./global.css"
import NotificationScreen from "./screens/NotificationScreen"

import getConfig from "./config"
import Dashboard from "./screens/Dashboard"
import Sidebar from "./components/Sidebar"

const { networkId } = getConfig(process.env.NODE_ENV || "development")

export default function App() {
  const [sidebar, setSidebar] = useState(<Sidebar />)

  useEffect(() => {
    if (window.location.pathname == "/login") {
      setSidebar()
    }
  }, [])

  return (
    <BrowserRouter>
      {sidebar}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<NeedToLogin />} />
        <Route path="/AccountInfo" element={<AccountInfo />} />
        <Route path="/Sell" element={<Sell />} />
        <Route path="/Search" element={<Search />} />
        <Route path="/Mint" element={<Mint />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Notifications" element={<NotificationScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

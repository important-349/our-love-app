import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Admin from './pages/Admin'

function App() {
  const [role, setRole] = useState(null) // 'you' or 'her', null = not logged in

  if (!role) {
    return <Login onLogin={setRole} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home role={role} />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
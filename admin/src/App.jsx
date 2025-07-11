import React from 'react'
import { Route, Routes  } from 'react-router-dom'
import Navbar from './components/Navbar'
import Additems from './components/Additems'
import List from './components/List'
import Orders from './components/Order'


const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Additems/>} />
        <Route path='/list' element={<List/>} />
        <Route path='/orders' element={<Orders/>} />
       </Routes>
    </>
  )
}

export default App
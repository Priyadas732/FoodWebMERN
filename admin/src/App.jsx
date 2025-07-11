import React from 'react'
import { Route, Routes  } from 'react-router-dom'
import Additems from './components/AddItems'
import List from './components/List'
import Orders from './components/Order'
import Navbar from './components/Navbar'


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
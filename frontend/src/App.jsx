import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <>
    <Navbar></Navbar>
    <div className='absolute top-0, left-0 w-full mt-6 border-2 border-black h-[40rem] flex justify-evenly space-x-4 items-center'>
      <div className="flex-col">
      <p>placeholder</p>
      <p>placeholder</p>
      </div>
      <div className="flex-col">
      <p>placeholder</p>
      <p>placeholder</p>
      </div>
    </div>
    </>
  )
}

export default App

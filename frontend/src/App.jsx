
import Navbar from './components/Navbar'
import Button from './components/Button'

import Joystick from './components/Joystick'
function App() {
  return (
    <>
      <Navbar></Navbar>

      <div className=" w-screen h-[50vh] bg-white flex justify-evenly items-center">
        <div className='flex'>
          <Joystick></Joystick>
        </div>
        <div className='flex-col space-y-4'>
        <Button></Button>
        <Button></Button>
        </div>
      </div>

      <div className="w-screen h-[50vh] bg-slate-100">

      </div>
    </>
  )
}

export default App

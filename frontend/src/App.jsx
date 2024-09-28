import Navbar from './components/Navbar'
import Button from './components/Button'
import Joystick from './components/Joystick'
import Key from './components/Key'

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

      <div className="items-center grid grid-cols-6 justify-center w-screen h-[50vh] bg-slate-100 space-x">
        <Key></Key>
        <Key></Key>
        <Key></Key>
        <Key></Key>
        <Key></Key>
        <Key></Key>
        <Key></Key>
        <Key></Key>
        <Key></Key>
        <Key></Key>
        <Key></Key>
        <Key></Key>
        <Key></Key>
        <Key></Key>
        
      </div>
    </>
  )
}

export default App

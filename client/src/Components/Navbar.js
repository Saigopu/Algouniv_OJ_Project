import React from 'react'
import { useNavigate } from 'react-router-dom';
import LogOut from './LogOut';

function Navbar({onLogout}) {
    const navigate=useNavigate();
  return (
    <div className='flex gap-7'>
        <button onClick={()=>navigate("/problemList")}>problemList</button>
        <button onClick={()=>navigate("/editor")}>editor</button>
        <LogOut onLogout={onLogout}/>
    </div>
  )
}

export default Navbar;
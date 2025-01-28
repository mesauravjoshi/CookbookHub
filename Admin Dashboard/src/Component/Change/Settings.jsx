import React, { useState, useEffect, useRef } from 'react'
import Header from '../Header'
import Sidebar from '../Sidebar'
import './Recipe.css'

function Settings() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds === 59) {
          setMinutes(prevMinutes => {
            if (prevMinutes === 59) {
              setHours(prevHours => prevHours + 1); // Increment hour if minutes reach 59
            }
            return (prevMinutes + 1) % 60; // Reset minutes to 0 after 59
          });
          return 0; // Reset seconds after 59
        } else {
          return prevSeconds + 1;
        }
      });
    }, 1000);  // Update every 1 second

    // Cleanup function to clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      {/* <div>
        <h1>Race time</h1> <br />
        <div style={{ display: 'flex', gap: "2em" }} className='time'>
          <h1>
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
            {String(seconds).padStart(2, '0')}
          </h1>
        </div>
      </div> */}
    </>
  )
}

export default Settings
import React, { useState, useEffect, useRef } from 'react'
import './Setting.css'

function Settings() {

  // const [otp, setOtp] = useState(['', '', '', '']);

  // const handleChange = (e, index) => {
  //   const value = (e.target.value);
    

  //   if (value.length <= 1) {
      
  //     // const value = Number(e.target.value);
  //     setOtp((prevOtp) => {
  //       const newOtp = [...prevOtp];
  //       newOtp[index] = value;
  //       return newOtp;
  //     });
  //   }
  //   if (value && index < 3) {
  //     document.getElementById(`otp-${index + 1}`).focus();
  //   }
  //   if (value === "" && index > 0) {
  //     document.getElementById(`otp-${index - 1}`).focus();
  //   }

  // }

  // const handleSubmit = (e) => {
  //   e.preventDefault()
  // }

  // const handlePaste = (e) => {
  //   // e.preventDefault(); 
  //   const data = e.clipboardData.getData("text"); 
  //   console.log(data.length);

  //   if( Number(data) || data.length === 4){
  //     const pasteCode =data.split('');
  //     console.log(pasteCode);
  //     setOtp([...pasteCode])
  //       document.getElementById(`otp-3`).focus();     
  //   }
  // }

  return (
    <>
      {/* <div>
        <h1>OTP</h1>
        <form action="" onSubmit={handleSubmit}>
          <div className='otp'>
            {
              otp.map((item, index) => (
                <input type="text"
                // type="text" // Change to "text" so maxLength works properly
                  id={`otp-${index}`}
                  key={index}
                  maxLength="1"
                  value={item}
                  onChange={(e) => handleChange(e, index)}
                  onPaste={handlePaste}
                  required={true}
                />
              ))
            }
          </div>
          <button > Submit</button>
        </form>
      </div> */}
    </>
  )
}

export default Settings
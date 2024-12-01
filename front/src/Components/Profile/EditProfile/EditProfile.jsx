import React, { useEffect, useState } from 'react';
import { Link, useParams,useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import './EditProfile.css'

function EditProfile() {
  // const [setDark, setsetDark] = useState(second)
  const setDarkMode = () => {
    document.querySelector('body').setAttribute('data-theme', 'dark');
  };

  const setLightMode = () => {
    document.querySelector('body').setAttribute('data-theme', 'light');
  };
  
  const toggelTheme = (e) => {
    if(e.target.checked) setDarkMode();
    else setLightMode();
  };

  return (
    <>
    <div className='test-dark'>
        <input 
          className='dark_mode_input'
          type="checkbox"
          id='darkmode_toggle' 
          onChange={toggelTheme}
        />
        {/* <label className='dark_mode_label' for="darkmode_toggle">
          dark 
          light
        </label> */}
        <br />
        Edit profile Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint a ex reprehenderit, molestiae, quasi illo nisi, quaerat magni porro placeat totam sit quia.
    </div>
    </>
  );
}

export default EditProfile;
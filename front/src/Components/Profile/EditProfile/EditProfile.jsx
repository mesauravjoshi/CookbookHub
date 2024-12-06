import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import './EditProfile.css'

function EditProfile() {

  return (
    <>
      <div className='edit-profile'>
        <h2>My Profile</h2>
        <h3>
          Update Personal Information:
        </h3>
        <h3>
        Change Preferences:
        </h3>
        <h3>
        Privacy Settings:
        </h3>
        <h3>
        Delete Account:
        </h3>
      </div>
    </>
  );
}

export default EditProfile;
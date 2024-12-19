import React, { useEffect, useState } from 'react';
import { useUser } from '../../UserContext';
import Nav from '../../Nav/Nav';
import './EditProfile.css'
import DeleteAccount from './DeleteAccount/DeleteAccount';
import UpdatePersonal from './Update Personal Info/UpdatePersonal';
import PageNotFound from '../../PageNotFound/PageNotFound';
import PrivacySettings from './PrivacySettings';
import ChangePreferences from './Change Preferences/ChangePreferences';

function EditProfile() {
  const { user,setUser } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isSelected, setIsSelected] = useState(0);
  // console.log(user);
  const accountSettingList = [
    'Update Personal Information:',
    'Change Preferences:',
    'Privacy Settings:',
    'Delete Account:'
  ];
  // console.log(user);
  
  const ShowSetting = ({ index }) => {
    switch (index) {
      case 0: return <UpdatePersonal user={user} setUser={setUser} />
        break;
      case 1: return <ChangePreferences/>
        break;
      case 2: return <PrivacySettings/>
        break;
      case 3: return <DeleteAccount />
        break;
      default:
        break;
    }
  }

  return (
    <>
    <Nav isLoggedIn={isLoggedIn} user={user} />
    {
      user ?
      <> 
      <h2>My Profile</h2>
      <p>{user.name}</p>
      <div className='edit-profile'>
        <div className="left-slide">

          {
            accountSettingList.map((item, index) => {
              return (
                <div key={index}>
                  <p
                    className={isSelected == index ? 'selected' : 'notSelected'}
                    onClick={() => setIsSelected(index)}
                  >
                    {item}
                  </p>
                </div>
              )
            })
          }
        </div>
        <div className="right-box">
          <>
            <ShowSetting index={isSelected} />
          </>
        </div>

      </div>
      </>
      :
      <PageNotFound/>
    }
    </>
  );
}

export default EditProfile;
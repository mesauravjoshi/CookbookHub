import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { url } from '../../ApiUrl/Url';
import { useUser } from '../../UserContext';
import './EditProfile.css'
import DeleteAccount from './DeleteAccount/DeleteAccount';
import UpdatePersonal from './Update Personal Info/UpdatePersonal';
import PageNotFound from '../../PageNotFound/PageNotFound';

function EditProfile() {
  const { user } = useUser();
  const [isSelected, setIsSelected] = useState(0);

  const accountSettingList = [
    'Update Personal Information:',
    'Change Preferences:',
    'Privacy Settings:',
    'Delete Account:'
  ];

  const ShowSetting = ({ index }) => {
    switch (index) {
      case 0: return <UpdatePersonal />
        break;
      case 1: return <UpdatePersonal />
        break;
      case 2: return <UpdatePersonal />
        break;
      case 3: return <DeleteAccount />
        break;
      default:
        break;
    }
  }

  return (
    <>
    {
      user ?
      <> 
      <h2>My Profile</h2>
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
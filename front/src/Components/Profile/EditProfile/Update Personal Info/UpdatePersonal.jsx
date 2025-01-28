import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import './UpdatePersonal.css'
import { url } from '../../../ApiUrl/Url';
import toast, { Toaster } from 'react-hot-toast';

function UpdatePersonal({ user, setUser }) {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const navigate = useNavigate();
    const token = localStorage.getItem('token');  // Get token from localStorage
    const userData = JSON.parse(atob(token.split('.')[1]));

    const notifyNameChange = () => {
        toast.success('Your Name Successfully changed!', {
            duration: 5000,
            position: "top-right",
            style: {
                border: '1px solid #713200',
                padding: '10px',
                color: '#713200',
                fontSize: '0.9rem',
            },
        });
    };

    const notifyUsernameChange = () => {
        toast.error('User already exists!', {
            duration: 2000,
            position: "top-right",
            style: {
                border: '1px solid #713200',
                padding: '10px',
                color: '#713200',
                fontSize: '0.9rem',
            },
        });
    };

    useEffect(() => {
        // console.log(userData.name);
        setName(userData.name)
    }, [token]);

    const handleSaveName = async (e) => {

        e.preventDefault();
        // console.log('Updated Name:', name);
        try {
            const response = await fetch(`${url}/update_UserInfo/name`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name }) // Send name wrapped in an object
            });

            if (!response.ok) {
                throw new Error('Failed to update name');
            }

            const data = await response.json();
            console.log('Updated data:', data);

            // remove previous data from local storage 
            localStorage.removeItem('token')
            localStorage.removeItem('name')

            // updating new data to local storage 
            localStorage.setItem('token', data.token);
            localStorage.setItem('name', data.updatedName);
            setUser(prevObj => ({
                ...prevObj,
                name: data.updatedName
            }))

            setTimeout(() => {
                notifyNameChange();
            }, 500);
        } catch (error) {
            console.error('Error updating name:', error);
        }
    };

    const handleNameChange = (e) => {
        setName(e.target.value)
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }

    const handleSaveUsername = async (e) => {
        e.preventDefault();
        // notify()
        try {
            const response = await fetch(`${url}/update_UserInfo/username`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username }) // Send name wrapped in an object
            });

            // if (!response.ok) {
            //     throw new Error('Failed to update username');
            // }

            const data = await response.json();
            if (data.message && data.token && data.updatedUsername) {
                // console.log('yes', data.updatedUsername);
                // remove previous data from local storage 
                localStorage.removeItem('token')

                // updating new data to local storage 
                localStorage.setItem('token', data.token);
                setUser(prevObj => ({
                    ...prevObj,
                    username: data.updatedUsername
                }))

                setTimeout(() => {
                    notifyNameChange();
                }, 500);
            } else {
                notifyUsernameChange();
                console.log('Updated data:', data);
            }

        } catch (error) {
            console.error('Error updating username:', error);
            // alert("Failed to update name");
        }
        setUsername('')
    }

    return (
        <div>
            <h1>Update Personal Information:</h1>
            <br />
            <h2>Change name:</h2>
            <Form onSubmit={handleSaveName}>
                <span className='update-name'>

                </span>
                <Form.Control size="lg" value={name} onChange={handleNameChange} type="text" name='Username' placeholder='Name' required />
                <div className="update-name-button">
                    <button type="submit" className="btn btn-outline-success">Update Name</button>
                </div>
            </Form>

            <hr style={{ border: '1px solid white' }} />
            <br />
            <h2>Change username:</h2>
            <Form onSubmit={handleSaveUsername}>
                <span className='confirn-username'>
                    Username should be unique
                </span>
                <Form.Control size="lg" value={username} onChange={handleUsernameChange} type="text" name='Username' placeholder='Username' required
                // disabled={true} 
                />
                <div className="update-name-button">
                    <button type='submit' className="btn btn-outline-success"
                    // disabled={true}
                    >Update Username</button>
                </div>
            </Form>
            <Toaster />
        </div>
    )
}

export default UpdatePersonal
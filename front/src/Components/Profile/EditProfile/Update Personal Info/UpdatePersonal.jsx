import React, { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form';
import './UpdatePersonal.css'
import { url } from '../../../ApiUrl/Url';

function UpdatePersonal() {

    const [name, setName] = useState('')

    const token = localStorage.getItem('token');  // Get token from localStorage
    const userData = JSON.parse(atob(token.split('.')[1]));
    useEffect(() => {
        console.log(userData.name);
        setName(userData.name)
    }, []);

    const handleSaveName = async (e) => {
        e.preventDefault();
        console.log('Updated Name:', name);
    
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
    
            const updatedUser = await response.json();
            console.log('Updated user:', updatedUser);
            
            // Redirect or display success notification here
            // alert("Name updated successfully");
            navigate('/profile');  // Example: navigate to the profile page
        } catch (error) {
            console.error('Error updating name:', error);
            // alert("Failed to update name");
        }
    };
    

    const handleNameChange = (e) => {
        setName(e.target.value)
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
            <Form>
                <span className='confirn-username'>
                    Username should be unique
                </span>
                <Form.Control size="lg" type="text" name='Username' placeholder='Username' required />
                <div className="update-name-button">
                    <button type="button" className="btn btn-outline-success">Update Username</button>
                </div>
            </Form>
        </div>
    )
}

export default UpdatePersonal
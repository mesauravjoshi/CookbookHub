import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { url } from '../../../ApiUrl/Url';
import './DeleteAccount.css'
import Form from 'react-bootstrap/Form';
import toast, { Toaster } from 'react-hot-toast';

function DeleteAccount() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [isDeleted, setIsDeleted] = useState(false);  // Track if account is deleted

    const notify = () => {
        toast.success('Your Account Successfully Deleted!', {
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

    const notifyFail = (error) => {
        toast.error(`${error}`, {
            duration: 1500,
            position: "top-right",
            style: {
                border: '1px solid #713200',
                padding: '10px',
                color: '#713200',
                fontSize: '0.9rem',
            },
        });
    };

    const handleForm = (e) => {
        const { name, value } = e.target;
        if (name === 'Username') setUsername(value);
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const formData = { 'username': username }

        try {
            const response = await fetch(`${url}/delete_account/delete`, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                notify();
                setUsername('');
                setIsDeleted(true);  // Set the state to true once the account is deleted
                setTimeout(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('name');
                    navigate('/');
                    window.location.reload();
                }, 2000);
            } else {
                const errorResponse = await response.json();
                console.error('Error deleting account:', errorResponse.message);
                notifyFail(errorResponse.message);
            }
        } catch (error) {
            console.error('Error:', error);
            notifyFail(error);
        }
    }

    return (
        <div>
            <p>Back</p>
            <h2>Delete Account:</h2>
            <Form onSubmit={handleDeleteAccount} >
                <span className='confirn-username'>
                    Please confirm your account by entering username
                </span>
                <Form.Control size="lg" type="text" name='Username' onChange={handleForm} value={username} placeholder='Username' required />
                <p>Once you delete your account, there is no going back. Please be certain.</p>
                <div className="upload-button">
                    <button>Delete Your Account</button>
                </div>
            </Form>

            {/* Render Toaster only after the account is deleted */}
            {isDeleted && <Toaster />} 

        </div>
    );
}

export default DeleteAccount;

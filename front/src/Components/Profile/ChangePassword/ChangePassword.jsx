import React, { useState } from 'react';

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePass = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("New passwords don't match");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('No token found. Please log in again.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/auth/changePassword', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message); // Success message
            } else {
                alert('yyyyyyyyyyyy',data.message); // Error message
                console.log('line 37 ');

            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert('An error occurred. Please try again.');
        }
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
    };

    return (
        <div className="login-page">
            <center><h3>Change Password</h3></center>
            <div className="form">
                <form onSubmit={handleChangePass} className="login-form">
                    <input
                        type="text"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Change Password</button>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;

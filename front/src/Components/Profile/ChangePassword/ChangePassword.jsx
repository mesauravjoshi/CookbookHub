import React, { useState } from 'react';

function ChangePassword() {
    const [isOldPasswordCoreect, setIsOldPasswordCoreect] = useState(true);
    const [isNewAndConfirmMatch, setIsNewAndConfirmMatch] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const checkPasswordCorrect = async (token) => {
 
        const response = await fetch('http://localhost:3000/auth/checkPasswordCorrect', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ oldPassword }),
        });
        const data = await response.json();
        console.log(data);
        return data.message; // Assume backend returns { exists: true/false }
    }

    const handleChangePass = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            alert('No token found. Please log in again.');
            return;
        }

        const passwordCorrect = await checkPasswordCorrect(token);
        console.log(passwordCorrect)
        if (!passwordCorrect) {
            console.log('password galat hai bhai');
            setIsOldPasswordCoreect(false); // Display email already registered error
            setIsPasswordValid(false); // Ensure password error is cleared if username check fails
            return;
        }
        setIsOldPasswordCoreect(true)

        if (!validatePassword(newPassword)) {
            setIsPasswordValid(true); // Set password validation error
            return;
        }
        setIsPasswordValid(false)

        if (newPassword !== confirmPassword) {
            setIsNewAndConfirmMatch(false)
            // alert("New passwords don't match");
            return;
        }
        setIsNewAndConfirmMatch(true)
        // Qwerty@123
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
                alert('yyyyyyyyyyyy', data.message); // Error message
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
                    {!isOldPasswordCoreect && (
                        <small id="emailHelp" className="form-text text-muted">
                            Incorrect passowrd
                        </small>
                    )}
                    {!isNewAndConfirmMatch && (
                        <small id="emailHelp" className="form-text text-muted">
                            New and Confirm pass does't match
                        </small>
                    )}
                    {isPasswordValid && (
                        <small id="emailHelp" className="form-text text-muted">
                            Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character
                        </small>
                    )}
                    <button type="submit">Change Password</button>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;

import React, { useState } from 'react';
import { url } from '../../ApiUrl/Url';
import toast, { Toaster } from 'react-hot-toast';

import './ChangePassword..css';

function ChangePassword() {
    const [isOldPasswordCoreect, setIsOldPasswordCoreect] = useState(true);
    const [isNewAndConfirmMatch, setIsNewAndConfirmMatch] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Separate state for password visibility of each input
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const notify = () => {
        toast.success('Password Changed Successfully!', {
            duration: 3000,
            position: "top-right",
            style: {
                border: '1px solid #713200',
                padding: '10px',
                color: '#713200',
                fontSize: '0.9rem',
            },
        });
    };

    const notifyIncoreectPass = () => {
        toast.error('Incorrect password', {
            duration: 2000,
            position: "top-right",
            style: {
                padding: '10px',
                fontSize: '0.9rem',
            },
        });
    };

    const notifyConfirnNotMatch = () => {
        toast.error(`New Password and Confirm Password doesn't match`, {
            duration: 2000,
            position: "top-right",
            style: {
                padding: '10px',
                fontSize: '0.9rem',
            },
        });
    };

    const notifyValid = () => {
        toast.error( `Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character!`, {
            duration: 4000,
            position: "top-right",
            style: {
                border: '1px solid #713200',
                padding: '10px',
                color: '#713200',
                fontSize: '0.9rem',
            },
        });
    };

    const notifyError = (error) => {
        toast.error( `${error}!`, {
            duration: 4000,
            position: "top-right",
            style: {
                border: '1px solid #713200',
                padding: '10px',
                color: '#713200',
                fontSize: '0.9rem',
            },
        });
    };

    const checkPasswordCorrect = async (token) => {
        const response = await fetch(`${url}/auth/checkPasswordCorrect`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ oldPassword }),
        });
        const data = await response.json();
        return data.message; // Assume backend returns { exists: true/false }
    };

    const handleChangePass = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }

        const passwordCorrect = await checkPasswordCorrect(token);
        if (!passwordCorrect) {
            setIsOldPasswordCoreect(false); // Display email already registered error
            notifyIncoreectPass();
            setIsPasswordValid(false); // Ensure password error is cleared if username check fails
            return;
        }
        setIsOldPasswordCoreect(true);

        if (!validatePassword(newPassword)) {
            setIsPasswordValid(true); // Set password validation error
            notifyValid();
            return;
        }
        setIsPasswordValid(false);

        if (newPassword !== confirmPassword) {
            setIsNewAndConfirmMatch(false);
            notifyConfirnNotMatch();
            return;
        }
        setIsNewAndConfirmMatch(true);

        try {
            const response = await fetch(`${url}/auth/changePassword`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const data = await response.json();
            if (response.ok) {
                notify();
            } else {
                notifyError(data);
            }
        } catch (error) {
            console.error('Error changing password:', error);
            notifyError(error);
        }

        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const togglePasswordVisibility = (field) => {
        if (field === 'old') {
            setShowOldPassword((prev) => !prev);
        } else if (field === 'new') {
            setShowNewPassword((prev) => !prev);
        } else if (field === 'confirm') {
            setShowConfirmPassword((prev) => !prev);
        }
    };

    return (
        <div className="login-page">
            <center><h3>Change Password</h3></center>
            <div className="form">
                <form onSubmit={handleChangePass} className="login-form">
                    {/* old password */}
                    <div className="password-container">
                        <input
                            placeholder="Old Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            name="password"
                            type={showOldPassword ? 'text' : 'password'}
                            required
                        />
                        <span onClick={() => togglePasswordVisibility('old')} className="eye-icon">
                            {showOldPassword ? '👁️' : '👁️‍🗨️'}
                        </span>
                    </div>
                    {/* new password */}
                    <div className="password-container">
                        <input
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            name="password"
                            type={showNewPassword ? 'text' : 'password'}
                            required
                        />
                        <span onClick={() => togglePasswordVisibility('new')} className="eye-icon">
                            {showNewPassword ? '👁️' : '👁️‍🗨️'}
                        </span>
                    </div>
                    {/* confirm password */}
                    <div className="password-container">
                        <input
                            name="password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <span onClick={() => togglePasswordVisibility('confirm')} className="eye-icon">
                            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                        </span>
                    </div>

                    {!isOldPasswordCoreect && (
                        <small id="emailHelp" className="form-text text-muted">
                            Incorrect password
                        </small>
                    )}
                    {!isNewAndConfirmMatch && (
                        <small id="emailHelp" className="form-text text-muted">
                            New and Confirm passwords don't match
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
            <Toaster />
        </div>
    );
}

export default ChangePassword;

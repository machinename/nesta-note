import React, { useState, useRef } from 'react';
import styles from './AccountModal.module.css';
import { useAuthContext } from '../providers/AuthProvider';
import { IconButton } from '@mui/material';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';

/**
 * ReAuthModal component for re-authenticating the user.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.isOpen - Determines if the modal is open.
 * @param {function} props.onClose - Function to close the modal.
 * @param {string} props.method - The method of re-authentication ('email' or 'password').
 * @returns {JSX.Element|null} The rendered modal or null if not open.
 */
const AccountModal = ({ isOpen, onClose, method }) => {
    const [deleteAccount, setDeleteAccount] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [confirmNewEmail, setConfirmNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '', newPassword: '' });
    const { authError, deleteUserAccount, user, userEmail, userDisplayName, updateUserDisplayName, updateUserEmail, updatePassword, setAuthError } = useAuthContext();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClose = () => {
        setAuthError('');
        setDeleteAccount('');
        setDisplayName('');
        setEmail('');
        setConfirmNewEmail('');
        setPassword('');
        setConfirmNewPassword('');
        onClose();
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({ email: '', password: '', newPassword: '' });
        setAuthError('');
        try {
            let result;
            if (method === "email") {
                if (email === confirmNewEmail) {
                    result = await updateUserEmail(email, password);
                    if (result) {
                        handleClose();
                        alert('Please verify your new email address');
                    }
                } else {
                    setErrors({ ...errors, email: 'Emails do not match' });
                    return;
                }
            } else if (method === "password") {
                if (password === confirmNewPassword) {
                    result = await updatePassword(password);
                    if (result) {
                        handleClose();
                        alert('Password updated successfully');
                    }
                } else {
                    setErrors({ ...errors, password: 'Passwords do not match' });
                    return;
                }
            } else if (method === "delete") {
                if (deleteAccount === "delete-my-account") {
                    result = await deleteUserAccount(password);
                    if (result) {
                        handleClose();
                        Router.push('/notes');
                        // alert('Account deleted successfully');
                    }
                } else {
                    return;
                }
            } else if (method === "displayName") {
                if (displayName === user?.displayName) {
                    setAuthError('Display name must be different from current display name');
                    return;
                }
                result = await updateUserDisplayName(displayName);
                if (result) {
                    handleClose();
                    // alert('Display name updated successfully');
                }
            }
        } catch (error) {
            setErrors({ ...errors, [method]: error });
        }
    };

    const isFormButtonEnabled = () => {
        if (method === "email") {
            return email.length > 0 && confirmNewEmail.length;
            // return email.length > 0 && email === confirmNewEmail;
        } else if (method === "password") {
            return password.length > 0 && confirmNewPassword.length;
            // return password.length > 0 && password === confirmNewPassword;
        } else if (method === "delete") {
            return password.length > 0 && deleteAccount === "delete-my-account"
        }
        else if (method === "displayName") {
            return true;
        }
        return false;
    };

    return (
        isOpen && (
            <div className={styles.containerModal}>
                <div className={styles.formContainer}>
                    <form className={styles.authForm} onSubmit={handleSubmit}>
                        <h1>Nesta Note</h1>
                        {method === "email" && (
                            <>
                                <p>Current Email: {userEmail}</p>
                                <div className={styles.inputContainer}>
                                    <input
                                        className={styles.input}
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder='New email'
                                        aria-invalid={!!errors.email}
                                    />
                                </div>
                                <div className={styles.inputContainer}>
                                    <input
                                        className={styles.input}
                                        type="email"
                                        id="confirmNewEmail"
                                        value={confirmNewEmail}
                                        onChange={(e) => setConfirmNewEmail(e.target.value)}
                                        placeholder='Confirm new email'
                                        aria-invalid={!!errors.email}
                                        autoComplete='off'
                                    />
                                </div>
                                {
                                    errors.email
                                        ?
                                        <p className={styles.textError} aria-live="polite">{errors.email}</p>
                                        :
                                        null
                                }
                            </>
                        )}
                        {method === "password" && (
                            <>
                                <div className={styles.inputContainer}>
                                    <input
                                        className={styles.input}
                                        type={showPassword ? 'text' : 'password'}
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder='New password'
                                        aria-invalid={!!errors.password}
                                    />
                                </div>
                                {
                                    errors.newPassword
                                        ?
                                        <p className={styles.textError} aria-live="polite">{errors.newPassword}</p>
                                        :
                                        null
                                }
                                <div className={styles.inputContainer}>
                                    <input
                                        className={styles.input}
                                        type={showPassword ? 'text' : 'password'}
                                        id="confirmNewPassword"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        placeholder='Confirm new password'
                                        aria-invalid={!!errors.password}
                                    />
                                </div>
                                {errors.newPassword ?? (<p aria-live="polite">{errors.newPassword}</p>)}
                            </>
                        )}
                        {method === "delete" && (
                            <>
                                <p>We will immediately delete your account, along with all of your data assoicated with your account.</p>
                                <p>To verify, type &apos;delete-my-account&apos; below</p>
                                <div className={styles.inputContainer}>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        id="deleteAccount"
                                        value={deleteAccount}
                                        onChange={(event) => setDeleteAccount(event.target.value)}
                                        placeholder="delete-my-account"
                                        aria-invalid={!!errors.password}
                                        autoComplete='off'
                                    />
                                </div>
                            </>
                        )}
                        {method === "displayName" && (
                            <>
                                <p>Current Display Name: {userDisplayName ? userDisplayName : 'N/A'}</p>
                                <div className={styles.inputContainer}>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        id="displayName"
                                        value={displayName}
                                        onChange={(event) => setDisplayName(event.target.value)}
                                        placeholder="New display name"
                                        aria-invalid={!!authError}
                                        autoComplete='off'
                                    />
                                </div>
                            </>
                        )}
                        {method != "displayName" && (
                            <div className={styles.inputContainer}>
                                <input
                                    className={styles.inputVisiblity}
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='Password'
                                    aria-invalid={!!errors.password}
                                />
                                <IconButton onClick={handleClickShowPassword} className={styles.visiblityIcon}>
                                    {
                                        showPassword
                                            ?
                                            <VisibilityOffOutlined />
                                            :
                                            <VisibilityOutlined />
                                    }
                                </IconButton>
                            </div>
                        )}
                        {
                            authError
                                ?
                                <p className={styles.textError} aria-live="polite">{authError}</p>
                                :
                                null
                        }
                        <button className={styles.formButton} disabled={!isFormButtonEnabled()} type="submit">
                            Submit
                        </button>
                        <button className={styles.formButton} onClick={handleClose} type="reset">
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        )
    );
}

export default AccountModal;

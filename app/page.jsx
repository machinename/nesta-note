'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Divider from '@mui/material/Divider';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useAuthContext } from './providers/AuthProvider';
import { Google, Policy, VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';


export default function Login() {
  const router = useRouter();
  const { authError, createAccount, login } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isLoginButtonEnabled = () => {
    return email.trim() !== '' && password.trim() !== '' && (isLogin || confirmPassword.trim() !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: '', password: '', confirmPassword: '' });

    let hasErrors = false;
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email format is invalid';
      hasErrors = true;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      hasErrors = true;
    } else if (!isLogin && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      hasErrors = true;
    }

    if (!isLogin) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
        hasErrors = true;
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    try {
      let result;

      if (isLogin) {
        result = await login(email, password);     
      } else {
        result = await createAccount(email, password);
        alert('Account created successfully. Please verify your email address to access all the available features.');  
      }
      if (result) {
        router.push('/notes');
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, api: error.message }));
    }
  };

  const handleSwitch = () => {
    setIsLogin((prev) => !prev);
    setConfirmPassword('');
    setErrors({ email: '', password: '', confirmPassword: '', api: '' });
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 720);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // if (user) {
  //   router.push('/notes');
  //   return (
  //     <div className={styles.page}>
  //       <CircularProgress />
  //     </div>
  //   )
  // }
  return (
    <div className={styles.login}>
      <div style={{
        height: '1rem',
      }} />
      <div className={styles.loginContainer}>
        <h1>{isLogin ? 'Log into Nesta Note' : 'Create an account'}</h1>
        <div className={styles.loginContainerBody}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email'
                aria-invalid={!!errors.email}
              />
            </div>
            {
              errors.email ? <p aria-live="polite" className={styles.errorText}>{errors.email}</p> : null
            }
            <div className={styles.inputContainer}>
              <input
                className={styles.visiblityInput}
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
            {
              errors.password ? <p aria-live="polite" className={styles.errorText}>{errors.password}</p> : null
            }
            {
              authError
                ?
                <p className={styles.textError} aria-live="polite">{authError}</p>
                :
                null
            }
            {!isLogin && (
              <div className={styles.inputContainer}>
                <input
                  className={styles.visiblityInput}
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Confirm Password'
                  aria-invalid={!!errors.confirmPassword}
                />
                <p aria-live="polite" className={styles.errorText}>{errors.confirmPassword}</p>
              </div>
            )}
            <button className={styles.formButton} disabled={!isLoginButtonEnabled()} type="submit">
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>
          <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem sx={{ color: 'gray' }}>
            OR
          </Divider>
          <div className={styles.form}>
            <button className={styles.providerButton}>
              <Google />
              <div>Continue with Google</div>
            </button>
            <button className={styles.providerButton} onClick={() => router.push('/notes')}>
              <Policy />
              <div>Continue without account</div>
            </button>
          </div>
        </div>
        {isLogin && (
          <p className={styles.termsText}>
            By creating an account, you agree to our <Link href={'/'} className={styles.termsText}>Terms of Service</Link> & <Link href={'/'} className={styles.termsText}>Privacy Policy</Link>.
          </p>
        )}
        <p className={styles.termsText}>
          Secure Login with reCAPTCHA subject to Google <Link className={styles.termsText} href={"https://policies.google.com/terms?hl=en"}>Terms of Service</Link> & <Link className={styles.termsText} href={"https://policies.google.com/privacy?hl=en"}>Privacy Policy</Link>.
        </p>
        <div className={styles.textButtonContainer}>
          <button className={styles.textButton}>
            FORGOT PASSWORD?
          </button>
          <button className={styles.textButton} onClick={handleSwitch}>
            {isLogin ? 'CREATE ACCOUNT' : 'LOGIN'}
          </button>
        </div>
      </div>
    </div>
  );

}
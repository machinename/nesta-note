'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Divider from '@mui/material/Divider';
import styles from './login.module.css';
import { useRouter } from 'next/navigation'
import { useAuthContext } from './providers/AuthProvider';
import { Google, Policy } from '@mui/icons-material';

export default function Page() {

  const { createAccount, login } = useAuthContext();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState();
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({
      email: '',
      password: '',
      confirmPassword: '',
    });

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
    } else if (password.length < 6) {
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
      if (isLogin) {
        await login(email, password);
        router.push('/notes');
      } else {
        await createAccount(email, password);
        router.push('/notes');
      }
    } catch (error) {
      setErrors({ ...newErrors, api: error.message });
    }
  };

  const handleSwitch = () => {
    setIsLogin((prev) => !prev);
    if (!isLogin) {
      setConfirmPassword('');
    }
    setErrors({
      email: '',
      password: '',
      confirmPassword: '',
    });
  };


  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (windowWidth <= 720) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [windowWidth]);

  useEffect(() => {
    if (windowWidth < 720) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [windowWidth]);

  return (
    <div className={styles.loginContent}>
      <div className={styles.loginContainer}>
        {isLogin ? <h1>Log into Nesta Note</h1> : <h1>Create an account</h1>}
        <div className={styles.loginContainerBody}>
          <div className={styles.loginForm}>
            <div className={styles.inputContainer}>
              <input className={styles.input} type="text" id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email' />
              <p>{!!errors.email}</p>
            </div>
            <div className={styles.inputContainer}>
              <input className={styles.input} type="password" id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password' />
              <p>{!!errors.password}</p>
            </div>
            {!isLogin && (
              <div className={styles.inputContainer}>
                <input className={styles.input} type="password" id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Confirm Password' />
                <p>{!!errors.password}</p>
              </div>
            )}
            <button className={styles.loginButton} disabled={true}>
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </div>
          <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem sx={{ color: 'gray' }}>
            OR
          </Divider>
          <div className={styles.loginProviders}>
            <button className={styles.providerButton}>
              <Google className={styles.providerButtonIcon} />
              <div>
                Continue with Google
              </div>
            </button>
            <button className={styles.providerButton} onClick={() => router.push('/notes')}>
              <Policy className={styles.providerButtonIcon} />
              <div>
                Continue without account
              </div>
            </button>
          </div>
        </div>
        {isLogin && (<p className={styles.termsText}>By creating an account, you agree to our <Link href={'/'} className={styles.termsText}>Terms of Service</Link> & <Link href={'/'} className={styles.termsText}>Privacy Policy</Link>.</p>)}
        <p className={styles.termsText}>Secure Login with reCAPTCHA subject to Google <Link className={styles.termsText} href={"https://policies.google.com/terms?hl=en"}>Terms of Service</Link> & <Link className={styles.termsText} href={"https://policies.google.com/privacy?hl=en"}>Privacy Policy</Link>.</p>
        <button className={styles.textButton}>
          FORGOT PASSWORD?
        </button>
        <button className={styles.textButton} onClick={handleSwitch}>
          {isLogin ? 'CREATE ACCOUNT' : 'LOGIN'}
        </button>
      </div>
    </div>
  );
}
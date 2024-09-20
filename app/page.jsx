'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Box, TextField, Typography, Button } from '@mui/material';
import loginStyles from './login.module.css';
import { useRouter } from 'next/navigation'
import { useAuthContext } from './providers/AuthProvider';

export default function Page() {

  const { user, loading, error, createAccount, login, logOut } = useAuthContext();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
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

  return (
    <div className={loginStyles.content}>
      <h1>Nesta Note</h1>
      <div className={loginStyles.container}>
        <Box component="form" className={loginStyles.form} onSubmit={handleSubmit}>
          <h2>{isLogin ? 'Login' : 'Create account'}</h2>
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
          {!isLogin && (
            <>
              <TextField
                id="confirm-password"
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
              <Typography variant="caption">
                By clicking Sign Up, you agree to our <Link href="/terms" target="_blank">Terms of Service</Link>, <Link href="/terms" target="_blank">Privacy Policy</Link> and <Link href="/terms" target="_blank">Cookies Policy</Link>. You may receive notifications from us via email and can opt out any time.
              </Typography>
              {/* <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={agreedToTerms}
                                        margin="dense"
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    />
                                }
                                label={
                                    <Typography variant="body2">
                                        By clicking "Sign Up", you agree to our <a href="/terms" target="_blank">terms and conditions</a>.
                                    </Typography>
                                }
                            />
                            {errors.terms && (
                                <Typography variant="caption" color="error">{errors.terms}</Typography>
                            )} */}
            </>
          )}
          <Button className={loginStyles.loginButton} type="submit" variant="contained" margin="normal">
            {isLogin ? 'Login' : 'Create account'}
          </Button>
          <Button className={loginStyles.switchButton} onClick={handleSwitch}>
            {isLogin ? 'Create new account' : 'Already have an account?'}
          </Button>
          <Button className={loginStyles.switchButton} onClick={() => router.push('/notes')}>
            Continue without account
          </Button>
        </Box>
      </div>
    </div>
  );
}

'use client';

import React, { createContext, useContext } from 'react';
import Cookies from 'js-cookie';

const CookieContext = createContext();

export const CookieProvider = ({ children }) => {
  const setCookie = (name, value, options = {}) => {
    const cookieOptions = {
      ...options,
    //   sameSite: isDev ? 'Lax' : 'None', // 'Lax' in dev, 'None' in production if needed
    sameSite:'Lax', // 'Lax' in dev, 'None' in production if needed
    //   secure: true, // secure only in production
    secure: true,
    };

    Cookies.set(name, value, cookieOptions);
  };

  const getCookie = (name) => {
    return Cookies.get(name);
  };

  const removeCookie = (name) => {
    Cookies.remove(name);
  };

  return (
    <CookieContext.Provider value={{ setCookie, getCookie, removeCookie }}>
      {children}
    </CookieContext.Provider>
  );
};

export const useCookieContext = () => {
  const context = useContext(CookieContext);
  if (context === undefined) {
    throw new Error('useCookieContext must be used within CookieProvider');
  }
  return context;
};

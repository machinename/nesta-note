'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    // useEffect(() => {
    //     if (isDarkMode) {
    //         document.body.className = 'dark';
    //     } else {
    //         document.body.className = '';
    //     }
    // }, [isDarkMode]);

    const contextValue = useMemo(() => ({ isDarkMode, setIsDarkMode }), [isDarkMode, setIsDarkMode]);

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeContext must be used within ThemeProvider.jsx');
    }
    return context;
};
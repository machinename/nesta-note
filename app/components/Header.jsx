'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { IconButton } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import {
  AccountBoxOutlined, ArchiveOutlined, CircleOutlined, Close, DeleteOutlined, LoginOutlined,
  LogoutOutlined, MenuOpen, Refresh, Search, SettingsOutlined, Archive, Note, NoteOutlined, Delete,
  Help,
  HelpOutlined,
  HelpCenter,
  HelpCenterOutlined
} from '@mui/icons-material';

import { useAppContext } from '../providers/AppProvider';
import { useAuthContext } from '../providers/AuthProvider';
import { useThemeContext } from '../providers/ThemeProvider';
import styles from "./Header.module.css";

export default function Header() {
  // Contexts
  const { isAuthLoading, logOut, user } = useAuthContext();
  const {
    searchTerm, handleSearch, handleCloseSearch, isAppLoading,
    isLoginModalOpen, setIsLoginModalOpen, fetchNotes, setNotes
  } = useAppContext();

  // State Variables
  const [title, setTitle] = useState('');
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Refs
  const pathname = usePathname();
  const router = useRouter();
  const accountButtonRef = useRef(null);
  const accountMenuRef = useRef(null);
  const archiveRef = useRef(null);
  const helpRef = useRef(null);
  const homeRef = useRef(null);
  const inputRef = useRef(null);
  const loginRef = useRef(null);
  const logOutRef = useRef(null);
  const navMenuRef = useRef(null);
  const trashRef = useRef(null);
  const settingsButtonRef = useRef(null);
  const settingsMenuRef = useRef(null);

  // Handlers
  const handleOnFocusSearch = () => router.push('/search');
  const handleSearchButton = () => {
    router.push('/search');
    inputRef.current.focus();
  };
  const handleLogin = () => {
    setIsLoginModalOpen(true);
    setIsAccountMenuOpen(false);
  };
  const handleLogOut = async () => {
    try {
      await logOut();
      setNotes([]);
      setIsAccountMenuOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCloseButton = () => {
    router.back();
    handleCloseSearch();
    window.scrollTo({ top: 0 });
  };

  // Effects
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navMenuRef.current && !navMenuRef.current.contains(event.target)) {
        setIsNavMenuOpen(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        if (!accountButtonRef.current.contains(event.target)) {
          setIsAccountMenuOpen(false);
        }
      }
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
        if(!settingsButtonRef.current.contains(event.target)) {
          setIsSettingsMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    handleCloseSearch();
    switch (pathname) {
      case '/':
        setTitle('Nesta Notes');
        break;
      case '/account':
        setTitle('Account');
        break;
      case '/search':
        setTitle('Search');
        break;
      case '/archive':
        setTitle('Archive');
        break;
      case '/trash':
        setTitle('Trash');
        break;
      case '/help':
        setTitle('Help');
        break;
      default:
        setTitle('');
    }
  }, [handleCloseSearch, pathname]);

  if (isLoginModalOpen) {
    return null;
  }

  return (
    <header className={isScrolled ? styles.headerScrolled : styles.header}>
      {/* Nav Leading */}
      <div className={styles.headerLeading}>
        <div className={styles.navAnchor}>
          <IconButton onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}>
            {isNavMenuOpen ? <Close className={styles.icon} /> : <MenuOpen className={styles.icon} />}
          </IconButton>
          {isNavMenuOpen && (
            <nav className={styles.menu} ref={navMenuRef}>
              <Link className={pathname === '/' ? styles.navLinkActive : styles.navLink} ref={homeRef} href='/'>
                {pathname === '/' ? <Note /> : <NoteOutlined />} Notes
              </Link>
              <Link className={pathname === '/archive' ? styles.navLinkActive : styles.navLink} ref={archiveRef} href='/archive'>
                {pathname === '/archive' ? <Archive /> : <ArchiveOutlined />} Archive
              </Link>
              <Link className={pathname === '/trash' ? styles.navLinkActive : styles.navLink} ref={trashRef} href='/trash'>
                {pathname === '/trash' ? <Delete /> : <DeleteOutlined />} Trash
              </Link>
              <Link className={pathname === '/help' ? styles.navLinkActive : styles.navLink} ref={helpRef} href='/help'>
                {pathname === '/help' ? <HelpCenter /> : <HelpCenterOutlined />} Help
              </Link>
            </nav>
          )}
        </div>
        <div className={styles.headerTitle}>
          <p>{title}</p>
        </div>
        {/* Nav Input */}
        <div className={styles.searchInputContainer}>
          <IconButton onClick={handleSearchButton}>
            <Search />
          </IconButton>
          <input
            autoComplete="off"
            className={styles.searchInput}
            id='headerInput'
            type="text"
            placeholder='Search...'
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={handleOnFocusSearch}
            ref={inputRef}
          />
          {pathname === '/search' && (
            <IconButton onClick={handleCloseButton}>
              <Close />
            </IconButton>
          )}
        </div>
      </div>
      {/* Nav Trailing */}
      <div className={styles.headerTrailing}>
        {(isAppLoading || isAuthLoading) ? (
          <IconButton>
            <CircularProgress size={20} />
          </IconButton>
        ) : (
          <IconButton onClick={fetchNotes}>
            <Refresh />
          </IconButton>
        )}
        <div className={styles.settingsAnchor}>
          <IconButton ref={settingsButtonRef} onClick={() => setIsSettingsMenuOpen(prev => !prev)}>
            <SettingsOutlined />
          </IconButton>
          {isSettingsMenuOpen && (
            <nav className={styles.menu} ref={settingsMenuRef}>
              <div className={styles.navLink}>
                Todo - Theme
              </div>
              <div className={styles.navLink}>
                Todo - Enable Sharing
              </div>
              <div className={styles.navLink}>
                Todo - Reminder Defaults
              </div>
            </nav>
          )}
        </div>
        <div className={styles.accountAnchor}>
          <IconButton ref={accountButtonRef} onClick={() => setIsAccountMenuOpen(prev => !prev)}>
            <CircleOutlined />
          </IconButton>
          {isAccountMenuOpen && (
            <nav className={styles.menu} ref={accountMenuRef}>
              {user && (
                <Link className={styles.navLink} ref={archiveRef} onClick={() => setIsAccountMenuOpen(false)} href='/account'>
                  <AccountBoxOutlined /> Account
                </Link>
              )}
              {user ? (
                <div className={styles.navLink} ref={logOutRef} onClick={handleLogOut}>
                  <LogoutOutlined /> Log Out
                </div>
              ) : (
                <div className={styles.navLink} ref={loginRef} onClick={handleLogin}>
                  <LoginOutlined /> Login
                </div>
              )}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

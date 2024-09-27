'use client'

import {
  AccountBoxOutlined, AlarmOutlined, ArchiveOutlined,
  CircleOutlined, Close, DarkMode, DeleteOutlined, GridViewOutlined,
  LoginOutlined, LogoutOutlined, MenuOpen, NotesOutlined,
  NotificationsOutlined, Refresh, Search, SettingsOutlined,
  LightModeOutlined, DarkModeOutlined,
  ArchiveRounded,
  Archive,
  Notes,
  Note,
  NoteOutlined,
  Delete
} from '@mui/icons-material';

import CircularProgress from '@mui/material/CircularProgress';

import { IconButton } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import styles from "./Header.module.css";
import { useAppContext } from '../providers/AppProvider';
import { useAuthContext } from '../providers/AuthProvider';
import { useThemeContext } from '../providers/ThemeProvider';
import LoginModal from './LoginModal';

export default function Header() {
  const { isAuthLoading, user, logOut } = useAuthContext();
  const { searchTerm, handleSearch, handleCloseSearch, isAppLoading, isLoginModalOpen, setIsLoginModalOpen, fetchNotes, setNotes } = useAppContext();

  const [title, setTitle] = useState('');
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const accountMenuRef = useRef(null);
  const archiveRef = useRef(null);
  const homeRef = useRef(null);
  const inputRef = useRef(null);
  const loginRef = useRef(null);
  const logOutRef = useRef(null);
  const navMenuRef = useRef(null);
  const trashRef = useRef(null);

  const handleOnFocusSearch = () => {
      router.push('/search');
  }
  const handleSearchButton = () => {
    router.push('/search');
    inputRef.current.focus();
  };

  const handleLogin = () => {
    setIsLoginModalOpen(true);
    setIsAccountMenuOpen(false);
  }
  const handleLogOut = async () => {
    try {
      await logOut();
      setNotes([]);
      setIsAccountMenuOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  const handleCloseButton = () => {
    router.back();
    handleCloseSearch();
    window.scrollTo({ top: 0 });
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navMenuRef.current && !navMenuRef.current.contains(event.target)) {
        setIsNavMenuOpen(false);
      }
      // if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
      if (accountMenuRef.current && (!accountMenuRef.current.contains(event.target))) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    handleCloseSearch();
    switch (pathname) {
      case ('/'):
        setTitle('Nesta Notes');
        break;
      // case ('/notes'):
      //   setTitle('Nesta Notes');
      //   break;
      case ('/account'):
        setTitle('Account');
        break;
      case ('/login'):
        setTitle('Nesta Notes');
        break;
      case ('/search'):
        setTitle('Search');
        break;
      case '/archive':
        setTitle('Archive');
        break;
      case '/trash':
        setTitle('Trash');
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
      <div
        className={styles.headerLeading}
      >
        <div className={styles.headerAnchorLeading}>
        {
          isNavMenuOpen ?
            <IconButton onClick={() => setIsNavMenuOpen(false)}>
              <Close className={styles.icon} />
            </IconButton>
            :
            <IconButton onClick={() => setIsNavMenuOpen(true)}>
              <MenuOpen className={styles.icon} />
            </IconButton>
        }
          {isNavMenuOpen && (
            <nav
              className={styles.navMenu}
              ref={navMenuRef}
            >
              <Link className={pathname === '/' ? styles.navLinkActive : styles.navLink} ref={homeRef} href='/'>{pathname === '/' ? <Note/> : <NoteOutlined />}Notes</Link>
              <Link className={pathname === '/archive' ? styles.navLinkActive : styles.navLink} ref={archiveRef} href='/archive'>{pathname === '/archive' ? <Archive/> : <ArchiveOutlined />}Archive</Link>
              <Link className={pathname === '/trash' ? styles.navLinkActive : styles.navLink} ref={trashRef} href='/trash'>{pathname === '/trash' ? <Delete/> : <DeleteOutlined />}Trash</Link>
            </nav>
          )}
        </div>
        <div className={styles.headerTitle}>
          <p>{title}</p>
        </div>
        {/* Nav Input */}
        <div className={styles.searchInputContainer}>
          <IconButton onClick={() => handleSearchButton()}>
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
            onFocus={() => handleOnFocusSearch()}
            ref={inputRef}
          />
          {
            pathname === '/search' && (
              <IconButton onClick={() => handleCloseButton()}>
                <Close />
              </IconButton>
            )
          }
        </div>
      </div>
      {/* Nav Trailing*/}
      <div className={styles.headerTrailing}>
        {
          (isAppLoading || isAuthLoading)
            ?
            <IconButton>
              <CircularProgress size={20} />
            </IconButton>
            :
            <IconButton onClick={fetchNotes}>
              <Refresh />
            </IconButton>
        }
        {/* {
            isDarkMode ?
              <IconButton onClick={() => setIsDarkMode(false)}>
                <LightModeOutlined />
              </IconButton> :
              <IconButton onClick={() => setIsDarkMode(true)}>
                <DarkModeOutlined />
              </IconButton>
          } */}
        <IconButton>
          <SettingsOutlined />
        </IconButton>
        <div className={styles.headerAnchorTrailing}>
        <IconButton onClick={() => setIsAccountMenuOpen(prevState => !prevState)}>
          <CircleOutlined />
        </IconButton>
        {isAccountMenuOpen && (
          <nav
            className={styles.accountMenu}
            ref={accountMenuRef}
          >
            {user ?
              <Link className={styles.navLink} ref={archiveRef} onClick={() => setIsAccountMenuOpen(false)} href='/account'><AccountBoxOutlined />Account</Link>
              :
              null
            }
            {
              user
                ?
                <button className={styles.navButton} ref={logOutRef} onClick={handleLogOut}>
                  <LogoutOutlined />
                  Log Out
                </button>
                :
                <button className={styles.navButton} ref={loginRef} onClick={handleLogin}>
                  <LoginOutlined />
                  Login
                </button>
            }
          </nav>
        )}
        </div>
      </div>
    </header>
  
  );
}
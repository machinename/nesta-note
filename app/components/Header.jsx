'use client'

import {
  AccountBoxOutlined, AlarmOutlined, ArchiveOutlined,
  CircleOutlined, Close, DeleteOutlined, GridViewOutlined,
  LoginOutlined, LogoutOutlined, MenuOpen, NotesOutlined,
  NotificationsOutlined, Refresh, Search, SettingsOutlined
} from '@mui/icons-material';

import { IconButton } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import styles from "./header.module.css";
import { useAppContext } from '../providers/AppProvider';
import { useAuthContext } from '../providers/AuthProvider';

export default function Header() {
  const { user, logOut } = useAuthContext();
  const { searchTerm, handleSearch, handleCloseSearch, isSearch, setIsSearch } = useAppContext();
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
  const imageRef = useRef(null);
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

  const handleLogOut = async () => {
    try {
      await logOut();
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
      case ('/notes'):
        setTitle('Nesta Notes');
        break;
      case ('/account'):
        setTitle('Account');
        break;
      case ('/login'):
        setTitle('Nesta Notes');
        break;
      case ('/search'):
        setTitle('Search');
        break;
      // case '/reminders':
      //   setTitle('Reminders');
      //   break;
      case '/archive':
        setTitle('Archive');
        break;
      // case '/settings':
      //   setTitle('Settings');
      //   break;
      case '/trash':
        setTitle('Trash');
        break;
      // case '/help':
      //   setTitle('Help');
      //   break;
      default:
        setTitle('');
    }
  }, [handleCloseSearch, pathname]);

  if (pathname === '/') {
    return null;
  }

  return (
    <>
      <nav className={isScrolled ? styles.navBarScrolled : styles.navBar}>
        {/* Nav Leading */}
        <div
          className={styles.navBarLeading}
        >
          {
            isNavMenuOpen ?
              <IconButton onClick={() => setIsNavMenuOpen(false)}><Close /></IconButton>
              :
              <>
                <IconButton
                  onClick={() => setIsNavMenuOpen(true)}>
                  <MenuOpen />
                </IconButton>
              </>
          }
          <div className={styles.navBarTitle}>
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
              id='navbarInput'
              type="text"
              placeholder='Search'
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
        <div
          className={styles.navBarTrailing}>
          <IconButton>
            <SettingsOutlined />
          </IconButton>
          <IconButton onClick={() => setIsAccountMenuOpen(prevState => !prevState)}>
            <CircleOutlined />
          </IconButton>
        </div>

      </nav>
      {isNavMenuOpen && (
        <div
          className={styles.navMenu}
          ref={navMenuRef}
        >
          <Link className={pathname === '/notes' ? styles.navLinkActive : styles.navLink} ref={homeRef} href='/notes'><NotesOutlined />Notes</Link>

          {/* <Link className={pathname === '/reminders' ? styles.navLinkActive : styles.navLink} ref={mediaRef} href='/reminders'><NotificationsOutlined />Reminders</Link> */}
          <Link className={pathname === '/archive' ? styles.navLinkActive : styles.navLink} ref={archiveRef} href='/archive'><ArchiveOutlined />Archive</Link>
          <Link className={pathname === '/trash' ? styles.navLinkActive : styles.navLink} ref={trashRef} href='/trash'><DeleteOutlined />Trash</Link>
          {/*
          <div onClick={() => { }} className={styles.navLink}>Labels</div>
          <Link className={styles.navLink} href='/settings'>Settings</Link>
          <Link className={styles.navLink} href='/help'>Help</Link> */}
        </div>
      )}
      {isAccountMenuOpen && (
        <div
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
              <Link className={styles.navLink} ref={logOutRef} onClick={handleLogOut} href='/'>
                <LogoutOutlined />
                Log Out
              </Link>
              :
              <Link className={styles.navLink} ref={loginRef} onClick={() => setIsAccountMenuOpen(false)} href='/'>
                <LoginOutlined />
                Login
              </Link>
          }
        </div>
      )}
    </>
  );
}
'use client'

import { AccountCircleOutlined, AccountTreeOutlined, AlarmOutlined, ArchiveOutlined, Close, DeleteOutline, DeleteOutlined, GridViewOutlined, MediaBluetoothOffOutlined, Menu, MenuOpen, NoteOutlined, NotesOutlined, Notifications, NotificationsOutlined, PermMediaOutlined, Refresh, RingVolume, Search, SettingsOutlined, TaxiAlertOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import styles from "./header.module.css";
import { useAppContext } from '../providers/AppProvider';

export default function Header() {
  const { searchTerm, handleSearch, handleCloseSearch, isSearch, setIsSearch } = useAppContext();
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const archiveRef = useRef(null);
  const homeRef = useRef(null);
  const inputRef = useRef(null);
  const mediaRef = useRef(null);
  const menuRef = useRef(null);
  const projectRef = useRef(null);
  const trashRef = useRef(null);

  const handleOnFocusSearch = () => {
    router.push('/search');
  }
  const handleSearchButton = () => {
    router.push('/search');
    inputRef.current.focus();
  };

  const handleCloseButton = () => {
    router.back();
    handleCloseSearch();
    window.scrollTo({ top: 0 });
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsLinkMenuOpen(false);
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
          setLinkTitle('Notes');
          break;
        case ('/search'):
          setLinkTitle('Search');
          break;
        // case '/reminders':
        //   setLinkTitle('Reminders');
        //   break;
        case '/archive':
          setLinkTitle('Archive');
          break;
        // case '/settings':
        //   setLinkTitle('Settings');
        //   break;
        case '/trash':
          setLinkTitle('Trash');
          break;
        // case '/help':
        //   setLinkTitle('Help');
        //   break;
        default:
          setLinkTitle('');
      }
    
  }, [handleCloseSearch, pathname, setIsSearch]);

  const toggleLinkMenu = () => {
    setIsLinkMenuOpen(!setIsLinkMenuOpen);
  }

  const toggleAccountMenu = () => {
    setIsAccountMenuOpen(prevState => !prevState);
  };

  return (
    <>
      <nav className={isScrolled ? styles.navBarScrolled : styles.navBar}>
        {/* Nav Leading */}
        <div
          className={styles.navBarLeading}
        >

          {
            isLinkMenuOpen ?
              <IconButton
                onClick={() => setIsLinkMenuOpen(false)}
              >
                <Close />
              </IconButton>
              :
              <>
                <IconButton
                  onClick={() => setIsLinkMenuOpen(true)}>
                  <MenuOpen />
                </IconButton>
              </>
          }


          <div className={styles.navBarTitle}>
            <h3 style={{
              color: 'grey'
            }}>{linkTitle}</h3>
          </div>

          {/* Nav Input */}
          <div className={styles.searchInputContainer}>
            <IconButton onClick={() => handleSearchButton()}
            >
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
          <IconButton
          >
            <SettingsOutlined />
          </IconButton>
          <IconButton>
            <AccountCircleOutlined />
          </IconButton>
        </div>

      </nav>
      {isLinkMenuOpen && (
        <div
          className={styles.menuContainer}
          ref={menuRef}
        >
          <Link className={pathname === '/' ? styles.navLinkActive : styles.navLink} ref={homeRef} href='/'><NotesOutlined />Notes</Link>

          {/* <Link className={pathname === '/reminders' ? styles.navLinkActive : styles.navLink} ref={mediaRef} href='/reminders'><NotificationsOutlined />Reminders</Link> */}
          <Link className={pathname === '/archive' ? styles.navLinkActive : styles.navLink} ref={archiveRef} href='/archive'><ArchiveOutlined />Archive</Link>
          <Link className={pathname === '/trash' ? styles.navLinkActive : styles.navLink} ref={trashRef} href='/trash'><DeleteOutlined />Trash</Link>
          {/*
          <div onClick={() => { }} className={styles.navLink}>Labels</div>
          <Link className={styles.navLink} href='/settings'>Settings</Link>
          <Link className={styles.navLink} href='/help'>Help</Link> */}
        </div>
      )}
    </>
  );
}
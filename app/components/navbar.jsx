'use client'

import { AccountCircleOutlined, AlarmOutlined, ArchiveOutlined, Close, DeleteOutline, DeleteOutlined, GridViewOutlined, MediaBluetoothOffOutlined, Menu, NotesOutlined, Notifications, NotificationsOutlined, PermMediaOutlined, Refresh, RingVolume, Search, TaxiAlertOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from "./navbar.module.css";

import CustomTooltip from './custom_tooltip';

import { AppContext } from '../context/app_provider';

export default function Navbar() {
  const { searchTerm, handleSearch, handleCloseSearch, isSearch, setIsSearch } = useContext(AppContext);
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const archiveRef = useRef(null);
  const homeRef = useRef(null);
  const inputRef = useRef(null);
  const mediaRef = useRef(null);
  const menuRef = useRef(null);
  const trashRef = useRef(null);


  const handleSearchButton = () => {
    router.push('/search');
    inputRef.current.focus();
  };

  const handleCloseButton = () => {
    router.push('/');
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
      case '/':
        setLinkTitle('Nesta Note');
        break;
      case '/reminders':
        setLinkTitle('Reminders');
        break;
      case '/archive':
        setLinkTitle('Archive');
        break;
      case '/media':
        setLinkTitle('Media');
        break;
      case '/settings':
        setLinkTitle('Settings');
        break;
      case '/trash':
        setLinkTitle('Trash');
        break;
      case '/help':
        setLinkTitle('Help');
        break;
      default:
        setLinkTitle('');
    }
  }, [handleCloseSearch, pathname, setIsSearch]);

  const toggleLinkMenu = () => {
    setIsLinkMenuOpen(!isLinkMenuOpen);
  };

  const toggleAccountMenu = () => {
    setIsAccountMenuOpen(!isAccountMenuOpen);
  };

  return (
    <>
      <nav className={isScrolled ? styles.navBarScrolled : styles.navBar}>
        {/* Nav Leading */}
        <div
          className={styles.navBarLeading}
        >
          <IconButton onClick={toggleLinkMenu}>
            {isLinkMenuOpen ? <Close /> : <Menu />}
          </IconButton>
          <div>
            <p className={styles.linkTitleText}>{linkTitle}</p>
          </div>
        </div>
        {/* Nav Input */}

        <div className={styles.searchInputContainer}>
          <IconButton onClick={handleSearchButton}>
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
            onFocus={() => router.push('/search')}
            ref={inputRef}
          />
          {
            isSearch && (
              <IconButton onClick={()=>handleCloseButton()}>
                <Close />
              </IconButton>
            )
          }
        </div>

        {/* Nav Trailing*/}
        <div
          className={styles.navBarTrailing}>
          <div>
            {/* <CustomTooltip title="Grid View">
            <IconButton >
              <GridViewOutlined />
            </IconButton>
            </CustomTooltip>
            <CustomTooltip title="Refresh">
            <IconButton>
              <Refresh />
            </IconButton>
            </CustomTooltip >
            <CustomTooltip title="Account">
            <IconButton>
              <AccountCircleOutlined />
            </IconButton>
            </CustomTooltip> */}
          </div>
          {/* <div>
            <p>
              Note File
            </p >
            <IconButton>
              <AccountCircleOutlined />
            </IconButton>
          </div> */}
        </div>
      </nav>
      {isLinkMenuOpen && (
        <div
          className={styles.menuContainer}
          ref={menuRef}
        >
          <Link className={pathname === '/' ? styles.navLinkActive : styles.navLink} ref={homeRef} href='/'><NotesOutlined />Notes</Link>
          <Link className={pathname === '/reminders' ? styles.navLinkActive : styles.navLink} ref={mediaRef} href='/reminders'><NotificationsOutlined />Reminders</Link>
          <Link className={pathname === '/archive' ? styles.navLinkActive : styles.navLink} ref={archiveRef} href='/archive'><ArchiveOutlined />Archive</Link>
          <Link className={pathname === '/media' ? styles.navLinkActive : styles.navLink} ref={mediaRef} href='/media'><PermMediaOutlined />Media</Link>
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
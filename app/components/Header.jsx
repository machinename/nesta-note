'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { IconButton } from '@mui/material';
import {
  ArchiveOutlined, Close, DeleteOutlined,
  MenuOpen, Search, Archive, Note, NoteOutlined, Delete,
  HelpCenter,
  HelpCenterOutlined
} from '@mui/icons-material';

import { useAppContext } from '../providers/AppProvider';
import styles from "./Header.module.css";

export default function Header() {
  // Contexts
  const {
    searchTerm, handleSearch, handleCloseSearch,
    isLoginModalOpen,
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
        if (!settingsButtonRef.current.contains(event.target)) {
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
      case '/search':
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
    </header>
  );
}

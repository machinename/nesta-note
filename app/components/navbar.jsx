'use client'

import { AccountCircleOutlined, ArchiveOutlined, Close, DeleteOutline, GridViewOutlined, Menu, NotesOutlined, Refresh, Search } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from "./navbar.module.css";
import CustomTooltip from './custom_tooltip';
import { AppContext } from '../context/app_provider';

export default function Navbar() {
  const { searchTerm, handleSearch, isSearch, setIsSearch } = useContext(AppContext);
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const pathname = usePathname();
  const menuRef = useRef(null);
  const inputRef = useRef(null);
  const archiveRef = useRef(null);
  const homeRef = useRef(null);
  const trashRef = useRef(null);


  const handleSearchButton = () => {
    setIsSearch(true);
    inputRef.current.focus();
  };

  const handleCloseButton = () => {
    setIsSearch(false);
    handleSearch('');
    window.scrollTo({ top: 0 });
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleLinkClick = (currentPath) => {
    if(currentPath === pathname){
      setIsSearch(false);
      handleSearch('');
    }
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
    setIsSearch(false);
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
  }, [pathname, setIsSearch]);

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
            <p>{linkTitle}</p>
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
            onFocus={() => setIsSearch(true)}
            ref={inputRef}
          />
          {
            isSearch && (
              <IconButton onClick={handleCloseButton}>
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
        <Link className={pathname === '/' ? styles.navLinkActive : styles.navLink} ref={homeRef} href='/' onClick={()=>handleLinkClick('/')}><NotesOutlined />Notes</Link>
        <Link className={pathname === '/archive' ? styles.navLinkActive : styles.navLink} ref={archiveRef} href='/archive' onClick={()=>handleLinkClick('/archive')}><ArchiveOutlined />Archive</Link>
        <Link className={pathname === '/trash' ? styles.navLinkActive : styles.navLink} ref={trashRef} href='/trash' onClick={()=>handleLinkClick('/trash')}><DeleteOutline />Trash</Link>
        {/*  <Link className={styles.navLink} href='/reminders'>Reminders</Link>
          <div onClick={() => { }} className={styles.navLink}>Labels</div>
          <Link className={styles.navLink} href='/media'>Media</Link>
          <Link className={styles.navLink} href='/settings'>Settings</Link>
         
          <Link className={styles.navLink} href='/help'>Help</Link> */}
      </div>
   )} 
    </>
  );
}
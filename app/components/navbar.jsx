'use client'
import { AccountCircleOutlined, Close, GridViewOutlined, Menu, Refresh, Search } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from "./navbar.module.css";
import CustomTooltip from './custom_tooltip';
import { AppContext } from '../context/app_provider';

export function Navbar() {
  const { searchTerm, filteredNotes, handleSearch } = useContext(AppContext);
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const [onSearchScreen, setOnSearchScreen] = useState(false);
  const router = useRouter()
  const pathname = usePathname();
  const menuRef = useRef(null);

  const handleCloseSearch = () => {
    handleSearch('');
    router.push('/', { scroll: false });
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
    switch (pathname) {
      case '/':
        setLinkTitle('Nesta Note');
        setOnSearchScreen(false);
        break;
      case '/reminders':
        setLinkTitle('Reminders');
        setOnSearchScreen(false);
        break;
      case '/archive':
        setLinkTitle('Archive');
        setOnSearchScreen(false);
        break;
      case '/media':
        setLinkTitle('Media');
        setOnSearchScreen(false);
        break;
      case '/settings':
        setLinkTitle('Settings');
        setOnSearchScreen(false);
        break;
      case '/search':
        setLinkTitle('Search');
        setOnSearchScreen(true);
        break;
      case '/trash':
        setLinkTitle('Trash');
        setOnSearchScreen(false);
        break;
      case '/help':
        setLinkTitle('Help');
        setOnSearchScreen(false);
        break;
      default:
        setLinkTitle('');
        setOnSearchScreen(false);
    }
  }, [pathname]);

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
          <CustomTooltip title="Search">
          <IconButton>
            <Search />
          </IconButton>
          </CustomTooltip>
          <input
            autoComplete="off"
            className={styles.searchInput}
            id='navbarInput'
            type="text"
            placeholder='Search'
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onClick={onSearchScreen ? null : () => router.push('/search', { scroll: false })}
          />
          {
            onSearchScreen ?
            <CustomTooltip title="Close Search">
              <IconButton onClick={handleCloseSearch}>
                <Close />
              </IconButton>
              </CustomTooltip>
             : null
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
          <Link className={styles.navLink} href='/'>Notes</Link>
          <Link className={styles.navLink} href='/archive'>Archive</Link>
          <Link className={styles.navLink} href='/trash'>Trash</Link>
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
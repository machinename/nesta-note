'use client'
import { AccountCircleOutlined, Close, Dashboard, GitHub, Menu, Search, Settings } from '@mui/icons-material';
import { IconButton, Paper } from '@mui/material';
import { usePathname } from 'next/navigation'
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import styles from "../page.module.css"
export function Navbar() {
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  // const [isMobile, setIsMobile] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname()

  const email = 'support@machinename.dev';
  const subject = 'Support Request';
  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;


  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth < 768);
  //   };

  //   // Initial check
  //   handleResize();

  //   // Add event listener
  //   window.addEventListener('resize', handleResize);

  //   // Cleanup event listener on component unmount
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  useEffect(() => {
    switch (pathname) {
      case '/':
        setLinkTitle('Notes');
        break;
      case '/reminders':
        setLinkTitle('Reminders');
        break;
      case '/archive':
        setLinkTitle('Archive');
        break;
      case '/trash':
        setLinkTitle('Trash');
        break;
      case '/settings':
        setLinkTitle('Settings');
        break;
      case '/help':
        setLinkTitle('Help');
        break;
      case '/media':
        setLinkTitle('Media');
        break;
      default:
        setLinkTitle('');
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
      <nav>
        {/* Nav Leading */}
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            gap: '0.5rem',
            paddingLeft: '0.5rem'
          }}
        >
          <IconButton onClick={toggleLinkMenu}>
            {isLinkMenuOpen ? <Close /> : <Menu />}
          </IconButton>
          <div style={{
            width: '100px'
          }}>
            <p id='inputTitle'>{linkTitle}</p>
          </div>
        </div>
        {/* Nav Input */}
        <div id='searchInputContainer'>
          <IconButton>
            <Search />
          </IconButton>
          <input
            id='searchInput'
            type="text"
            placeholder='Search'
          />
          <IconButton>
            <Close />
          </IconButton>
        </div>
        {/* Nav Trailing*/}
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            paddingRight: '0.5rem'
          }}>
          <IconButton id='menuButton' onClick={toggleAccountMenu}>
            <Dashboard />
          </IconButton>
          <IconButton id='menuButton' onClick={toggleAccountMenu}>
            <AccountCircleOutlined />
          </IconButton>
        </div>
      </nav>
      {isLinkMenuOpen && (
        <div style={{
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          top: '68px',
          position: 'fixed',
          left: '1rem',
          zIndex: '100'
        }}>
          <Link id='navLink' style={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
          }} href='/'>Notes</Link>
          <Link id='navLink' href='/reminders'>Reminders</Link>

          <div id='navLink'
          // onClick={onLabel} 
          >Create Label</div>
          <Link id='navLink' href='/archive'>Archive</Link>
          <Link id='navLink' href='/trash'>Trash</Link>
          <Link id='navLink' href='/settings'>Settings</Link>
          <Link id='navLink' href='/help'>Help</Link>
        </div>
      )}
    </>
  );
}

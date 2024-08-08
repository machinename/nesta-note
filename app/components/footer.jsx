import Link from 'next/link';

export function Footer() {
  return (
    <>
      <footer id='footerDesktop'>
        <p>
          © 2024 Machine Name LLC. All Rights Reserved.
        </p>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          listStyleType: 'none',
          margin: '0',
          padding: '0',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {/* <Link id='navLinkFooter'  href="/Mini ML - Privacy Policy.pdf"
            target="_blank"
            rel="noopener noreferrer"
            passHref>
            Privacy Policy
          </Link>
          <Link id='navLinkFooter'  href="/Mini ML - Terms of Service.pdf"
            target="_blank"
            rel="noopener noreferrer"
            passHref>
            Terms of Service
          </Link> */}
        </div>
      </footer>
      <footer id='footerMobile'>
        {/* <Link  id='navLinkFooter'  href="/Mini ML - Privacy Policy.pdf"
          target="_blank"
          rel="noopener noreferrer"
          passHref>
          Privacy Policy
        </Link>
        <Link  id='navLinkFooter'  href="/Mini ML - Terms of Service.pdf"
          target="_blank"
          rel="noopener noreferrer"
          passHref>
          Terms of Service
        </Link> */}
        <p>
          © 2024 Machine Name LLC. All Rights Reserved.
        </p>
      </footer>
    </>
  );
}
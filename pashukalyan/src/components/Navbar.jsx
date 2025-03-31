"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user session exists
    const userSession = localStorage.getItem("userSession")
    setIsAuthenticated(!!userSession)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userSession")
    setIsAuthenticated(false)
    navigate("/login")
  }

  const styles = {
    header: {
      backgroundColor: "#dfdbdb",
      padding: "1rem 1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid #bebebe",
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
    },
    logo: {
      width: "3rem",
      height: "3rem",
      marginRight: "0.5rem",
    },
    logoText: {
      color: "#000000",
      fontWeight: "500",
    },
    mobileButton: {
      display: "block",
      background: "none",
      border: "none",
      cursor: "pointer",
    },
    desktopNav: {
      display: "none",
      gap: "2rem",
      alignItems: "center",
      "@media (min-width: 768px)": {
        display: "flex",
      },
    },
    navLink: {
      color: "#000000",
      fontWeight: "500",
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
    },
    authButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#000000",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      padding: 0,
    },
    mobileMenu: {
      position: "absolute",
      top: "4rem",
      left: 0,
      right: 0,
      backgroundColor: "#dfdbdb",
      zIndex: 50,
      borderBottom: "1px solid #bebebe",
    },
    mobileMenuInner: {
      display: "flex",
      flexDirection: "column",
      padding: "1rem",
    },
    mobileLink: {
      color: "#000000",
      fontWeight: "500",
      marginBottom: "1rem",
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
    },
    iconMargin: {
      marginRight: "0.5rem",
    },
  }

  // Media query for desktop
  if (window.innerWidth >= 768) {
    styles.mobileButton.display = "none"
    styles.desktopNav.display = "flex"
  }

  return (
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <img src="logo.png" alt="Pashu Kalyan Logo" style={styles.logo} />
        <span style={styles.logoText}>Pashu Kalyan</span>
      </div>

      {/* Mobile menu button */}
      <button style={styles.mobileButton} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          width="24"
          height="24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Desktop navigation */}
      <nav style={styles.desktopNav}>
        <Link to="/" style={styles.navLink}>
          HOME
        </Link>
        <Link to="/adopt" style={styles.navLink}>
          ADOPT PET
        </Link>
        <Link to="/donate" style={styles.navLink}>
          DONATE
        </Link>
        <Link to="/about" style={styles.navLink}>
          ABOUT US
        </Link>
        <Link to="/blog" style={styles.navLink}>
          BLOG
        </Link>

        {/* Login/Logout based on session */}
        {isAuthenticated ? (
          <button onClick={handleLogout} style={styles.authButton}>
            {/* Logout SVG Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={styles.iconMargin}
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            
          </button>
        ) : (
          <Link to="/login" style={styles.navLink}>
            {/* Login SVG Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={styles.iconMargin}
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            
          </Link>
        )}
      </nav>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div style={styles.mobileMenu}>
          <div style={styles.mobileMenuInner}>
            <Link to="/" style={styles.mobileLink}>
              HOME
            </Link>
            <Link to="/adopt" style={styles.mobileLink}>
              ADOPT PET
            </Link>
            <Link to="/donate" style={styles.mobileLink}>
              DONATE
            </Link>
            <Link to="/about" style={styles.mobileLink}>
              ABOUT US
            </Link>
            <Link to="/blog" style={styles.mobileLink}>
              BLOG
            </Link>

            {/* Mobile Login/Logout */}
            {isAuthenticated ? (
              <button onClick={handleLogout} style={styles.mobileLink}>
                {/* Logout SVG Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={styles.iconMargin}
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                
              </button>
            ) : (
              <Link to="/login" style={styles.mobileLink}>
                {/* Login SVG Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={styles.iconMargin}
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar


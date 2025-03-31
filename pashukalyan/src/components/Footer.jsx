const Footer = () => {
  const styles = {
    footer: {
      backgroundColor: "#e0e0e0",
      padding: "2rem 1.5rem",
    },
    container: {
      maxWidth: "80rem",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "2rem",
    },
    heading: {
      fontSize: "1.125rem",
      fontWeight: "500",
      color: "#212121",
      marginBottom: "1rem",
    },
    list: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    listItem: {
      marginBottom: "0.5rem",
    },
    link: {
      color: "#424242",
      textDecoration: "none",
    },
    contactColumn: {
      display: "flex",
      flexDirection: "column",
    },
    contactText: {
      color: "#424242",
      marginBottom: "1rem",
    },
    logoContainer: {
      marginTop: "auto",
    },
    logo: {
      width: "3.5rem",
      height: "3.5rem",
    },
    logoText: {
      color: "#000000",
      fontWeight: "500",
    },
  }

  // Media query for desktop
  if (window.innerWidth >= 768) {
    styles.container.gridTemplateColumns = "1fr 1fr 1fr"
    styles.contactColumn.alignItems = "flex-end"
  }

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Services Column */}
        <div>
          <h3 style={styles.heading}>Services</h3>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <a href="/donate" style={styles.link}>
                Donate us
              </a>
            </li>
            <li style={styles.listItem}>
              <a href="/adopt" style={styles.link}>
                Adopt a pet
              </a>
            </li>
            <li style={styles.listItem}>
              <a href="/blog" style={styles.link}>
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Follow Us Column */}
        <div>
          <h3 style={styles.heading}>Follow us</h3>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <a href="#" style={styles.link}>
                Facebook
              </a>
            </li>
            <li style={styles.listItem}>
              <a href="#" style={styles.link}>
                Twitter
              </a>
            </li>
            <li style={styles.listItem}>
              <a href="https://www.instagram.com/nuhang_limbu/" style={styles.link}>
                Instagram
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Us Column */}
        <div style={styles.contactColumn}>
          <h3 style={styles.heading}>Contact us</h3>
          <p style={styles.contactText}>pashukalyan2025@gmail</p>
          <div style={styles.logoContainer}>
            <img src="logo.png" alt="Pashu Kalyan Logo" style={styles.logo} />
            
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


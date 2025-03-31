"use client"

import { useState } from "react"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard")

  // Sample data for demonstration
  const stats = {
    totalUsers: 124,
    totalAnimals: 57,
    pendingApplications: 18,
    approvedApplications: 42,
  }

  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "User", joinDate: "2023-05-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", joinDate: "2023-06-22" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", role: "Admin", joinDate: "2023-04-10" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", role: "User", joinDate: "2023-07-05" },
    { id: 5, name: "Michael Wilson", email: "michael@example.com", role: "User", joinDate: "2023-08-12" },
  ]

  const animals = [
    { id: 1, name: "Buddy", type: "Dog", age: "2 years", gender: "Male", status: "Available" },
    { id: 2, name: "Luna", type: "Dog", age: "1 year", gender: "Female", status: "Adopted" },
    { id: 3, name: "Max", type: "Dog", age: "3 years", gender: "Male", status: "Available" },
    { id: 4, name: "Whiskers", type: "Cat", age: "4 years", gender: "Female", status: "Available" },
    { id: 5, name: "Rocky", type: "Dog", age: "5 years", gender: "Male", status: "Pending Adoption" },
  ]

  const applications = [
    { id: 1, user: "John Doe", animal: "Buddy", date: "2023-09-15", status: "Pending" },
    { id: 2, user: "Jane Smith", animal: "Luna", date: "2023-08-22", status: "Approved" },
    { id: 3, user: "Emily Davis", animal: "Max", date: "2023-09-05", status: "Pending" },
    { id: 4, user: "Michael Wilson", animal: "Whiskers", date: "2023-09-10", status: "Rejected" },
    { id: 5, user: "Sarah Brown", animal: "Rocky", date: "2023-09-18", status: "Pending" },
  ]

  // Styles
  const styles = {
    container: {
      display: "flex",
      minHeight: "calc(100vh - 64px)", // Adjust based on your navbar height
      backgroundColor: "#f5f5f5",
    },
    sidebar: {
      width: "250px",
      backgroundColor: "#dfdbdb",
      padding: "20px",
      borderRight: "1px solid #bebebe",
    },
    sidebarTitle: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#000000",
    },
    navItem: {
      display: "flex",
      alignItems: "center",
      padding: "12px 16px",
      marginBottom: "8px",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.3s",
      color: "#000000",
    },
    activeNavItem: {
      backgroundColor: "#212121",
      color: "#ffffff",
    },
    navIcon: {
      marginRight: "12px",
    },
    content: {
      flex: 1,
      padding: "20px",
      overflowY: "auto",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
    },
    title: {
      fontSize: "1.8rem",
      fontWeight: "bold",
      color: "#000000",
    },
    statsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "16px",
      marginBottom: "24px",
    },
    statCard: {
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    statTitle: {
      fontSize: "0.875rem",
      color: "#757575",
      marginBottom: "8px",
    },
    statValue: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#000000",
    },
    table: {
      width: "100%",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    tableHeader: {
      backgroundColor: "#f0f0f0",
      padding: "12px 16px",
      textAlign: "left",
      fontWeight: "bold",
      color: "#000000",
      borderBottom: "1px solid #e0e0e0",
    },
    tableRow: {
      borderBottom: "1px solid #e0e0e0",
    },
    tableCell: {
      padding: "12px 16px",
      color: "#424242",
    },
    button: {
      backgroundColor: "#212121",
      color: "#ffffff",
      border: "none",
      borderRadius: "4px",
      padding: "8px 16px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    buttonOutline: {
      backgroundColor: "transparent",
      color: "#212121",
      border: "1px solid #212121",
      borderRadius: "4px",
      padding: "8px 16px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    statusBadge: {
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "0.75rem",
      fontWeight: "bold",
    },
    pendingBadge: {
      backgroundColor: "#fff8e1",
      color: "#f57c00",
    },
    approvedBadge: {
      backgroundColor: "#e8f5e9",
      color: "#2e7d32",
    },
    rejectedBadge: {
      backgroundColor: "#ffebee",
      color: "#c62828",
    },
    availableBadge: {
      backgroundColor: "#e8f5e9",
      color: "#2e7d32",
    },
    adoptedBadge: {
      backgroundColor: "#e0f7fa",
      color: "#0277bd",
    },
    actionButton: {
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      color: "#212121",
      marginRight: "8px",
    },
  }

  // Render status badge with appropriate color
  const renderStatusBadge = (status) => {
    let badgeStyle = { ...styles.statusBadge }

    if (status === "Pending") {
      badgeStyle = { ...badgeStyle, ...styles.pendingBadge }
    } else if (status === "Approved") {
      badgeStyle = { ...badgeStyle, ...styles.approvedBadge }
    } else if (status === "Rejected") {
      badgeStyle = { ...badgeStyle, ...styles.rejectedBadge }
    } else if (status === "Available") {
      badgeStyle = { ...badgeStyle, ...styles.availableBadge }
    } else if (status === "Adopted" || status === "Pending Adoption") {
      badgeStyle = { ...badgeStyle, ...styles.adoptedBadge }
    }

    return <span style={badgeStyle}>{status}</span>
  }

  // Render dashboard content
  const renderDashboard = () => (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard Overview</h1>
      </div>

      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statTitle}>TOTAL USERS</div>
          <div style={styles.statValue}>{stats.totalUsers}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statTitle}>TOTAL ANIMALS</div>
          <div style={styles.statValue}>{stats.totalAnimals}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statTitle}>PENDING APPLICATIONS</div>
          <div style={styles.statValue}>{stats.pendingApplications}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statTitle}>APPROVED APPLICATIONS</div>
          <div style={styles.statValue}>{stats.approvedApplications}</div>
        </div>
      </div>

      <div style={styles.header}>
        <h2 style={{ ...styles.title, fontSize: "1.4rem" }}>Recent Applications</h2>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>ID</th>
            <th style={styles.tableHeader}>User</th>
            <th style={styles.tableHeader}>Animal</th>
            <th style={styles.tableHeader}>Date</th>
            <th style={styles.tableHeader}>Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.slice(0, 3).map((app) => (
            <tr key={app.id} style={styles.tableRow}>
              <td style={styles.tableCell}>{app.id}</td>
              <td style={styles.tableCell}>{app.user}</td>
              <td style={styles.tableCell}>{app.animal}</td>
              <td style={styles.tableCell}>{app.date}</td>
              <td style={styles.tableCell}>{renderStatusBadge(app.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // Render users content
  const renderUsers = () => (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>User Management</h1>
        <button style={styles.button}>Add New User</button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>ID</th>
            <th style={styles.tableHeader}>Name</th>
            <th style={styles.tableHeader}>Email</th>
            <th style={styles.tableHeader}>Role</th>
            <th style={styles.tableHeader}>Join Date</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={styles.tableRow}>
              <td style={styles.tableCell}>{user.id}</td>
              <td style={styles.tableCell}>{user.name}</td>
              <td style={styles.tableCell}>{user.email}</td>
              <td style={styles.tableCell}>{user.role}</td>
              <td style={styles.tableCell}>{user.joinDate}</td>
              <td style={styles.tableCell}>
                <button style={styles.actionButton} title="Edit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button style={styles.actionButton} title="Delete">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // Render animals content
  const renderAnimals = () => (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Animal Listings</h1>
        <button style={styles.button}>Add New Animal</button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>ID</th>
            <th style={styles.tableHeader}>Name</th>
            <th style={styles.tableHeader}>Type</th>
            <th style={styles.tableHeader}>Age</th>
            <th style={styles.tableHeader}>Gender</th>
            <th style={styles.tableHeader}>Status</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {animals.map((animal) => (
            <tr key={animal.id} style={styles.tableRow}>
              <td style={styles.tableCell}>{animal.id}</td>
              <td style={styles.tableCell}>{animal.name}</td>
              <td style={styles.tableCell}>{animal.type}</td>
              <td style={styles.tableCell}>{animal.age}</td>
              <td style={styles.tableCell}>{animal.gender}</td>
              <td style={styles.tableCell}>{renderStatusBadge(animal.status)}</td>
              <td style={styles.tableCell}>
                <button style={styles.actionButton} title="Edit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button style={styles.actionButton} title="Delete">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
                <button style={styles.actionButton} title="View">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // Render applications content
  const renderApplications = () => (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Adoption Applications</h1>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>ID</th>
            <th style={styles.tableHeader}>User</th>
            <th style={styles.tableHeader}>Animal</th>
            <th style={styles.tableHeader}>Date</th>
            <th style={styles.tableHeader}>Status</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} style={styles.tableRow}>
              <td style={styles.tableCell}>{app.id}</td>
              <td style={styles.tableCell}>{app.user}</td>
              <td style={styles.tableCell}>{app.animal}</td>
              <td style={styles.tableCell}>{app.date}</td>
              <td style={styles.tableCell}>{renderStatusBadge(app.status)}</td>
              <td style={styles.tableCell}>
                <button style={styles.actionButton} title="View">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
                {app.status === "Pending" && (
                  <>
                    <button style={styles.actionButton} title="Approve">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="green"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </button>
                    <button style={styles.actionButton} title="Reject">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="red"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard()
      case "users":
        return renderUsers()
      case "animals":
        return renderAnimals()
      case "applications":
        return renderApplications()
      default:
        return renderDashboard()
    }
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarTitle}>Admin Panel</div>

        <div
          style={{
            ...styles.navItem,
            ...(activeTab === "dashboard" ? styles.activeNavItem : {}),
          }}
          onClick={() => setActiveTab("dashboard")}
        >
          <svg
            style={styles.navIcon}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          Dashboard
        </div>

        <div
          style={{
            ...styles.navItem,
            ...(activeTab === "users" ? styles.activeNavItem : {}),
          }}
          onClick={() => setActiveTab("users")}
        >
          <svg
            style={styles.navIcon}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Users
        </div>

        <div
          style={{
            ...styles.navItem,
            ...(activeTab === "animals" ? styles.activeNavItem : {}),
          }}
          onClick={() => setActiveTab("animals")}
        >
          <svg
            style={styles.navIcon}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"></path>
            <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"></path>
            <path d="M8 14v.5"></path>
            <path d="M16 14v.5"></path>
            <path d="M11.25 16.25h1.5L12 17l-.75-.75z"></path>
            <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"></path>
          </svg>
          Animals
        </div>

        <div
          style={{
            ...styles.navItem,
            ...(activeTab === "applications" ? styles.activeNavItem : {}),
          }}
          onClick={() => setActiveTab("applications")}
        >
          <svg
            style={styles.navIcon}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Applications
        </div>

        <div
          style={{
            ...styles.navItem,
            marginTop: "auto",
          }}
        >
          <svg
            style={styles.navIcon}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>{renderContent()}</div>
    </div>
  )
}

export default AdminDashboard


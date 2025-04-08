"use client"
import axios from 'axios';  // Add this line

import { useState } from "react"
import "../styles/AdminDashboard.css"
import AddAnimalForm from "../components/AddAnimalForm"  // Import correctly with 'from'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showForm, setShowForm] = useState(false);
  const [animals, setAnimals] = useState([
    { id: 1, name: "Buddy", type: "Dog", age: "2 years", gender: "Male", status: "Available" },
    { id: 2, name: "Luna", type: "Dog", age: "1 year", gender: "Female", status: "Adopted" },
    { id: 3, name: "Max", type: "Dog", age: "3 years", gender: "Male", status: "Available" },
    { id: 4, name: "Whiskers", type: "Cat", age: "4 years", gender: "Female", status: "Available" },
    { id: 5, name: "Rocky", type: "Dog", age: "5 years", gender: "Male", status: "Pending Adoption" },
  ]);

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

  const applications = [
    { id: 1, user: "John Doe", animal: "Buddy", date: "2023-09-15", status: "Pending" },
    { id: 2, user: "Jane Smith", animal: "Luna", date: "2023-08-22", status: "Approved" },
    { id: 3, user: "Emily Davis", animal: "Max", date: "2023-09-05", status: "Pending" },
    { id: 4, user: "Michael Wilson", animal: "Whiskers", date: "2023-09-10", status: "Rejected" },
    { id: 5, user: "Sarah Brown", animal: "Rocky", date: "2023-09-18", status: "Pending" },
  ]

  // Render status badge with appropriate class
  const renderStatusBadge = (status) => {
    let badgeClass = "status-badge"

    if (status === "Pending") {
      badgeClass += " pending-badge"
    } else if (status === "Approved") {
      badgeClass += " approved-badge"
    } else if (status === "Rejected") {
      badgeClass += " rejected-badge"
    } else if (status === "Available") {
      badgeClass += " available-badge"
    } else if (status === "Adopted" || status === "Pending Adoption") {
      badgeClass += " adopted-badge"
    }

    return <span className={badgeClass}>{status}</span>
  }

  // Render dashboard content
  const renderDashboard = () => (
    <div>
      <div className="content-header">
        <h1 className="content-title">Dashboard View</h1>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-title">TOTAL USERS</div>
          <div className="stat-value">{stats.totalUsers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">TOTAL ANIMALS</div>
          <div className="stat-value">{stats.totalAnimals}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">PENDING APPLICATIONS</div>
          <div className="stat-value">{stats.pendingApplications}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">APPROVED APPLICATIONS</div>
          <div className="stat-value">{stats.approvedApplications}</div>
        </div>
      </div>

      <div className="content-header">
        <h2 className="content-subtitle">Recent Applications</h2>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th className="table-header">ID</th>
            <th className="table-header">User</th>
            <th className="table-header">Animal</th>
            <th className="table-header">Date</th>
            <th className="table-header">Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.slice(0, 3).map((app) => (
            <tr key={app.id} className="table-row">
              <td className="table-cell">{app.id}</td>
              <td className="table-cell">{app.user}</td>
              <td className="table-cell">{app.animal}</td>
              <td className="table-cell">{app.date}</td>
              <td className="table-cell">{renderStatusBadge(app.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // Render users content
  const renderUsers = () => (
    <div>
      <div className="content-header">
        <h1 className="content-title">User Management</h1>
        <button className="admin-button">Add New User</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th className="table-header">ID</th>
            <th className="table-header">Name</th>
            <th className="table-header">Email</th>
            <th className="table-header">Role</th>
            <th className="table-header">Join Date</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="table-row">
              <td className="table-cell">{user.id}</td>
              <td className="table-cell">{user.name}</td>
              <td className="table-cell">{user.email}</td>
              <td className="table-cell">{user.role}</td>
              <td className="table-cell">{user.joinDate}</td>
              <td className="table-cell">
                <button className="action-button" title="Edit">
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
                <button className="action-button" title="Delete">
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

  //Render animal 
  const handleAddAnimal = async (formData) => {
    try {
      // Send the FormData to your backend API
      const response = await axios.post("http://localhost:8080/api/animals", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the header for file uploads
        },
      });

      console.log("Animal added successfully:", response.data);
      setShowForm(false); // Close the form after successful submission
      // Add more logic here (e.g., show success message or refresh animal list)
    } catch (error) {
      console.error("Error adding animal:", error);
      // Handle error (e.g., show error message)
    }
  };

  const renderAnimals = () => (
    <div>
      <div className="content-header">
        <h1 className="content-title">Animal Listings</h1>
        <button
          className="admin-button bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          Add New Animal
        </button>
      </div>

      {showForm && (
        <AddAnimalForm
          onSubmit={handleAddAnimal}
          onCancel={() => setShowForm(false)}
        />
      )}

      <table className="admin-table mt-6">
        <thead>
          <tr>
            <th className="table-header">ID</th>
            <th className="table-header">Name</th>
            <th className="table-header">Type</th>
            <th className="table-header">Age</th>
            <th className="table-header">Gender</th>
            <th className="table-header">Status</th>
            <th className="table-header">Actions</th>
            <th className="table-header">Description</th>
          </tr>
        </thead>
        <tbody>
          {animals.map((animal) => (
            <tr key={animal.id} className="table-row">
              <td className="table-cell">{animal.id}</td>
              <td className="table-cell">{animal.name}</td>
              <td className="table-cell">{animal.type}</td>
              <td className="table-cell">{animal.age}</td>
              <td className="table-cell">{animal.gender}</td>
              <td className="table-cell">{renderStatusBadge(animal.status)}</td>
              <td className="table-cell">
                <button className="action-button" title="Edit">✏️</button>
                <button className="action-button" title="Delete">🗑️</button>
                <button className="action-button" title="View">👁️</button>
              </td>
              <td className="table-cell">{animal.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Render applications content
  const renderApplications = () => (
    <div>
      <div className="content-header">
        <h1 className="content-title">Adoption Applications</h1>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th className="table-header">ID</th>
            <th className="table-header">User</th>
            <th className="table-header">Animal</th>
            <th className="table-header">Date</th>
            <th className="table-header">Status</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="table-row">
              <td className="table-cell">{app.id}</td>
              <td className="table-cell">{app.user}</td>
              <td className="table-cell">{app.animal}</td>
              <td className="table-cell">{app.date}</td>
              <td className="table-cell">{renderStatusBadge(app.status)}</td>
              <td className="table-cell">
                <button className="action-button" title="View">
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
                    <button className="action-button" title="Approve">
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
                    <button className="action-button" title="Reject">
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
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-title">Admin Panel</div>

        <div
          className={`nav-item ${activeTab === "dashboard" ? "active-nav-item" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <svg
            className="nav-icon"
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
          className={`nav-item ${activeTab === "users" ? "active-nav-item" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <svg
            className="nav-icon"
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
          className={`nav-item ${activeTab === "animals" ? "active-nav-item" : ""}`}
          onClick={() => setActiveTab("animals")}
        >
          <svg
            className="nav-icon"
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
          className={`nav-item ${activeTab === "applications" ? "active-nav-item" : ""}`}
          onClick={() => setActiveTab("applications")}
        >
          <svg
            className="nav-icon"
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

        <div className="nav-item logout-item">
          <svg
            className="nav-icon"
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
      <div className="admin-content">{renderContent()}</div>
    </div>
  )
}

export default AdminDashboard;
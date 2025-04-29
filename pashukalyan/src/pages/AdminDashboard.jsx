"use client";
import axios from 'axios';  
import { useState, useEffect } from "react";
import "../styles/AdminDashboard.css";
import AddAnimalForm from "../components/AddAnimalForm";
import AddFoodForm from "../components/AddFoodForm";
import { fetchAllAnimals, fetchAllFood, addFood, deleteFood,deleteAnimal, updateApplicationStatus } from '../api.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../api'; // 
import  BlogAdmin from "../components/BlogAdmin";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [showFoodForm, setShowFoodForm] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAnimals: 0,
    totalFoodItems: 0,
    pendingApplications: 0,
    approvedApplications: 0,
  });

  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "User", joinDate: "2023-05-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", joinDate: "2023-06-22" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", role: "Admin", joinDate: "2023-04-10" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", role: "User", joinDate: "2023-07-05" },
    { id: 5, name: "Michael Wilson", email: "michael@example.com", role: "User", joinDate: "2023-08-12" },
  ];

   // Load animals from the backend
   const loadAnimals = async () => {
    try {
      const response = await fetchAllAnimals();
      
      if (response && response.data) {
        setAnimals(response.data);
        updateStats({ totalAnimals: response.data.length });
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      console.error("Error loading animals:", error);
    }
  };


  // Load food items from the backend
  const loadFood = async () => {
    try {
      const response = await fetchAllFood();
      
      if (response && response.data) {
        // API returns the full response, so we need to check for data.data or just data
        const foodData = response.data.data || response.data;
        setFoodItems(foodData);
        updateStats({ totalFoodItems: Array.isArray(foodData) ? foodData.length : 0 });
        
        console.log("Food items loaded:", foodData);
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      console.error("Error loading food items:", error);
    }
  };

  // Load adoption applications from the backend
  const loadApplications = async () => {
    try {
      const response = await API.get("/adoption-applications");
      
      if (response.data && response.data.success) {
        setApplications(response.data.data);
        
        // Update stats
        const pendingCount = response.data.data.filter(app => app.status === "Pending").length;
        const approvedCount = response.data.data.filter(app => app.status === "Approved").length;
        
        updateStats({
          pendingApplications: pendingCount,
          approvedApplications: approvedCount
        });
      } else {
        console.error("Failed to load applications:", response.data);
      }
    } catch (error) {
      console.error("Error loading applications:", error);
    }
  };

 

  // Update dashboard statistics
  const updateStats = (newStats) => {
    setStats(prevStats => ({
      ...prevStats,
      ...newStats
    }));
  };

  // Handle application status update
  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      const response = await API.put(`/adoption-applications/${applicationId}/status?status=${newStatus}`);
      
      if (response.data && response.data.success) {
        console.log("Application status updated:", response.data);
        
        // Reload applications and animals to reflect changes
        await loadApplications();
        await loadAnimals();
      } else {
        console.error("Failed to update application status:", response.data);
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };


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
      await loadAnimals(); // Reload the animal list after adding a new animal
  
      // Show success toast notification
      toast.success('✅ Animal added for adoption successfully!', {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error adding animal:", error);
      toast.error('❌ Failed to add animal. Please try again.', {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };
  
  const handleDeleteAnimal = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this animal?');
    if (!confirmDelete) {
      toast.info('❌ Animal delete cancelled.', {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
  
    try {
      await deleteAnimal(id); // Call the API to delete the animal
      setAnimals((prevAnimals) => prevAnimals.filter((animal) => animal.id !== id)); // Update the local state
      toast.success('✅ Animal deleted successfully!', {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Failed to delete animal:", error);
      toast.error(error?.message || '❌ Failed to delete animal.', {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };
  
  

  // Handle the form submission to add a new food item
  const handleAddFood = async (formData) => {
    try {
      // Send the FormData to your backend API
      const response = await axios.post("http://localhost:8080/api/food", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the header for file uploads
        },
      });

      console.log("Food item added successfully:", response.data);
      setShowFoodForm(false); // Close the form after successful submission
      await loadFood(); // Reload the food list after adding a new item
    } catch (error) {
      console.error("Error adding food item:", error);
      // Handle error (e.g., show error message)
    }
  };

  // Fetch data when the component is mounted
  useEffect(() => {
    loadAnimals(); // Load animals on component mount
    loadApplications(); // Load applications on component mount
    loadFood(); // Load food items on component mount
  }, []);

  // Render status badge with appropriate class
  const renderStatusBadge = (status) => {
    let badgeClass = "status-badge";

    if (status === "Pending") {
      badgeClass += " pending-badge";
    } else if (status === "Approved") {
      badgeClass += " approved-badge";
    } else if (status === "Rejected") {
      badgeClass += " rejected-badge";
    } else if (status === "Available") {
      badgeClass += " available-badge";
    } else if (status === "Adopted" || status === "Application Pending") {
      badgeClass += " adopted-badge";
    }

    return <span className={badgeClass}>{status}</span>;
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    // If it's already in the right format, return it
    if (dateString.includes("-")) {
      return dateString;
    }
    
    // If it's a timestamp or Date object, format it
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

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
          <div className="stat-title">TOTAL FOOD ITEMS</div>
          <div className="stat-value">{stats.totalFoodItems}</div>
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
              <td className="table-cell">{app.applicantName}</td>
              <td className="table-cell">{app.animal?.name || "Unknown"}</td>
              <td className="table-cell">{formatDate(app.applicationDate)}</td>
              <td className="table-cell">{renderStatusBadge(app.status)}</td>
            </tr>
          ))}
          {applications.length === 0 && (
            <tr>
              <td colSpan="5" className="table-cell text-center">No applications found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

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
  );

  
      // Render animals content
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

      <table className="admin-table">
        <thead>
          <tr>
            <th className="table-header">ID</th>
            <th className="table-header">Name</th>
            <th className="table-header">Age</th>
            <th className="table-header">Gender</th>
            <th className="table-header">Type</th>
            <th className="table-header">Status</th>
            <th className="table-header">Description</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {animals.length > 0 ? (
            animals.map((animal) => (
              <tr key={animal.id} className="table-row">
                <td className="table-cell">{animal.id}</td>
                <td className="table-cell">{animal.name}</td>
                <td className="table-cell">{animal.age}</td>
                <td className="table-cell">{animal.gender}</td>
                <td className="table-cell">{animal.type}</td>
                <td className="table-cell">{renderStatusBadge(animal.status)}</td>
                <td className="table-cell">{animal.description}</td>
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
                  <button
  className="action-button"
  title="Delete"
  onClick={() => handleDeleteAnimal(animal.id)}
>
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
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="table-cell text-center">No animals found</td>
            </tr>
          )}
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
          <th className="table-header">Applicant</th>
          <th className="table-header">Animal</th>
          <th className="table-header">Date</th>
          <th className="table-header">Status</th>
          <th className="table-header">Actions</th>
        </tr>
      </thead>
      <tbody>
        {applications.length > 0 ? (
          applications.map((app) => (
            <tr key={app.id} className="table-row">
              <td className="table-cell">{app.id}</td>
              <td className="table-cell">{app.applicantName}</td>
              <td className="table-cell">{app.animal?.name || "Unknown"}</td>
              <td className="table-cell">{formatDate(app.applicationDate)}</td>
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
                    <button
                      className="action-button"
                      title="Approve"
                      onClick={() => handleUpdateStatus(app.id, "Approved")}
                    >
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

                    <button
                      className="action-button"
                      title="Reject"
                      onClick={() => handleUpdateStatus(app.id, "Rejected")}
                    >
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
          ))
        ) : (
          <tr>
            <td colSpan="6" className="table-cell text-center">
              No applications found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);



  // Render food content
  const renderFood = () => (
    <div>
      <div className="content-header">
        <h1 className="content-title">Food Items</h1>
        <button
          className="admin-button bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowFoodForm(true)}
        >
          Add New Food
        </button>
      </div>

      {showFoodForm && (
        <AddFoodForm
          onSubmit={handleAddFood}
          onCancel={() => setShowFoodForm(false)}
        />
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th className="table-header">ID</th>
            <th className="table-header">Image</th>
            <th className="table-header">Name</th>
            <th className="table-header">Price</th>
            <th className="table-header">Description</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {foodItems && foodItems.length > 0 ? (
            foodItems.map((food) => (
              <tr key={food.id} className="table-row">
                <td className="table-cell">{food.id}</td>
                <td className="table-cell">
                  {food.imageUrl && (
                    <img 
                      src={`http://localhost:8080${food.imageUrl}`} 
                      alt={food.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </td>
                <td className="table-cell">{food.name}</td>
                <td className="table-cell">Rs{parseFloat(food.price).toFixed(2)}</td>
                <td className="table-cell">
                  {food.description.length > 100
                    ? `${food.description.substring(0, 100)}...`
                    : food.description}
                </td>
                <td className="table-cell">
                  <button className="action-button" title="View Details">
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
                  <button 
                    className="action-button" 
                    title="Delete"
                    onClick={() => handleDeleteFood(food.id)}
                  >
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
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="table-cell text-center">No food items found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "users":
        return renderUsers();
      case "animals":
        return renderAnimals();
      case "applications":
        return renderApplications();
      case "food":
        return renderFood();
        case "blog":
      return <BlogAdmin />;
      default:
        return renderDashboard();
    }
  };

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
        
        <div
  className={`nav-item ${activeTab === "food" ? "active-nav-item" : ""}`}
  onClick={() => setActiveTab("food")}
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
    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
    <line x1="6" y1="1" x2="6" y2="4"></line>
    <line x1="10" y1="1" x2="10" y2="4"></line>
    <line x1="14" y1="1" x2="14" y2="4"></line>
  </svg>
  Food
</div>
<div
  className={`nav-item ${activeTab === "blog" ? "active-nav-item" : ""}`}
  onClick={() => setActiveTab("blog")}
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
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
  Blog
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
        <ToastContainer /> {/* Display the toast notifications */}

      </div>

      {/* Main Content */}
      <div className="admin-content">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
"use client"

import { useState, useEffect } from "react"

const BlogAdmin = () => {
  const [blogPosts, setBlogPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [formMode, setFormMode] = useState("create") // "create" or "edit"
  const [currentPost, setCurrentPost] = useState({
    id: null,
    title: "",
    content: "",
    category: "",
    author: "",
    imageFile: null,
    imagePreview: null
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Load blog posts on component mount
  useEffect(() => {
    fetchBlogPosts()
  }, [])

  // Fetch blog posts from API
  const fetchBlogPosts = async () => {
    setIsLoading(true)
    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:8080/api/blog')
      const data = await response.json()
      
      if (data.success && data.data) {
        setBlogPosts(data.data)
      } else {
        // Fallback for development
        setBlogPosts([
          {
            id: 1,
            title: "How to Prepare Your Home for a New Pet",
            content: "Bringing a new pet home is exciting, but it requires preparation...",
            imageUrl: "/placeholder.svg?height=400&width=800&text=Preparing+Home+For+Pet",
            author: "Dr. Sarah Johnson",
            date: "April 15, 2023",
            category: "Pet Care"
          }
        ])
      }
    } catch (error) {
      console.error("Failed to fetch blog posts:", error)
      setErrorMessage("Failed to load blog posts. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setCurrentPost({
      id: null,
      title: "",
      content: "",
      category: "",
      author: "",
      imageFile: null,
      imagePreview: null
    })
    setFormMode("create")
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentPost({ ...currentPost, [name]: value })
  }

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCurrentPost({
        ...currentPost,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      })
    }
  }

  // Edit a blog post
  const handleEdit = (post) => {
    setCurrentPost({
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      author: post.author,
      imageFile: null,
      imagePreview: post.imageUrl
    })
    setFormMode("edit")
    window.scrollTo(0, 0)
  }

  // Delete a blog post
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) {
      return
    }

    try {
      // Replace with your actual API endpoint
      const response = await fetch(`http://localhost:8080/api/blog/${postId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.success) {
        setBlogPosts(blogPosts.filter(post => post.id !== postId))
        setSuccessMessage("Blog post deleted successfully")
        setTimeout(() => setSuccessMessage(""), 3000)
      } else {
        setErrorMessage(data.message || "Failed to delete blog post")
        setTimeout(() => setErrorMessage(""), 3000)
      }
    } catch (error) {
      console.error("Error deleting blog post:", error)
      setErrorMessage("An error occurred while deleting the blog post")
      setTimeout(() => setErrorMessage(""), 3000)
    }
  }

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Form validation
    if (!currentPost.title || !currentPost.content || !currentPost.category || !currentPost.author) {
      setErrorMessage("Please fill in all required fields")
      setTimeout(() => setErrorMessage(""), 3000)
      return
    }

    // Create FormData object for file upload
    const formData = new FormData()
    formData.append("title", currentPost.title)
    formData.append("content", currentPost.content)
    formData.append("category", currentPost.category)
    formData.append("author", currentPost.author)
    
    if (currentPost.imageFile) {
      formData.append("image", currentPost.imageFile)
    }

    try {
      let url = 'http://localhost:8080/api/blog'
      let method = 'POST'
      
      if (formMode === "edit" && currentPost.id) {
        url = `${url}/${currentPost.id}`
        method = 'PUT'
      }

      const response = await fetch(url, {
        method: method,
        body: formData
      })
      
      const data = await response.json()
      
      if (data.success) {
        if (formMode === "create") {
          setBlogPosts([...blogPosts, data.data])
          setSuccessMessage("Blog post created successfully")
        } else {
          setBlogPosts(blogPosts.map(post => 
            post.id === currentPost.id ? data.data : post
          ))
          setSuccessMessage("Blog post updated successfully")
        }
        
        resetForm()
        setTimeout(() => setSuccessMessage(""), 3000)
      } else {
        setErrorMessage(data.message || "Failed to save blog post")
        setTimeout(() => setErrorMessage(""), 3000)
      }
    } catch (error) {
      console.error("Error saving blog post:", error)
      setErrorMessage("An error occurred while saving the blog post")
      setTimeout(() => setErrorMessage(""), 3000)
    }
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Blog Management</h1>
          <p className="text-[#757575]">Create and manage blog posts for your website</p>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        {/* Blog Post Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-black mb-4">
            {formMode === "create" ? "Create New Blog Post" : "Edit Blog Post"}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-[#757575] mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={currentPost.title}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-[#e0e0e0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9e9e9e]"
                    required
                  />
                </div>
                
                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-[#757575] mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={currentPost.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-[#e0e0e0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9e9e9e]"
                    required
                  />
                </div>
                
                {/* Author */}
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-[#757575] mb-1">
                    Author <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={currentPost.author}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-[#e0e0e0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9e9e9e]"
                    required
                  />
                </div>
                
                {/* Image */}
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-[#757575] mb-1">
                    Featured Image {formMode === "create" && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border border-[#e0e0e0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9e9e9e]"
                    required={formMode === "create"}
                  />
                </div>
              </div>
              
              <div>
                {/* Content */}
                <label htmlFor="content" className="block text-sm font-medium text-[#757575] mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={currentPost.content}
                  onChange={handleInputChange}
                  rows="12"
                  className="w-full p-3 border border-[#e0e0e0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9e9e9e]"
                  required
                ></textarea>
              </div>
            </div>
            
            {/* Image Preview */}
            {currentPost.imagePreview && (
              <div className="mt-4 mb-6">
                <p className="text-sm font-medium text-[#757575] mb-2">Image Preview:</p>
                <img 
                  src={currentPost.imagePreview}
                  alt="Preview" 
                  className="h-40 object-cover rounded-md border border-[#e0e0e0]"
                />
              </div>
            )}
            
            {/* Form Buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800 transition-colors"
              >
                {formMode === "create" ? "Create Post" : "Update Post"}
              </button>
              
              {formMode === "edit" && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-[#e0e0e0] text-black py-2 px-6 rounded-md hover:bg-[#d0d0d0] transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Blog Posts List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-bold text-black p-4 border-b border-[#e0e0e0]">
            Manage Blog Posts
          </h2>
          
          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-4"></div>
              <p className="text-[#757575]">Loading blog posts...</p>
            </div>
          ) : blogPosts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f5f5f5] text-black">
                  <tr>
                    <th className="p-4 text-left">Title</th>
                    <th className="p-4 text-left">Category</th>
                    <th className="p-4 text-left">Author</th>
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogPosts.map((post) => (
                    <tr key={post.id} className="border-t border-[#e0e0e0]">
                      <td className="p-4">
                        <div className="flex items-center">
                          <img
                            src={post.imageUrl || "/placeholder.svg"}
                            alt={post.title}
                            className="w-12 h-12 object-cover rounded-md mr-3"
                          />
                          <span className="font-medium">{post.title}</span>
                        </div>
                      </td>
                      <td className="p-4">{post.category}</td>
                      <td className="p-4">{post.author}</td>
                      <td className="p-4">{post.date}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(post)}
                            className="bg-[#f0f0f0] text-black px-3 py-1 rounded hover:bg-[#e0e0e0] transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-[#757575]">No blog posts available. Create your first post!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogAdmin;
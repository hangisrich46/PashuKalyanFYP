"use client"

import { useState, useEffect } from "react"

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch blog posts from your API
    const fetchBlogPosts = async () => {
      setIsLoading(true)
      try {
        // Replace with your actual API endpoint
        const response = await fetch('http://localhost:8080/api/blog')
        const data = await response.json()
        
        if (data.success && data.data) {
          setBlogPosts(data.data)
        } else {
          setBlogPosts([])
        }
      } catch (error) {
        console.error("Failed to fetch blog posts:", error)
        setBlogPosts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-black mb-2">Our Blog</h1>
          <p className="text-[#757575] max-w-2xl mx-auto">
            Stay updated with the latest news, pet care tips, and heartwarming stories from our shelter.
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-[#757575]">Loading blog posts...</p>
          </div>
        ) : (
          /* Blog Posts List */
          <div className="space-y-8">
            {blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img 
                        src={post.imageUrl ? `http://localhost:8080${post.imageUrl}` : "/placeholder.svg"} 
                        alt={post.title} 
                        className="w-full h-60 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center mb-2">
                        <span className="bg-[#f0f0f0] text-[#757575] text-xs px-2 py-1 rounded">
                          {post.category}
                        </span>
                        <span className="text-[#757575] text-sm ml-2">{post.date}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-black mb-3">{post.title}</h2>
                      <p className="text-[#757575] mb-4">{post.content}</p>
                      <div className="flex items-center mt-4">
                        <div className="w-8 h-8 bg-[#e0e0e0] rounded-full flex items-center justify-center mr-2">
                          <span className="text-sm font-medium">{post.author.charAt(0)}</span>
                        </div>
                        <span className="text-sm text-[#757575]">{post.author}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-[#757575] text-lg">No blog posts available yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog
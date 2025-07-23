"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import UserManagement from "./admin/UserManagement"
import FurnitureManagement from "./admin/FurnitureManagement"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users")
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your application data</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("users")}
              className={`${
                activeTab === "users"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
            >
              👥 User Management
            </button>
            <button
              onClick={() => setActiveTab("furniture")}
              className={`${
                activeTab === "furniture"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
            >
              📦 Furniture Management
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="mt-8 pb-8">
          {activeTab === "users" && <UserManagement />}
          {activeTab === "furniture" && <FurnitureManagement />}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UsersListPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCriteria, setFilterCriteria] = useState('all');
  const navigate = useNavigate();

  const fetchUsers = async (page) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await axios.get(
        `https://reqres.in/api/users?page=${page}`
      );
      setUsers(response.data.data);
      setFilteredUsers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const filtered = users.filter(user => {
      if (!searchTerm) return true;
      
      const term = searchTerm.toLowerCase();
      
      switch(filterCriteria) {
        case 'first_name':
          return user.first_name.toLowerCase().includes(term);
        case 'last_name':
          return user.last_name.toLowerCase().includes(term);
        case 'email':
          return user.email.toLowerCase().includes(term);
        case 'all':
        default:
          return (
            user.first_name.toLowerCase().includes(term) ||
            user.last_name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term)
          );
      }
    });
    
    setFilteredUsers(filtered);
  }, [searchTerm, filterCriteria, users]);

  const handleLogout = () => {
    navigate("/login");
    localStorage.removeItem("authToken")
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://reqres.in/api/users/${editingUser.id}`,
        editForm
      );
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id ? { ...user, ...editForm } : user
      );
      setUsers(updatedUsers);
      setSuccess("User updated successfully");
      setEditingUser(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update user");
      console.error(err);
    }
  };

  const handleDeleteClick = (user) => {
    setDeletingUser(user);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://reqres.in/api/users/${deletingUser.id}`);
      const updatedUsers = users.filter(user => user.id !== deletingUser.id);
      setUsers(updatedUsers);
      setSuccess('User deleted successfully');
      setDeletingUser(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
      setDeletingUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-800">
            User Directory
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 shadow-md"
          >
            Logout
          </button>
        </div>

        <div className="mb-6 bg-white p-4 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Users
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name or email..."
                className="w-full focus:outline-none p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter By
              </label>
              <select
                id="filter"
                className="w-full p-3 focus outline-none  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterCriteria}
                onChange={(e) => setFilterCriteria(e.target.value)}
              >
                <option value="all">All Fields</option>
                <option value="first_name">First Name</option>
                <option value="last_name">Last Name</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>
        </div>

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <p className="text-gray-500 text-lg">No users found matching your search criteria.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl relative group border border-white"
                    >
                      <div className="p-6">
                        <div className="flex flex-col items-center text-center">
                          <img
                            src={user.avatar}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="w-40 h-40 rounded-full mb-4 object-cover border-4 border-white shadow-md"
                          />
                          <h3 className="text-xl font-semibold text-indigo-800">
                            {user.first_name} {user.last_name}
                          </h3>
                          <p className="text-blue-600 mt-1">{user.email}</p>
                          <div className="mt-3 text-sm text-gray-500">
                            User ID: {user.id}
                          </div>
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-black group-hover:bg-black flex items-center justify-center opacity-0 group-hover:opacity-60">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full hover:from-cyan-600 hover:to-blue-700 shadow-lg"
                            title="Edit"
                          >
                            <span className="text-sm">✏️</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="p-3 bg-gradient-to-r from-red-900 to-pink-600 text-white rounded-full hover:from-red-600 hover:to-pink-700 transition shadow-lg"
                            title="Delete"
                          >
                            <span className="text-sm">❌</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === 1
                          ? "bg-gray-200 cursor-not-allowed"
                          : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-md"
                      }`}
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-full ${
                          currentPage === page
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                            : "bg-white text-blue-600 hover:bg-blue-50 border border-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === totalPages
                          ? "bg-gray-200 cursor-not-allowed"
                          : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-md"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-white">
              <h2 className="text-xl font-semibold mb-4 text-indigo-800">Edit User</h2>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                    value={editForm.first_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, first_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                    value={editForm.last_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, last_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deletingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-white">
              <h2 className="text-xl font-semibold mb-4 text-indigo-800">Confirm Deletion</h2>
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete {deletingUser.first_name} {deletingUser.last_name}?
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeletingUser(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 shadow-md"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersListPage;
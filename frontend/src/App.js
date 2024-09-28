import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const baseURL = "http://localhost:5000";
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showSignUpForm, setShowSignUpForm] = useState(false); // State to show/hide signup form
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const [showDeletePopup, setShowDeletePopup] = useState(false); // State for delete popup visibility
  const [userToDelete, setUserToDelete] = useState(null); // Track the user to delete

  // Fetch all users from API
  const fetchUsers = async () => {
    const { data } = await axios.get(`${baseURL}/api/users`);
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle deleting a user after confirmation
  const deleteUser = async () => {
    try {
      await axios.delete(`${baseURL}/api/users/${userToDelete}`);
      fetchUsers();  
      setShowDeletePopup(false); 
      setUserToDelete(null);  
    } catch (error) {
      console.error(error);
    }
  };

  // Open the delete confirmation popup
  const confirmDeleteUser = (userId) => {
    setUserToDelete(userId);  
    setShowDeletePopup(true);  
  };

  // Handle signup form submission
  const handleSignUp = async (e) => {
    e.preventDefault();
    
    console.log('New user data:', newUser); 
  
    try {
      const response = await axios.post(`${baseURL}/api/users`, newUser);
      fetchUsers();  
      setShowSignUpForm(false);
      setNewUser({ firstName: '', lastName: '', email: '', password: '' });
    } catch (error) {
      console.error(error);
    }
  };

  // Handle exporting users to CSV
  const exportUsers = async () => {
    const response = await axios.get(`${baseURL}/api/users/export`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="container">
      <h1 className="title">User Management</h1>
      <div className="button-container">
        <button className="export-button" onClick={exportUsers}>Export CSV</button>
        <button className="signup-button" onClick={() => setShowSignUpForm(true)}>Sign Up</button> 
      </div>

      {/* Signup form */}
      {showSignUpForm && (
        <form className="signup-form" onSubmit={handleSignUp}>
          <div>
            <label>First Name: </label>
            <input
              type="text"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Last Name: </label>
            <input
              type="text"
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Email: </label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Password: </label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
            />
          </div>
          <div>
            <button className="signup-submit" type="submit">Submit</button>
            <button className="signup-cancel" type="button" onClick={() => setShowSignUpForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <table className="user-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => {
                    const selected = selectedUsers.includes(user._id)
                      ? selectedUsers.filter((id) => id !== user._id)
                      : [...selectedUsers, user._id];
                    setSelectedUsers(selected);
                  }}
                />
              </td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => confirmDeleteUser(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="popup-actions">
              <button onClick={deleteUser} className="delete-btn">Delete</button>
              <button onClick={() => setShowDeletePopup(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

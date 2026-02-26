import React, { useState } from 'react';
import './RoleManagementTable.css';

const RoleManagementTable = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Esther Howard', email: 'kenzi.lawson@example.com', role: 'Super Admin', status: 'Active' },
    { id: 2, name: 'Kristin Watson', email: 'jackson.graham@example.com', role: 'Admin', status: 'Active' },
    { id: 3, name: 'Floyd Miles', email: 'curtis.weaver@example.com', role: 'Student', status: 'Active' },
    { id: 4, name: 'Darrell Steward', email: 'sara.cruz@example.com', role: 'Student', status: 'Deactivate' },
    { id: 5, name: 'Ronald Richards', email: 'nevaeh.simmons@example.com', role: 'Student', status: 'Active' }
  ]);

  const handleStatusChange = (id, newStatus) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, status: newStatus } : user
    ));
  };

  const handleAddNew = () => {
    alert('Add new user functionality - Backend integration pending');
  };

  return (
    <div className="role-table-container">
      <table className="role-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select
                  value={user.status}
                  onChange={(e) => handleStatusChange(user.id, e.target.value)}
                  className={`status-select ${user.status.toLowerCase()}`}
                >
                  <option value="Active">Active</option>
                  <option value="Deactivate">Deactivate</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-new-btn" onClick={handleAddNew}>
        Add new
      </button>
    </div>
  );
};

export default RoleManagementTable;
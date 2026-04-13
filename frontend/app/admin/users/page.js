'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    api.get('/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  };

  const updateRole = async (userId, newRole) => {
    if (currentUser.role !== 'superadmin') {
      toast.error('Only superadmin can change roles');
      return;
    }
    
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      toast.success('Role updated!');
      loadUsers();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Users</h1>

      <div className="overflow-x-auto overflow-y-hidden rounded-lg border bg-white">
        <table className="w-full min-w-[860px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Role</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Joined</th>
              {currentUser?.role === 'superadmin' && (
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block whitespace-nowrap px-3 py-1 rounded-full text-xs ${
                    user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block whitespace-nowrap px-3 py-1 rounded-full text-xs ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                {currentUser?.role === 'superadmin' && (
                  <td className="whitespace-nowrap px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user._id, e.target.value)}
                      className="px-3 py-1 border rounded"
                      disabled={user._id === currentUser._id}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

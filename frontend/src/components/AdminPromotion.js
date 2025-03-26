// frontend/src/components/AdminPromotion.js
import React, { useState, useEffect } from 'react';

const AdminPromotion = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');

    // Fetch users (assuming you have an endpoint that returns all users)
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (response.ok) {
                    setUsers(data.users);
                } else {
                    setMessage(data.message || 'Error fetching users');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setMessage('Error fetching users');
            }
        };
        fetchUsers();
    }, [token]);

    const handlePromote = async (userId) => {
        setMessage('');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/promote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message || 'User promoted successfully');
                // Update the local list to reflect the promotion
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === userId ? { ...user, role: 'admin' } : user
                    )
                );
            } else {
                setMessage(data.message || 'Promotion failed');
            }
        } catch (error) {
            console.error('Promotion error:', error);
            setMessage('An error occurred during promotion');
        }
    };

    return (
        <div>
            <h2>Admin Promotion</h2>
            {message && <p>{message}</p>}
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Promote</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                {user.role !== 'admin' && (
                                    <button onClick={() => handlePromote(user.id)}>
                                        Promote to Admin
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPromotion;

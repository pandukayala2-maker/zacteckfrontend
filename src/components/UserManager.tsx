import React, { useState, useEffect, FormEvent } from 'react';
import { useData } from '../context/DataContext';
import { Shield, UserPlus, Edit2, Trash2, User as UserIcon, X, Check } from 'lucide-react';
import { User } from '../types';

interface UserManagerProps {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
}

const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Kumar (You)',
    username: 'admin',
    designation: 'Marketing Manager',
    role: 'Administrator',
    status: 'Active',
    avatarColor: '#d31e25'
  },
  {
    id: 'user-2',
    name: 'Sales Representative',
    username: 'sales_rep1',
    designation: 'Wholesale Agent',
    role: 'Editor',
    status: 'Active',
    avatarColor: '#3b82f6'
  }
];

export default function UserManager({ onNotify }: UserManagerProps) {
  const { settings } = useData();

  // Users State with LocalStorage sync
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('zactek_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch (e) {
      return INITIAL_USERS;
    }
  });

  useEffect(() => {
    localStorage.setItem('zactek_users', JSON.stringify(users));
  }, [users]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [designation, setDesignation] = useState('');
  const [role, setRole] = useState<'Administrator' | 'Editor' | 'Viewer'>('Editor');
  const [password, setPassword] = useState('');

  const handleOpenAddModal = () => {
    setEditId(null);
    setFullName('');
    setUsername('');
    setDesignation('');
    setRole('Editor');
    setPassword('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditId(user.id);
    setFullName(user.name.replace(' (You)', ''));
    setUsername(user.username);
    setDesignation(user.designation);
    setRole(user.role);
    setPassword('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !designation.trim()) {
      onNotify('error', 'Please fill in all required fields.');
      return;
    }

    if (editId) {
      // Edit User
      setUsers(users.map(u => 
        u.id === editId ? {
          ...u,
          name: editId === 'user-1' ? `${fullName.trim()} (You)` : fullName.trim(),
          username: username.trim(),
          designation: designation.trim(),
          role: role
        } : u
      ));
      onNotify('success', `User "${fullName.trim()}" updated successfully!`);
    } else {
      // Add User
      const colors = ['#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const newUser: User = {
        id: `user-${Date.now()}`,
        name: fullName.trim(),
        username: username.trim().toLowerCase(),
        designation: designation.trim(),
        role: role,
        status: 'Active',
        avatarColor: randomColor
      };

      setUsers([...users, newUser]);
      onNotify('success', `User "${fullName.trim()}" added successfully!`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteUser = (user: User) => {
    if (user.id === 'user-1' || user.username === 'admin') {
      onNotify('error', 'Primary Administrator account cannot be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      return;
    }

    setUsers(users.filter(u => u.id !== user.id));
    onNotify('error', `User "${user.name}" removed.`);
  };

  return (
    <div className="animate-fade-in" style={{ textAlign: 'left' }}>
      
      {/* Top Action Row */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button onClick={handleOpenAddModal} className="btn btn-primary" style={styles.headerBtn}>
          <UserPlus size={16} /> Add New User
        </button>
      </div>

      {/* Users Table Panel */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={styles.tableTitle}>
          <Shield size={18} color="var(--color-primary)" /> Active Admin Users ({users.length})
        </h3>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>AVATAR</th>
                <th>NAME</th>
                <th>USERNAME</th>
                <th>DESIGNATION</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th style={{ width: '100px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="user-avatar-circle" style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%',
                      backgroundColor: u.avatarColor || '#d31e25',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: '700',
                      fontSize: '0.85rem'
                    }}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                  </td>

                  <td>
                    <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{u.name}</strong>
                  </td>

                  <td>
                    <code>{u.username}</code>
                  </td>

                  <td>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                      {u.designation}
                    </span>
                  </td>

                  <td>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: u.role === 'Administrator' ? 'rgba(211, 30, 37, 0.15)' : 
                                       u.role === 'Editor' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      color: u.role === 'Administrator' ? '#f87171' : 
                             u.role === 'Editor' ? '#60a5fa' : 'var(--color-text-secondary)',
                      border: `1px solid ${u.role === 'Administrator' ? 'rgba(211, 30, 37, 0.3)' : 
                                          u.role === 'Editor' ? 'rgba(59, 130, 246, 0.3)' : 'var(--color-border)'}`
                    }}>
                      {u.role}
                    </span>
                  </td>

                  <td>
                    <span className="status-badge active">
                      &bull; Active
                    </span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleOpenEditModal(u)}
                        style={styles.actionIconBtn} 
                        title="Edit User"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(u)}
                        style={{ ...styles.actionIconBtn, color: '#f87171' }} 
                        title="Delete User"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()} className="glass-panel animate-fade-in">
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                <UserIcon size={18} color="var(--color-primary)" /> {editId ? 'Edit User Details' : 'Add New System User'}
              </h3>
              <button style={styles.modalCloseBtn} onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.modalForm}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. rahul_sales"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Designation / Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Wholesale Executive"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role Assignment *</label>
                <select
                  className="form-control"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                >
                  <option value="Administrator">Administrator (Full Access)</option>
                  <option value="Editor">Editor (Add/Edit Products & Categories)</option>
                  <option value="Viewer">Viewer (Read-only)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Password {!editId && '*'}</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder={editId ? 'Leave blank to keep unchanged' : 'Enter password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!editId}
                />
              </div>

              <div style={styles.modalFooter}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} /> {editId ? 'Update User' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
  },
  subtitle: {
    color: 'var(--color-text-secondary)',
    fontSize: '0.9rem',
    marginTop: '4px',
  },
  headerBtn: {
    padding: '10px 18px',
    fontSize: '0.9rem',
  },
  tableTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  actionIconBtn: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-secondary)',
    padding: '6px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modalContent: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#0c0f1b',
    borderRadius: '16px',
    border: '1px solid var(--color-border)',
    padding: '24px',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  modalTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '10px',
  }
};

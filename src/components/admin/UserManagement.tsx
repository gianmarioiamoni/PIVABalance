'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { UserResponse } from '@/types';
import {
    UsersIcon,
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    ShieldCheckIcon,
    UserIcon,
    ExclamationTriangleIcon,
    PencilIcon,
    KeyIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import { EditUserModal, ResetPasswordModal, DeleteUserModal } from './';

/**
 * User Management Component
 * 
 * Handles the display and management of all system users.
 * Features:
 * - User list with pagination
 * - Search and filtering capabilities
 * - Role management
 * - User status management
 * - Responsive design
 * 
 * Security:
 * - Only accessible to admin users
 * - Role-based action restrictions
 * - Audit trail for all actions
 */

interface UsersData {
    users: UserResponse[];
    total: number;
}

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters and pagination
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('');
    const [activeFilter, setActiveFilter] = useState<string>('');

    // Modal states
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const limit = 10;

    // Load users data
    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });

            if (search) params.append('search', search);
            if (roleFilter) params.append('role', roleFilter);
            if (activeFilter) params.append('active', activeFilter);

            const data = await api.get<UsersData>(`/admin/users?${params.toString()}`);
            setUsers(data.users);
            setTotal(data.total);

        } catch (err: unknown) {
            console.error('Error loading users:', err);
            const errorMessage = err && typeof err === 'object' && 'data' in err && err.data && typeof err.data === 'object' && 'error' in err.data
                ? String(err.data.error)
                : 'Errore nel caricamento degli utenti';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [page, search, roleFilter, activeFilter, limit]);

    // Load users on component mount and filter changes
    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // Handle search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setPage(1); // Reset to first page on search
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search]);

    // Modal handlers
    const handleEditUser = (user: UserResponse) => {
        setSelectedUser(user);
        setEditModalOpen(true);
    };

    const handleResetPassword = (user: UserResponse) => {
        setSelectedUser(user);
        setResetPasswordModalOpen(true);
    };

    const handleDeleteUser = (user: UserResponse) => {
        setSelectedUser(user);
        setDeleteModalOpen(true);
    };

    const handleUserUpdated = (updatedUser: UserResponse) => {
        if (!updatedUser?.id) {
            console.error('Updated user is missing id');
            return;
        }

        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === updatedUser.id ? updatedUser : user
            )
        );
        setEditModalOpen(false);
        setSelectedUser(null);
    };

    const handleUserDeleted = (deletedUserId: string) => {
        if (!deletedUserId) {
            console.error('Deleted user ID is missing');
            return;
        }

        setUsers(prevUsers => prevUsers.filter(user => user.id !== deletedUserId));
        setTotal(prev => prev - 1);
        setDeleteModalOpen(false);
        setSelectedUser(null);
    };

    const handleCloseModals = () => {
        setEditModalOpen(false);
        setResetPasswordModalOpen(false);
        setDeleteModalOpen(false);
        setSelectedUser(null);
    };

    // Role badge styling
    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'super_admin':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'admin':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Role icon
    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'super_admin':
                return <ExclamationTriangleIcon className="h-4 w-4" />;
            case 'admin':
                return <ShieldCheckIcon className="h-4 w-4" />;
            default:
                return <UserIcon className="h-4 w-4" />;
        }
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-6">
            {/* Header with Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card">
                    <div className="card-body text-center">
                        <UsersIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">{total}</div>
                        <div className="text-sm text-gray-600">Utenti Totali</div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body text-center">
                        <ShieldCheckIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">
                            {users.filter(u => u.role === 'admin' || u.role === 'super_admin').length}
                        </div>
                        <div className="text-sm text-gray-600">Amministratori</div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body text-center">
                        <UserIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">
                            {users.filter(u => u.isActive).length}
                        </div>
                        <div className="text-sm text-gray-600">Utenti Attivi</div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body text-center">
                        <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">
                            {users.filter(u => !u.isActive).length}
                        </div>
                        <div className="text-sm text-gray-600">Utenti Sospesi</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card">
                <div className="card-header">
                    <div className="flex items-center space-x-2">
                        <AdjustmentsHorizontalIcon className="h-5 w-5 text-primary" />
                        <h3 className="heading-sm">Filtri e Ricerca</h3>
                    </div>
                </div>
                <div className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cerca per nome o email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="input-field pl-10"
                            />
                        </div>

                        {/* Role Filter */}
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="input-field"
                        >
                            <option value="">Tutti i ruoli</option>
                            <option value="user">Utenti</option>
                            <option value="admin">Amministratori</option>
                            <option value="super_admin">Super Admin</option>
                        </select>

                        {/* Active Filter */}
                        <select
                            value={activeFilter}
                            onChange={(e) => setActiveFilter(e.target.value)}
                            className="input-field"
                        >
                            <option value="">Tutti gli stati</option>
                            <option value="true">Attivi</option>
                            <option value="false">Sospesi</option>
                        </select>

                        {/* Clear Filters */}
                        <button
                            onClick={() => {
                                setSearch('');
                                setRoleFilter('');
                                setActiveFilter('');
                                setPage(1);
                            }}
                            className="btn-secondary"
                        >
                            Pulisci Filtri
                        </button>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="card">
                <div className="card-header">
                    <h3 className="heading-sm">Lista Utenti</h3>
                </div>
                <div className="card-body p-0">
                    {error && (
                        <div className="p-4 bg-red-50 border-b border-red-200">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="text-sm text-gray-600 mt-2">Caricamento utenti...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-8 text-center">
                            <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">Nessun utente trovato</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Utente
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ruolo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Stato
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ultimo Accesso
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Registrato
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Azioni
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadge(user.role)}`}>
                                                    {getRoleIcon(user.role)}
                                                    <span>
                                                        {user.role === 'super_admin' ? 'Super Admin' :
                                                            user.role === 'admin' ? 'Admin' : 'Utente'}
                                                    </span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {user.isActive ? 'Attivo' : 'Sospeso'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user.lastLogin
                                                    ? new Date(user.lastLogin).toLocaleDateString('it-IT')
                                                    : 'Mai'
                                                }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(user.createdAt).toLocaleDateString('it-IT')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    {/* Edit User */}
                                                    <button
                                                        onClick={() => handleEditUser(user)}
                                                        className="p-1 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded"
                                                        title="Modifica utente"
                                                    >
                                                        <PencilIcon className="h-4 w-4" />
                                                    </button>

                                                    {/* Reset Password */}
                                                    <button
                                                        onClick={() => handleResetPassword(user)}
                                                        className="p-1 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded"
                                                        title="Reset password"
                                                    >
                                                        <KeyIcon className="h-4 w-4" />
                                                    </button>

                                                    {/* Delete User - Only show if not super admin */}
                                                    {user.role !== 'super_admin' && (
                                                        <button
                                                            onClick={() => handleDeleteUser(user)}
                                                            className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                                                            title="Elimina utente"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="card-footer">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Mostra {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} di {total} utenti
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Precedente
                                </button>
                                <span className="px-3 py-2 text-sm text-gray-700">
                                    Pagina {page} di {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                                    disabled={page === totalPages}
                                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Successiva
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {selectedUser && (
                <>
                    <EditUserModal
                        user={selectedUser}
                        isOpen={editModalOpen}
                        onClose={handleCloseModals}
                        onUserUpdated={handleUserUpdated}
                    />

                    <ResetPasswordModal
                        user={selectedUser}
                        isOpen={resetPasswordModalOpen}
                        onClose={handleCloseModals}
                    />

                    <DeleteUserModal
                        user={selectedUser}
                        isOpen={deleteModalOpen}
                        onClose={handleCloseModals}
                        onUserDeleted={handleUserDeleted}
                    />
                </>
            )}
        </div>
    );
};

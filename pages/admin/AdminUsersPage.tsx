import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    Shield,
    Loader2,
    Trash2
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useModal } from '../../context/ModalContext';

interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    role: string;
    created_at: string;
    status: string;
    avatar_url: string | null;
}

const AdminUsersPage: React.FC = () => {
    const { showModal } = useModal();
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            // Don't alert on initial load if just empty, but log it.
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id: string) => {
        showModal({
            type: 'confirm',
            title: 'Delete User',
            message: 'Are you sure you want to delete this user? This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            onConfirm: async () => {
                try {
                    // Delete from profiles (and potentially auth via edge function if set up, but here just db)
                    const { error } = await supabase.from('profiles').delete().eq('id', id);
                    if (error) throw error;
                    setUsers(users.filter(u => u.id !== id));
                    showModal({ type: 'success', title: 'Deleted', message: 'User deleted successfully.' });
                } catch (error) {
                    console.error('Error deleting user:', error);
                    showModal({ type: 'error', title: 'Error', message: 'Failed to delete user.' });
                }
            }
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white">User Management</h2>
                    <p className="text-brand-muted text-sm mt-1">Manage user access and permissions.</p>
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full bg-brand-card border border-brand-border rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-brand-gold focus:ring-0 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-brand-muted gap-2">
                        <Loader2 className="animate-spin" size={24} />
                        Loading users...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-brand-surface border-b border-brand-border">
                                    <th className="px-6 py-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-brand-muted uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-border">
                                {users.filter(user =>
                                (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
                                ).map((user) => (
                                    <tr key={user.id} className="hover:bg-brand-surface/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-brand-black border border-brand-border flex items-center justify-center font-bold text-brand-muted overflow-hidden">
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} alt={user.email} className="w-full h-full object-cover" />
                                                    ) : (
                                                        (user.full_name || user.email).charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{user.full_name || 'Unnamed User'}</div>
                                                    <div className="text-xs text-brand-muted">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${user.role === 'admin'
                                                ? 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                                                : 'bg-brand-black border-brand-border text-brand-muted'
                                                }`}>
                                                {user.role === 'admin' && <Shield size={10} />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-brand-muted">
                                            {formatDate(user.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${user.status === 'active'
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                                                }`}>
                                                {user.status || 'active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-brand-muted hover:text-red-500 transition-colors p-2 hover:bg-brand-surface rounded-lg"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {users.length === 0 && (
                            <div className="text-center py-10 text-brand-muted">
                                No users found. (Ensure you run the users_schema.sql to create the profiles table!)
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsersPage;

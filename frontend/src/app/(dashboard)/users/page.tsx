'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  UserCheck,
  UserPlus,
  Search,
  ShieldCheck,
  Power,
  Trash2,
  Mail,
  Phone,
  Lock,
  X,
  CheckCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  useGetUsersQuery,
  useCreateStaffMutation,
  useDeactivateStaffMutation,
  useDeleteStaffMutation,
} from '@/features/users/services/userApi';
import { User } from '@/types/user';
import { PageGuard } from '@/components/auth/PageGuard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { ROLES, UserRole, ADMIN_ROLES } from '@/constants/permissions';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function UsersPage() {
  return (
    <PageGuard
      requiredRoles={ADMIN_ROLES}
      requiredPermission="users:read"
      title="Staff Users — Access Restricted"
      message="Only the Cafe Admin / Manager has permission to view and manage staff login credentials."
    >
      <UsersContent />
    </PageGuard>
  );
}

function UsersContent() {
  const { isOwner } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<string>('STAFF');
  const [showPassword, setShowPassword] = useState(false);

  const { data: response, isLoading, isFetching, refetch } = useGetUsersQuery({
    search: search || undefined,
    role: (roleFilter as UserRole) || undefined,
  });

  const [createStaff, { isLoading: isCreating }] = useCreateStaffMutation();
  const [deactivateStaff, { isLoading: isDeactivating }] = useDeactivateStaffMutation();
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();

  const usersList = response?.data?.items || [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    try {
      const res = await createStaff({
        name,
        email,
        password,
        role: (role === 'ADMIN' ? 'ADMIN' : 'STAFF') as UserRole,
        phone: phone || undefined,
      }).unwrap();

      if (res.success) {
        toast.success(`Staff user "${name}" created successfully!`);
        setIsCreateModalOpen(false);
        setName('');
        setEmail('');
        setPassword('');
        setPhone('');
      } else {
        toast.error(res.message || 'Failed to create user.');
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message || 'Failed to create user.';
      toast.error(errorMsg);
    }
  };

  const handleDeactivate = async (u: User) => {
    if (u.role === 'ADMIN') {
      toast.error('Admin accounts cannot be deactivated here.');
      return;
    }
    if (!confirm(`Are you sure you want to deactivate/toggle ${u.name}'s account?`)) return;
    try {
      const res = await deactivateStaff(u._id).unwrap();
      if (res.success) {
        toast.success(`Account status updated for ${u.name}`);
      } else {
        toast.error(res.message || 'Failed to update user status.');
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message || 'Failed to update user status.';
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (u: User) => {
    if (u.role === 'ADMIN') {
      toast.error('Admin accounts cannot be deleted here.');
      return;
    }
    if (!confirm(`Are you sure you want to permanently delete user account "${u.name}"?`)) return;
    try {
      const res = await deleteStaff(u._id).unwrap();
      if (res.success) {
        toast.success(`User account "${u.name}" removed successfully.`);
      } else {
        toast.error(res.message || 'Failed to delete user.');
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message || 'Failed to delete user.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-lg">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-100">
              Staff User Accounts
            </h1>
            <p className="text-xs text-slate-400">
              Create, manage, and assign system access roles (Admin, Staff)
            </p>
          </div>
        </div>

        {/* Add User Action (Admin) */}
        <RoleGuard roles={ADMIN_ROLES}>
          <Button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <UserPlus className="h-4 w-4 mr-1.5" />
            <span>Add Staff User</span>
          </Button>
        </RoleGuard>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff by name or email..."
            className="pl-9 h-10 bg-slate-900 border-slate-800 text-xs text-slate-100 rounded-xl"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-10 rounded-xl border border-slate-800 bg-slate-900 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="STAFF">Staff</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Assigned Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Created Date</th>
                {isOwner && <th className="px-5 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={isOwner ? 5 : 4} className="px-5 py-12 text-center text-slate-400">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent mb-2" />
                    Loading staff accounts...
                  </td>
                </tr>
              ) : usersList.length === 0 ? (
                <tr>
                  <td colSpan={isOwner ? 5 : 4} className="px-5 py-12 text-center text-slate-500">
                    No staff accounts found matching your filters.
                  </td>
                </tr>
              ) : (
                usersList.map((u) => {
                  const isAdminRole = u.role === 'ADMIN' || (u.role as string) === 'OWNER' || (u.role as string) === 'MANAGER';
                  const roleCfg = isAdminRole
                    ? { label: '👑 Admin', bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30' }
                    : { label: '🧑‍💼 Staff', bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' };

                  const isActive = u.status === 'ACTIVE' || u.isActive;

                  return (
                    <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="font-semibold text-slate-100">{u.name}</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="h-3 w-3 text-slate-500" />
                          <span>{u.email}</span>
                          {u.phone && (
                            <>
                              <span className="text-slate-600">•</span>
                              <Phone className="h-3 w-3 text-slate-500" />
                              <span>{u.phone}</span>
                            </>
                          )}
                        </p>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${roleCfg.bg}`}>
                          {roleCfg.label}
                        </span>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>

                      {/* Actions (Admin ONLY) */}
                      {isOwner && (
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          {u.email !== 'admin@gmail.com' ? (
                            <div className="flex items-center justify-end space-x-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeactivate(u)}
                                disabled={isDeactivating}
                                className="h-8 px-2 text-xs text-amber-400 hover:bg-amber-400/10"
                                title="Toggle Status"
                              >
                                <Power className="h-3.5 w-3.5 mr-1" />
                                <span>{isActive ? 'Deactivate' : 'Activate'}</span>
                              </Button>

                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(u)}
                                disabled={isDeleting}
                                className="h-8 w-8 p-0 text-rose-400 hover:bg-rose-400/10"
                                title="Delete User"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">Root Account</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff User Modal (Owner ONLY) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-100">Create Staff User</h3>
                  <p className="text-xs text-slate-400">Add Manager or Cashier login credentials</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Saroj Shrestha"
                  className="h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-amber-400" />
                  <span>Email Address *</span>
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="saroj@cafe.com"
                  className="h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>Phone Number</span>
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+977 9801234567"
                  className="h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                    <span>System Role *</span>
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-800 bg-slate-950 px-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="STAFF">🧑‍💼 Staff / Cashier (POS Operations)</option>
                    <option value="ADMIN">👑 Admin / Manager (Full Access)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5 text-amber-400" />
                    <span>Password *</span>
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="h-10 pr-8 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2.5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-xs text-slate-400"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20"
                >
                  {isCreating ? 'Creating...' : 'Create Staff Account'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

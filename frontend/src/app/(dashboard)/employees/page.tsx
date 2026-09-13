'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  useGetEmployeesQuery,
  useDeleteEmployeeMutation,
  Employee,
  EmployeeShift,
  EmployeeStatus,
  EmployeeStatsBar,
  EmployeeTable,
  EmployeeFormModal,
  AttendanceModal,
  AttendanceHistoryModal,
} from '@/features/employees';
import { Search, UserPlus, Users, Filter, RefreshCw, AlertCircle, AlertTriangle, Trash2 } from 'lucide-react';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { PageGuard } from '@/components/auth/PageGuard';
import { ROLES } from '@/constants/permissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function EmployeesPage() {
  return (
    <PageGuard
      requiredRoles={[ROLES.ADMIN]}
      requiredPermission="employees:read"
      title="Employees HR — Restricted Access"
      message="Employee profiles, salaries, shifts, and attendance logs are strictly restricted to the Cafe Admin."
    >
      <EmployeesContent />
    </PageGuard>
  );
}

function EmployeesContent() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [shiftFilter, setShiftFilter] = useState<EmployeeShift | ''>('');
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | ''>('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // Queries & Mutations
  const { data: response, isLoading, isFetching, isError, error, refetch } = useGetEmployeesQuery({
    page,
    limit,
    search: search || undefined,
    shift: shiftFilter || undefined,
    status: statusFilter || undefined,
  });

  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();

  const allEmployees = response?.data?.items || [];
  const totalCount = response?.data?.total || allEmployees.length;

  const handleOpenCreateModal = () => {
    setSelectedEmployee(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsFormModalOpen(true);
  };

  const handleOpenRecordAttendance = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsAttendanceModalOpen(true);
  };

  const handleOpenViewAttendance = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsHistoryModalOpen(true);
  };

  const handleOpenDelete = (emp: Employee) => {
    setEmployeeToDelete(emp);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;
    try {
      const res = await deleteEmployee(employeeToDelete._id).unwrap();
      if (res.success) {
        toast.success(`Employee "${employeeToDelete.fullName}" deleted successfully.`);
        setIsDeleteModalOpen(false);
        setEmployeeToDelete(null);
      } else {
        toast.error(res.message || 'Failed to delete employee.');
      }
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || 'Failed to delete employee.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-lg">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
              Employee & HR Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage staff profiles, daily attendance logs, salary information, and work shifts
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-10 border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-amber-400 text-xs rounded-xl cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${isFetching ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refresh</span>
          </Button>

          {/* Add Employee Button (Owner & Manager ONLY) */}
          <PermissionGuard permission="employees:manage">
            <Button
              onClick={handleOpenCreateModal}
              size="sm"
              className="h-10 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <UserPlus className="h-4 w-4 mr-1.5 stroke-[2.5]" />
              <span>Add Employee</span>
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* Summary Stats */}
      <EmployeeStatsBar
        employees={allEmployees}
        selectedStatus={statusFilter}
        onSelectStatus={(status) => {
          setStatusFilter(status);
          setPage(1);
        }}
      />

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-xl">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, email, or employee ID..."
            className="pl-10 h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 rounded-xl"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Shift Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <select
              value={shiftFilter}
              onChange={(e) => {
                setShiftFilter(e.target.value as EmployeeShift | '');
                setPage(1);
              }}
              className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="">All Shifts</option>
              <option value="MORNING">Morning Shift</option>
              <option value="EVENING">Evening Shift</option>
              <option value="NIGHT">Night Shift</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as EmployeeStatus | '');
              setPage(1);
            }}
            className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active Staff</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="TERMINATED">Terminated</option>
            <option value="RESIGNED">Resigned</option>
          </select>
        </div>
      </div>

      {/* Main Employee Content */}
      {isError ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-rose-300">
          <AlertCircle className="h-8 w-8 mb-2 text-rose-400" />
          <p className="font-semibold text-sm">Failed to load staff records</p>
          <p className="text-xs text-rose-400 mt-1">
            {(error as { data?: { message?: string } })?.data?.message || 'Server error occurred'}
          </p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="mt-4 border-rose-500/30 bg-slate-900 text-xs rounded-xl"
          >
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <div className="h-64 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 animate-pulse" />
      ) : (
        <EmployeeTable
          employees={allEmployees}
          totalCount={totalCount}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          onRecordAttendance={handleOpenRecordAttendance}
          onViewAttendance={handleOpenViewAttendance}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDelete}
        />
      )}

      {/* Form Modal */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        employee={selectedEmployee}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedEmployee(null);
        }}
      />

      {/* Attendance Modal */}
      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        employee={selectedEmployee}
        onClose={() => {
          setIsAttendanceModalOpen(false);
          setSelectedEmployee(null);
        }}
      />

      {/* Attendance History Modal */}
      <AttendanceHistoryModal
        isOpen={isHistoryModalOpen}
        employee={selectedEmployee}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setSelectedEmployee(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && employeeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-md rounded-3xl border border-rose-500/30 bg-slate-900 p-6 shadow-2xl ring-1 ring-rose-500/20 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 mb-4">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <h3 className="font-heading text-lg font-bold text-slate-100 mb-1">
              Delete Staff Member
            </h3>

            <p className="text-xs text-slate-400 max-w-xs mx-auto mb-6">
              Are you sure you want to delete <strong className="text-amber-400">&quot;{employeeToDelete.fullName}&quot; ({employeeToDelete.position})</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setEmployeeToDelete(null);
                }}
                disabled={isDeleting}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 cursor-pointer"
              >
                {isDeleting ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Deleting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5">
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Confirm Delete</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

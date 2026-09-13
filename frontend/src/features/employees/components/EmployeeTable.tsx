'use client';

import { Employee } from '../types/employee.types';
import { EMPLOYEE_SHIFT_CONFIG, EMPLOYEE_STATUS_CONFIG } from '../utils/status.utils';
import { CalendarCheck, History, Edit2, Edit3, Trash2, ChevronLeft, ChevronRight, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface EmployeeTableProps {
  employees: Employee[];
  totalCount: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onRecordAttendance: (employee: Employee) => void;
  onViewAttendance: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function EmployeeTable({
  employees,
  totalCount,
  page,
  limit,
  onPageChange,
  onLimitChange,
  onRecordAttendance,
  onViewAttendance,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  const { hasPermission } = useAuth();
  const canManage = hasPermission('employees:manage');
  const totalPages = Math.ceil(totalCount / limit) || 1;

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th scope="col" className="px-5 py-4">Employee</th>
              <th scope="col" className="px-5 py-4">Position</th>
              <th scope="col" className="px-5 py-4">Shift</th>
              <th scope="col" className="px-5 py-4">Salary</th>
              <th scope="col" className="px-5 py-4">Status</th>
              <th scope="col" className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                  No staff members found matching your filters.
                </td>
              </tr>
            ) : (
              employees.map((emp) => {
                const shiftCfg = EMPLOYEE_SHIFT_CONFIG[emp.shift] || EMPLOYEE_SHIFT_CONFIG.MORNING;
                const statusCfg = EMPLOYEE_STATUS_CONFIG[emp.status] || EMPLOYEE_STATUS_CONFIG.ACTIVE;
                const ShiftIcon = shiftCfg.icon;

                return (
                  <tr key={emp._id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-amber-400 font-bold">
                          {emp.employeeId || emp._id.slice(-6).toUpperCase()}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-100">{emp.fullName}</p>
                          <p className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                            <Mail className="h-3 w-3 inline text-slate-500" />
                            <span>{emp.email}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-medium text-slate-200">{emp.position}</p>
                      {emp.user && typeof emp.user === 'object' && (emp.user as any).role ? (
                        <span className="inline-flex items-center text-[10px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded-md mt-1">
                          {(emp.user as any).role}
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] text-slate-500 mt-1">HR Only</span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${shiftCfg.badgeClass}`}>
                        <ShiftIcon className="h-3.5 w-3.5" />
                        <span>{shiftCfg.label}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-mono font-extrabold text-amber-400 text-sm">
                      Rs.{(emp.salary || 0).toLocaleString()} <span className="text-[10px] text-slate-400 font-sans font-normal">/mo</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${statusCfg.badgeClass}`}>
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {canManage && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onRecordAttendance(emp)}
                            className="h-8 px-2.5 rounded-lg text-amber-400 hover:bg-amber-400/10 text-xs cursor-pointer"
                            title="Record Attendance"
                          >
                            <CalendarCheck className="h-3.5 w-3.5 mr-1" />
                            <span>Attendance</span>
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewAttendance(emp)}
                          className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer"
                          title="Attendance History"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                        {canManage && (
                          <>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(emp)}
                              className="h-8 w-8 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 cursor-pointer"
                              title="Edit Employee"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => onDelete(emp)}
                              className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 cursor-pointer"
                              title="Delete Employee"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {employees.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center text-xs text-slate-500">
            No staff members found matching your filters.
          </div>
        ) : (
          employees.map((emp) => {
            const shiftCfg = EMPLOYEE_SHIFT_CONFIG[emp.shift] || EMPLOYEE_SHIFT_CONFIG.MORNING;
            const statusCfg = EMPLOYEE_STATUS_CONFIG[emp.status] || EMPLOYEE_STATUS_CONFIG.ACTIVE;
            const ShiftIcon = shiftCfg.icon;

            return (
              <div key={emp._id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3 shadow-lg">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-sm">{emp.fullName}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-amber-400 font-bold">
                        {emp.employeeId || emp._id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail className="h-3 w-3 text-slate-500" />
                      <span>{emp.email}</span>
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${statusCfg.badgeClass}`}>
                    {statusCfg.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Position</span>
                    <p className="font-medium text-slate-200 mt-0.5">{emp.position}</p>
                    {emp.user && typeof emp.user === 'object' && (emp.user as any).role && (
                      <span className="inline-block text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded mt-1">
                        {(emp.user as any).role} Login
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Shift & Salary</span>
                    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${shiftCfg.badgeClass} mt-0.5`}>
                      <ShiftIcon className="h-3 w-3" />
                      <span>{shiftCfg.label}</span>
                    </span>
                    <p className="font-mono font-bold text-amber-400 text-xs mt-1">
                      Rs. {(emp.salary || 0).toLocaleString()}/mo
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  {canManage ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onRecordAttendance(emp)}
                      className="h-8 px-2.5 rounded-xl border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-xs cursor-pointer"
                    >
                      <CalendarCheck className="h-3.5 w-3.5 mr-1" />
                      <span>Attendance</span>
                    </Button>
                  ) : <div />}
                  <div className="flex items-center space-x-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewAttendance(emp)}
                      className="h-8 px-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs cursor-pointer"
                      title="Attendance History"
                    >
                      <History className="h-3.5 w-3.5 mr-1" />
                      <span>History</span>
                    </Button>
                    {canManage && (
                      <>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(emp)}
                          className="h-8 w-8 p-0 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(emp)}
                          className="h-8 w-8 p-0 rounded-xl text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Footer */}
      {totalCount > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 bg-slate-950/60 border-t border-slate-800 text-slate-400 text-xs">
          <div className="flex items-center space-x-2">
            <span>Show</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="h-8 rounded-lg border border-slate-800 bg-slate-900 px-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>entries per page</span>
          </div>

          <div className="flex items-center space-x-4">
            <span>
              Page <strong className="text-slate-200">{page}</strong> of <strong className="text-slate-200">{totalPages}</strong>
            </span>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(Math.max(page - 1, 1))}
                disabled={page === 1}
                className="h-8 w-8 border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-40 rounded-lg cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                disabled={page >= totalPages}
                className="h-8 w-8 border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-40 rounded-lg cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

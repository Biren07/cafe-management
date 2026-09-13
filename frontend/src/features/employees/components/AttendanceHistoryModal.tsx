'use client';

import { Employee } from '../types/employee.types';
import { useGetEmployeeAttendanceQuery } from '../services/employeeApi';
import { ATTENDANCE_STATUS_CONFIG } from '../utils/status.utils';
import { X, CalendarCheck, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AttendanceHistoryModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
}

export function AttendanceHistoryModal({
  isOpen,
  employee,
  onClose,
}: AttendanceHistoryModalProps) {
  const { data: attendanceResponse, isLoading } = useGetEmployeeAttendanceQuery(employee?._id || '', {
    skip: !isOpen || !employee,
  });

  if (!isOpen || !employee) return null;

  const attendanceList = attendanceResponse?.data?.attendance || employee.attendance || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-slate-100">Attendance Log History</h3>
              <p className="text-xs text-slate-400 font-semibold">{employee.fullName} ({employee.position})</p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Attendance List Body */}
        <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-1">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 rounded-2xl bg-slate-950 border border-slate-800 animate-pulse" />
              ))}
            </div>
          ) : attendanceList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-xs">
              <CalendarCheck className="h-8 w-8 mb-2 opacity-40" />
              <p>No attendance logs recorded for this employee yet.</p>
            </div>
          ) : (
            attendanceList.map((log, idx) => {
              const cfg = ATTENDANCE_STATUS_CONFIG[log.status] || ATTENDANCE_STATUS_CONFIG.PRESENT;
              const dateStr = log.date ? new Date(log.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
              const inStr = log.checkIn ? new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;
              const outStr = log.checkOut ? new Date(log.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-200 flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{dateStr}</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.badgeClass}`}>
                        {cfg.label}
                      </span>
                    </div>

                    {(inStr || outStr) && (
                      <div className="text-[11px] text-slate-400 flex items-center space-x-3 font-mono">
                        {inStr && <span>In: <strong className="text-emerald-400">{inStr}</strong></span>}
                        {outStr && <span>Out: <strong className="text-rose-400">{outStr}</strong></span>}
                      </div>
                    )}

                    {log.notes && (
                      <p className="text-[11px] text-slate-400 line-clamp-1 italic">{log.notes}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-800 shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

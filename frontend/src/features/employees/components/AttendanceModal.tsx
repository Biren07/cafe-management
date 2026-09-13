'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Employee, AttendanceStatus } from '../types/employee.types';
import { useRecordAttendanceMutation } from '../services/employeeApi';
import { X, CalendarCheck, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AttendanceModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
}

export function AttendanceModal({ isOpen, employee, onClose }: AttendanceModalProps) {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<AttendanceStatus>('PRESENT');
  const [checkInTime, setCheckInTime] = useState<string>('09:00');
  const [checkOutTime, setCheckOutTime] = useState<string>('17:00');
  const [notes, setNotes] = useState<string>('');

  const [recordAttendance, { isLoading }] = useRecordAttendanceMutation();

  if (!isOpen || !employee) return null;

  const handleSubmit = async () => {
    try {
      // Build ISO strings for checkIn and checkOut if status is PRESENT or LATE or HALF_DAY
      const checkInISO =
        status !== 'ABSENT' && status !== 'ON_LEAVE' && checkInTime
          ? new Date(`${date}T${checkInTime}:00`).toISOString()
          : undefined;
      const checkOutISO =
        status !== 'ABSENT' && status !== 'ON_LEAVE' && checkOutTime
          ? new Date(`${date}T${checkOutTime}:00`).toISOString()
          : undefined;

      const res = await recordAttendance({
        id: employee._id,
        date,
        status,
        checkIn: checkInISO,
        checkOut: checkOutISO,
        notes: notes || undefined,
      }).unwrap();

      if (res.success) {
        toast.success(`Attendance recorded for "${employee.fullName}" (${status}).`);
        onClose();
      } else {
        toast.error(res.message || 'Failed to record attendance.');
      }
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || 'Failed to record attendance.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-slate-100">Record Daily Attendance</h3>
              <p className="text-xs text-slate-400 font-semibold">{employee.fullName} ({employee.employeeId})</p>
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

        {/* Form Body */}
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Attendance Date *
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Attendance Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
                className="w-full h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="PRESENT">PRESENT (On Time)</option>
                <option value="LATE">LATE (Delayed)</option>
                <option value="HALF_DAY">HALF DAY</option>
                <option value="ABSENT">ABSENT</option>
                <option value="ON_LEAVE">ON LEAVE</option>
              </select>
            </div>
          </div>

          {status !== 'ABSENT' && status !== 'ON_LEAVE' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
                  <Clock className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Check In Time</span>
                </label>
                <Input
                  type="time"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  className="h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
                  <Clock className="h-3.5 w-3.5 text-rose-400" />
                  <span>Check Out Time</span>
                </label>
                <Input
                  type="time"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  className="h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Notes / Reason (Optional)
            </label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Traffic delay, Approved leave"
              className="h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="h-4 w-4" />
                  <span>Save Attendance</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

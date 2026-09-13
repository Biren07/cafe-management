'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  X,
  UserPlus,
  CheckCircle,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  Clock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useCreateEmployeeMutation, useUpdateEmployeeMutation } from '../services/employeeApi';
import { Employee } from '../types/employee.types';
import { employeeFormSchema, EmployeeFormData } from '../schemas/employee.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EmployeeFormModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
}

export function EmployeeFormModal({ isOpen, employee, onClose }: EmployeeFormModalProps) {
  const isEditing = !!employee;
  const [showPassword, setShowPassword] = useState(false);

  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();

  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema) as any,
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      position: '',
      salary: 1500,
      shift: 'MORNING',
      status: 'ACTIVE',
      createLoginAccount: false,
      role: 'CASHIER',
      password: '',
    },
  });

  const createLoginAccountValue = watch('createLoginAccount');

  useEffect(() => {
    if (isOpen) {
      if (employee) {
        reset({
          fullName: employee.fullName,
          email: employee.email,
          phone: employee.phone || '',
          position: employee.position,
          salary: employee.salary,
          shift: employee.shift,
          status: employee.status,
          createLoginAccount: false,
          role: 'CASHIER',
          password: '',
        });
      } else {
        reset({
          fullName: '',
          email: '',
          phone: '',
          position: '',
          salary: 1500,
          shift: 'MORNING',
          status: 'ACTIVE',
          createLoginAccount: false,
          role: 'CASHIER',
          password: '',
        });
      }
    }
  }, [employee, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      if (isEditing && employee) {
        const res = await updateEmployee({
          id: employee._id,
          body: {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone || undefined,
            position: data.position,
            salary: Number(data.salary),
            shift: data.shift,
            status: data.status,
          },
        }).unwrap();

        if (res.success) {
          toast.success(`Employee "${data.fullName}" updated successfully!`);
          onClose();
        } else {
          toast.error(res.message || 'Failed to update employee.');
        }
      } else {
        const res = await createEmployee({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone || undefined,
          position: data.position,
          salary: Number(data.salary),
          shift: data.shift,
          status: data.status,
          createLoginAccount: data.createLoginAccount,
          role: data.role,
          password: data.password || undefined,
        }).unwrap();

        if (res.success) {
          toast.success(
            data.createLoginAccount
              ? `Employee "${data.fullName}" added with login credentials!`
              : `Employee "${data.fullName}" added successfully!`
          );
          onClose();
        } else {
          toast.error(res.message || 'Failed to create employee.');
        }
      }
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} employee.`;
      toast.error(errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-100">
                {isEditing ? 'Edit Staff Profile' : 'Add New Staff Member'}
              </h2>
              <p className="text-xs text-slate-400">Configure employee HR info, position & salary</p>
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
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name *
              </label>
              <Input
                {...register('fullName')}
                placeholder="e.g. John Doe"
                className="h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
              />
              {errors.fullName && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
                <Mail className="h-3.5 w-3.5 text-amber-400" />
                <span>Email Address *</span>
              </label>
              <Input
                type="email"
                {...register('email')}
                placeholder="john@cafe.com"
                className="h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
              />
              {errors.email && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>Phone Number</span>
              </label>
              <Input
                {...register('phone')}
                placeholder="+1 555-0192"
                className="h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
                <Briefcase className="h-3.5 w-3.5 text-amber-400" />
                <span>Position / Designation *</span>
              </label>
              <Input
                {...register('position')}
                placeholder="e.g. Head Barista, Chef, Cashier"
                className="h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
              />
              {errors.position && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.position.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
                <span className="text-emerald-400 font-bold text-xs">Rs.</span>
                <span>Salary (Rs./mo) *</span>
              </label>
              <Input
                type="number"
                min={0}
                {...register('salary')}
                className="h-10 bg-slate-950 border-slate-800 text-xs font-mono text-slate-100 rounded-xl"
              />
              {errors.salary && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.salary.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                <span>Assigned Shift</span>
              </label>
              <select
                {...register('shift')}
                className="w-full h-10 rounded-xl border border-slate-800 bg-slate-950 px-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="MORNING">Morning Shift</option>
                <option value="EVENING">Evening Shift</option>
                <option value="NIGHT">Night Shift</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Staff Status
              </label>
              <select
                {...register('status')}
                className="w-full h-10 rounded-xl border border-slate-800 bg-slate-950 px-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="ACTIVE">Active Staff</option>
                <option value="ON_LEAVE">On Leave</option>
                <option value="TERMINATED">Terminated</option>
                <option value="RESIGNED">Resigned</option>
              </select>
            </div>
          </div>

          {/* Grant System Login Access (For New Employees or Non-Linked) */}
          {!isEditing && (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3.5 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      Grant System Login Access
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-normal">
                        Optional
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Creates a system user account so this staff member can log in to the POS/App
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('createLoginAccount')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {createLoginAccountValue && (
                <div className="pt-3 border-t border-amber-500/20 grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* System Role */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                      <span>System Role *</span>
                    </label>
                    <select
                      {...register('role')}
                      className="w-full h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="STAFF">🧑‍💼 Staff (POS & Operations)</option>
                      <option value="ADMIN">👑 Admin (Full Access)</option>
                    </select>
                    {errors.role && (
                      <p className="text-[11px] text-rose-400 mt-1">{errors.role.message}</p>
                    )}
                  </div>

                  {/* Initial Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                      <span className="flex items-center space-x-1">
                        <KeyRound className="h-3.5 w-3.5 text-amber-400" />
                        <span>Login Password *</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setValue('password', 'staff123', { shouldValidate: true })}
                        className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                      >
                        Default: staff123
                      </button>
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        placeholder="Min 6 characters"
                        className="h-10 pr-9 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-[11px] text-rose-400 mt-1">{errors.password.message}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
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
              type="submit"
              disabled={isLoading}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  <span>{isEditing ? 'Saving...' : 'Adding...'}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="h-4 w-4" />
                  <span>{isEditing ? 'Update Employee' : 'Add Employee'}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

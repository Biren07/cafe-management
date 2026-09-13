import { z } from 'zod';

export const employeeFormSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name cannot exceed 100 characters'),
    email: z
      .string()
      .trim()
      .min(1, 'Email address is required')
      .email('Invalid email address format'),
    phone: z.string().optional().or(z.literal('')),
    position: z
      .string()
      .trim()
      .min(1, 'Position/Designation is required')
      .max(100, 'Position cannot exceed 100 characters'),
    salary: z.coerce.number().min(0, 'Salary must be a non-negative number'),
    shift: z.enum(['MORNING', 'EVENING', 'NIGHT', 'FULL_TIME', 'PART_TIME']),
    status: z.enum(['ACTIVE', 'ON_LEAVE', 'TERMINATED', 'RESIGNED']),
    user: z.string().optional().or(z.literal('')),
    createLoginAccount: z.boolean().default(false),
    role: z.enum(['MANAGER', 'CASHIER']).optional(),
    password: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.createLoginAccount) {
        return !!data.password && data.password.length >= 6;
      }
      return true;
    },
    {
      message: 'Password must be at least 6 characters for staff login account',
      path: ['password'],
    }
  );

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;

export const attendanceFormSchema = z.object({
  date: z.string().optional(),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE']),
  checkIn: z.string().optional().or(z.literal('')),
  checkOut: z.string().optional().or(z.literal('')),
  notes: z.string().optional(),
});

export type AttendanceFormData = z.infer<typeof attendanceFormSchema>;

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@api';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@components/ui/Card';
import { toast } from 'sonner';
import { Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const resetSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

type ResetForm = z.infer<typeof resetSchema>;

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetForm) => {
    if (!token) {
      toast.error('Invalid reset token');
      return;
    }
    setIsLoading(true);
    try {
      await authApi.resetPassword({
        token,
        email: email || '',
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      toast.success('Password has been reset successfully');
      navigate('/login');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-950 p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="px-8 py-12">
            <Lock className="mx-auto mb-4 h-12 w-12 text-red-400" />
            <h1 className="mb-2 text-2xl font-bold text-white">Invalid Reset Link</h1>
            <p className="mb-6 text-dark-400">
              This password reset link is invalid or has expired.
            </p>
            <Link to="/forgot-password">
              <Button>Request New Link</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-950 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link to="/login" className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-gold-500">
              <span className="text-sm font-bold text-dark-950">XAU</span>
            </div>
            <span className="text-xl font-bold text-white">XAU Market Pro</span>
          </Link>
        </div>

        <Card className="bg-dark-900/80">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="relative">
                <Input
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password')}
                  autoComplete="new-password"
                  icon={<Lock className="h-4 w-4" />}
                  helperText="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-dark-400 transition-colors hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password_confirmation?.message}
                {...register('password_confirmation')}
                autoComplete="new-password"
                icon={<Lock className="h-4 w-4" />}
              />

              <Button type="submit" className="w-full" size="lg" loading={isLoading}>
                <Loader2 className="h-4 w-4" aria-hidden="true" />
                Reset Password
              </Button>
            </form>
            <CardFooter className="flex-col gap-4">
              <p className="w-full text-center text-sm text-dark-400">
                Remember your password?{' '}
                <Link to="/login" className="font-medium text-primary-400 hover:text-primary-300">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

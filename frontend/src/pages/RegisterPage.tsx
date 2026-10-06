import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useAuthStore from '@stores/authStore';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@components/ui/Card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await register(data.name, data.email, data.password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error((error as Error).message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-950">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link to="/login" className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center">
              <span className="text-sm font-bold text-dark-950">XAU</span>
            </div>
            <span className="font-bold text-xl text-white">XAU Market Pro</span>
          </Link>
        </div>

        <Card className="bg-dark-900/80">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create account</CardTitle>
            <CardDescription>Start your gold trading journey today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                error={errors.name?.message}
                {...registerField('name')}
                autoComplete="name"
                autoFocus
              />

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...registerField('email')}
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...registerField('password')}
                autoComplete="new-password"
                helperText="At least 8 characters"
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                error={errors.password_confirmation?.message}
                {...registerField('password_confirmation')}
                autoComplete="new-password"
              />

              <Button type="submit" className="w-full" size="lg" loading={isLoading}>
                <Loader2 className="w-4 h-4" aria-hidden="true" />
                Create Account
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-900 text-dark-500">Or</span>
              </div>
            </div>

            <p className="text-xs text-dark-500 text-center">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary-400 hover:text-primary-300">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-primary-400 hover:text-primary-300">Privacy Policy</a>
            </p>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <p className="text-sm text-dark-400 text-center w-full">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
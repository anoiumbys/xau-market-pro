import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@api';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@components/ui/Card';
import { toast } from 'sonner';
import { Loader2, Mail } from 'lucide-react';

const forgotSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true);
    try {
      await authApi.forgotPassword(data);
      toast.success('Password reset link sent to your email');
      navigate('/login');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
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
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <CardDescription>Enter your email to receive a password reset link</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
                autoComplete="email"
                autoFocus
                icon={<Mail className="w-4 h-4" />}
              />

              <Button type="submit" className="w-full" size="lg" loading={isLoading}>
                <Loader2 className="w-4 h-4" aria-hidden="true" />
                Send Reset Link
              </Button>
            </form>
            <CardFooter className="flex-col gap-4">
              <p className="text-sm text-dark-400 text-center w-full">
                Remember your password?{' '}
                <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
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
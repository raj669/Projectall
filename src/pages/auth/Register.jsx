import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Check, X } from 'lucide-react';

const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name cannot exceed 60 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/\d/, 'Password must contain a number')
    .regex(/[@$!%*?&]/, 'Password must contain a special character (@$!%*?&)')
});

const PasswordStrengthIndicator = ({ password }) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password)
  };

  const strength = Object.values(checks).filter(Boolean).length;
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i < strength ? strengthColors[strength - 1] : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <ul className="space-y-1 text-xs">
        {Object.entries(checks).map(([key, value]) => (
          <li key={key} className="flex items-center gap-2">
            {value ? <Check className="h-3 w-3 text-green-600" /> : <X className="h-3 w-3 text-gray-400" />}
            <span className={value ? 'text-green-600' : 'text-gray-500'}>
              {key === 'length' && 'At least 8 characters'}
              {key === 'uppercase' && 'Uppercase letter (A-Z)'}
              {key === 'lowercase' && 'Lowercase letter (a-z)'}
              {key === 'number' && 'Number (0-9)'}
              {key === 'special' && 'Special character (@$!%*?&)'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, authError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const passwordValue = watch('password') || '';

  const onSubmit = async (data) => {
    try {
      setError('');
      setIsLoading(true);
      await registerUser(data.name, data.email, data.password);
      navigate('/buy');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
          <CardDescription>Join our real estate community</CardDescription>
        </CardHeader>
        <CardContent>
          {(error || authError) && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error || authError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <Input
                {...register('name')}
                type="text"
                placeholder="John Doe"
                className="mt-1"
                disabled={isLoading}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                {...register('email')}
                type="email"
                placeholder="your@email.com"
                className="mt-1"
                disabled={isLoading}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="mt-1"
                disabled={isLoading}
              />
              {passwordValue && (
                <div className="mt-3">
                  <PasswordStrengthIndicator password={passwordValue} />
                </div>
              )}
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

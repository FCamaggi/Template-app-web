import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormField, FormItem } from '@/components/ui/form';
import type { LoginCredentials } from '@/features/auth/types';

const schema = yup
  .object({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
  })
  .required();

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginCredentials>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: LoginCredentials) => {
    login(data);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            create a new account
          </Link>
        </p>
      </CardHeader>

      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField name="email">
              <FormItem label="Email address">
                <Input
                  type="email"
                  {...form.register('email')}
                  placeholder="Email"
                  autoComplete="email"
                  autoFocus
                />
              </FormItem>
            </FormField>

            <FormField name="password">
              <FormItem label="Password">
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    {...form.register('password')}
                    placeholder="Password"
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </FormItem>
            </FormField>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}

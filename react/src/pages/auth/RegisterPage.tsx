// src/pages/auth/RegisterPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormField, FormItem } from '@/components/ui/form';
import { Radio } from '@/components/ui/radio';
import { Select } from '@/components/ui/select';
import type { RegisterCredentials } from '@/features/auth/types';

const schema = yup
  .object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    experience_level: yup
      .string()
      .oneOf(['beginner', 'intermediate', 'advanced'])
      .required('Experience level is required'),
    preferred_measurement: yup
      .string()
      .oneOf(['RM', 'Borg'])
      .required('Preferred measurement is required'),
  })
  .required();

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterCredentials>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: RegisterCredentials) => {
    registerUser(data);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            sign in to your account
          </Link>
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField name="name">
            <FormItem label="Full name">
              <Input
                {...form.register('name')}
                placeholder="Full name"
                autoComplete="name"
                autoFocus
              />
            </FormItem>
          </FormField>

          <FormField name="email">
            <FormItem label="Email address">
              <Input
                type="email"
                {...form.register('email')}
                placeholder="Email"
                autoComplete="email"
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
                  autoComplete="new-password"
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

          <FormField name="experience_level">
            <FormItem label="Experience level">
              <Select {...form.register('experience_level')}>
                <option value="">Select your experience level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
            </FormItem>
          </FormField>

          <FormField name="preferred_measurement">
            <FormItem label="Preferred measurement">
              <div className="space-y-2">
                <Radio
                  label="Repetition Maximum (RM)"
                  value="RM"
                  {...form.register('preferred_measurement')}
                />
                <Radio
                  label="Borg Scale"
                  value="Borg"
                  {...form.register('preferred_measurement')}
                />
              </div>
            </FormItem>
          </FormField>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

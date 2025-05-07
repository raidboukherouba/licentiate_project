// LoginForm.tsx
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth-context'; // Adjust the import path

interface LoginFormProps extends React.ComponentPropsWithoutRef<'form'> {}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/'); // Redirect to home page after successful login
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <form className={cn('flex flex-col gap-6', className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <img
          className="h-12 w-auto mb-4"
          src="./logo-univ-guelma.png"
          alt="Université 8 Mai 1945 Guelma Logo"
        />
        <h1 className="text-2xl font-bold">{t('login.title')}</h1>
        <p className="text-balance text-sm text-muted-foreground">{t('login.subtitle')}</p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">{t('login.email')}</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">{t('login.password')}</Label>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              {t('login.forgot_password')}
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full">
          {t('login.login_button')}
        </Button>
      </div>
    </form>
  );
}
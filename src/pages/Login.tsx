import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur">
              <Building2 className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="font-heading text-4xl font-bold text-primary-foreground mb-4">
            EstateFlow CRM
          </h1>
          <p className="text-lg text-primary-foreground/80">
            Streamline your real estate business with powerful lead management,
            team collaboration, and insightful analytics.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-primary-foreground/80">
            <div>
              <p className="text-3xl font-bold text-primary-foreground">500+</p>
              <p className="text-sm">Properties Sold</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-foreground">98%</p>
              <p className="text-sm">Client Satisfaction</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-foreground">24/7</p>
              <p className="text-sm">Support Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden mb-8 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold text-foreground">
              Welcome Back
            </h2>
            <p className="mt-2 text-muted-foreground">
              Sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 rounded-lg bg-muted p-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Demo Credentials:
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                <span className="font-medium">Admin:</span> admin@realestate.com / admin123
              </p>
              <p>
                <span className="font-medium">Supervisor:</span> supervisor@realestate.com / super123
              </p>
              <p>
                <span className="font-medium">Sales:</span> sales1@realestate.com / sales123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

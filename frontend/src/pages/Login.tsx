import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link2, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Link2 className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Links Dashboard</h1>
          </div>
          <h2 className="text-xl font-semibold text-center mb-4">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <Mail className="w-4 h-4 opacity-70" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="grow"
                  required
                />
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <Lock className="w-4 h-4 opacity-70" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="grow"
                  required
                />
              </label>
            </div>
            <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
              {isLoading && <span className="loading loading-spinner loading-sm"></span>}
              Sign In
            </button>
          </form>
          <div className="divider">OR</div>
          <p className="text-center text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="link link-primary">
              Sign up
            </Link>
          </p>
          <div className="mt-4 p-3 bg-base-200 rounded-lg text-sm">
            <p className="font-semibold mb-1">Demo credentials:</p>
            <p>Email: admin@example.com</p>
            <p>Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

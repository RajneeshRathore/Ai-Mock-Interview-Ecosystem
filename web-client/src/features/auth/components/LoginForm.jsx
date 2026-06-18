import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Failed to login');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Email"
          type="email" 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com" 
        />
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <button type="button" onClick={() => navigate('/forgot-password')} className="text-xs text-primary-600 hover:underline">Forgot Password?</button>
          </div>
          <Input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
          />
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          <input type="checkbox" id="remember" className="rounded text-primary-600 focus:ring-primary-500" />
          <label htmlFor="remember" className="text-sm text-slate-600">Remember me</label>
        </div>
        
        <Button 
          type="submit"
          isLoading={isSubmitting}
          className="w-full mt-6"
        >
          Login
        </Button>
      </form>
    </div>
  );
}

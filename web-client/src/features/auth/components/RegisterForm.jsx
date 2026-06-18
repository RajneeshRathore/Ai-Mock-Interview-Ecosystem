import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const result = await register(name, email, password);
      if (result.success) {
        navigate('/verify-email', { replace: true, state: { email } });
      } else {
        setError(result.error || 'Failed to create account');
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
          label="Full Name"
          type="text" 
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe" 
        />
        <Input 
          label="Email"
          type="email" 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com" 
        />
        <Input 
          label="Password"
          type="password" 
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••" 
        />
        
        <div className="flex items-start gap-2 pt-2">
          <input type="checkbox" required id="terms" className="rounded text-primary-600 focus:ring-primary-500 mt-1" />
          <label htmlFor="terms" className="text-xs text-slate-600 leading-tight">
            I agree to the <a href="#" className="text-primary-600 hover:underline">Terms & Conditions</a>
          </label>
        </div>
        
        <Button 
          type="submit"
          isLoading={isSubmitting}
          className="w-full mt-6"
        >
          Create Account
        </Button>
      </form>
    </div>
  );
}

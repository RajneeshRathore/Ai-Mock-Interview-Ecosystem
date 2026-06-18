import { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';

export function ResetPasswordForm({ onReset, isSubmitting, error }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");
    
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    onReset(password);
  };

  return (
    <div className="w-full">
       <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Set New Password</h2>
          <p className="text-slate-500">
            Create a new strong password for your account.
          </p>
       </div>
       
       {(error || localError) && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4 text-center">
          {error || localError}
        </div>
       )}

       <form onSubmit={handleSubmit} className="space-y-4">
         <Input 
           label="New Password"
           type="password"
           required
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           placeholder="••••••••"
         />
         <Input 
           label="Confirm Password"
           type="password"
           required
           value={confirmPassword}
           onChange={(e) => setConfirmPassword(e.target.value)}
           placeholder="••••••••"
         />
         
         <Button 
           type="submit" 
           disabled={!password || !confirmPassword || isSubmitting} 
           isLoading={isSubmitting}
           className="w-full mt-4"
         >
           Reset Password
         </Button>
       </form>
    </div>
  );
}

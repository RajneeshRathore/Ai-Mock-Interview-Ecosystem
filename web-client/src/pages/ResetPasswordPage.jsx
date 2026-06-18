import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ResetPasswordForm } from '../features/auth/components/ResetPasswordForm';
import { resetPasswordWithOtp } from '../services/userService';
import resetImage from '../assets/images/reset_password_ill.png';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const otp = location.state?.otp;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // If accessed directly without verifying OTP first
  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleReset = async (newPassword) => {
    setIsSubmitting(true);
    setError('');
    try {
      await resetPasswordWithOtp(email, otp, newPassword);
      navigate('/login', { replace: true, state: { message: 'Password reset successfully. Please login.' } });
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden flex flex-col items-center pt-12 px-8 pb-12">
         
         <div className="w-40 h-40 mb-8 rounded-full bg-green-50/50 flex items-center justify-center overflow-hidden p-6">
            <img src={resetImage} alt="Reset Password" className="w-full h-full object-contain drop-shadow-md" />
         </div>

         <ResetPasswordForm 
           onReset={handleReset}
           isSubmitting={isSubmitting}
           error={error}
         />

      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordForm } from '../features/auth/components/ForgotPasswordForm';
import { forgotPassword } from '../services/userService';
import forgotImage from '../assets/images/forgot_password_ill.png';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (email) => {
    setIsSubmitting(true);
    setError('');
    try {
      await forgotPassword(email);
      return true;
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to send OTP');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (email, otp) => {
    setIsSubmitting(true);
    setError('');
    try {
      // We don't verify here — we pass the OTP to the reset page
      navigate('/reset-password', { state: { email, otp } });
    } catch (e) {
      setError('An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden flex flex-col items-center pt-12 px-8 pb-12">
         
         <div className="w-40 h-40 mb-8 rounded-full bg-primary-50/50 flex items-center justify-center overflow-hidden p-6">
            <img src={forgotImage} alt="Forgot Password" className="w-full h-full object-contain drop-shadow-md" />
         </div>

         <ForgotPasswordForm 
           onSendOTP={handleSendOTP}
           onVerifyOTP={handleVerifyOTP}
           isSubmitting={isSubmitting}
           error={error}
         />

      </div>
    </div>
  );
}

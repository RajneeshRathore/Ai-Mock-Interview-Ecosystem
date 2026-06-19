import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { VerifyEmailForm } from '../features/auth/components/VerifyEmailForm';
import { verifyOTP } from '../services/authService';
import verifyImage from '../assets/images/verify_email_ill.png';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'user@example.com';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (otp) => {
    setIsSubmitting(true);
    setError('');
    try {
      const res = await verifyOTP(email, otp);
      if (res.success) {
        navigate('/login', { replace: true });
      } else {
        setError(res.error || 'Invalid OTP');
      }
    } catch (e) {
      setError('An error occurred. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden flex flex-col items-center pt-12 px-8 pb-12">
         
         <div className="w-40 h-40 mb-8 rounded-full bg-primary-50/50 flex items-center justify-center overflow-hidden p-6">
            <img src={verifyImage} alt="Verify Email" className="w-full h-full object-contain drop-shadow-md" />
         </div>

         <VerifyEmailForm 
           email={email}
           onVerify={handleVerify}
           isSubmitting={isSubmitting}
           error={error}
         />

      </div>
    </div>
  );
}

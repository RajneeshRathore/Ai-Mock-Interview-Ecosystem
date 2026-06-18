import { useState, useEffect } from 'react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { OTPInput } from './OTPInput';

export function ForgotPasswordForm({ onSendOTP, onVerifyOTP, isSubmitting, error }) {
  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(45);

  useEffect(() => {
    if (step === 'otp' && countdown > 0) {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [countdown, step]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) return;
    const success = await onSendOTP(email);
    if (success) {
      setStep('otp');
      setCountdown(45);
    }
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      onVerifyOTP(email, otp);
    }
  };

  if (step === 'email') {
    return (
      <div className="w-full">
         <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Forgot Password?</h2>
            <p className="text-slate-500">
              Enter your email address and we'll send you a 6-digit OTP to reset your password.
            </p>
         </div>
         
         {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
         )}
  
         <form onSubmit={handleSendOTP} className="space-y-6">
           <Input 
             label="Email Address"
             type="email"
             required
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             placeholder="john@example.com"
           />
           <Button 
             type="submit" 
             disabled={!email || isSubmitting} 
             isLoading={isSubmitting}
             className="w-full"
           >
             Send OTP
           </Button>
         </form>
      </div>
    );
  }

  return (
    <div className="w-full">
       <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Reset Your Password</h2>
          <p className="text-slate-500">
            Enter the 6-digit code sent to <br/>
            <span className="font-bold text-slate-900">{email}</span>
          </p>
       </div>
       
       {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4 text-center">
          {error}
        </div>
       )}

       <form onSubmit={handleVerifyOTP} className="flex flex-col items-center">
         <OTPInput length={6} value={otp} onChange={setOtp} />
         
         <div className="text-sm text-slate-500 mb-8">
            {countdown > 0 ? (
              <span>Resend code in <span className="font-bold text-primary-600">00:{countdown.toString().padStart(2, '0')}</span></span>
            ) : (
              <button 
                type="button" 
                onClick={(e) => { e.preventDefault(); handleSendOTP(e); }} 
                className="text-primary-600 font-bold hover:underline"
              >
                Resend Code
              </button>
            )}
         </div>

         <Button 
           type="submit" 
           disabled={otp.length < 6 || isSubmitting} 
           isLoading={isSubmitting}
           className="w-full"
         >
           Verify OTP
         </Button>
       </form>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Button } from '../../../components/common/Button';
import { OTPInput } from './OTPInput';

export function VerifyEmailForm({ email, onVerify, isSubmitting, error }) {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(45);

  useEffect(() => {
    if (countdown > 0) {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [countdown]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  return (
    <div className="w-full">
       <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Verify Your Email</h2>
          <p className="text-slate-500">
            We've sent a 6-digit code to <br/>
            <span className="font-bold text-slate-900">{email}</span>
          </p>
       </div>
       
       {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4 text-center">
          {error}
        </div>
       )}

       <form onSubmit={handleSubmit} className="flex flex-col items-center">
         <OTPInput length={6} value={otp} onChange={setOtp} />
         
         <div className="text-sm text-slate-500 mb-8">
            {countdown > 0 ? (
              <span>Resend code in <span className="font-bold text-primary-600">00:{countdown.toString().padStart(2, '0')}</span></span>
            ) : (
              <button type="button" onClick={() => setCountdown(45)} className="text-primary-600 font-bold hover:underline">
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

       <p className="text-center text-sm text-slate-600 mt-6">
         Didn't receive code? <button onClick={() => setCountdown(45)} className="text-primary-600 font-medium hover:underline">Resend</button>
       </p>
    </div>
  );
}

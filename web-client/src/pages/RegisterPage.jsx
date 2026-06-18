import { RegisterForm } from '../features/auth/components/RegisterForm';
import { SocialLogins } from '../features/auth/components/SocialLogins';
import registerImage from '../assets/images/register_ill.png';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <div className="w-full flex">
      <div className="flex-1 p-12 flex flex-col justify-center max-w-md mx-auto">
         <h2 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h2>
         <p className="text-slate-500 mb-8">Start your journey to success</p>
         
         <div className="mb-8">
           <SocialLogins />
         </div>

         <RegisterForm />
         
         <p className="text-center text-sm text-slate-600 mt-8">
           Already have an account? <Link to="/login" className="text-primary-600 font-medium hover:underline">Login</Link>
         </p>
      </div>
      <div className="hidden lg:flex flex-1 bg-primary-50 rounded-2xl m-4 relative overflow-hidden items-center justify-center p-12">
          <div className="text-center w-full max-w-lg">
             <h3 className="text-sm font-bold text-primary-600 mb-2 uppercase tracking-wider">Welcome to</h3>
             <h2 className="text-3xl font-bold text-slate-900 mb-8">AI Mock Interview</h2>
             
             <ul className="text-left space-y-4 mx-auto text-slate-700 mb-12">
               <li className="flex items-center gap-3"><span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs">✓</span> AI-Powered Interviews</li>
               <li className="flex items-center gap-3"><span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs">✓</span> Personalized Feedback</li>
               <li className="flex items-center gap-3"><span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs">✓</span> Track Your Progress</li>
             </ul>
             
             <div className="h-64 rounded-2xl overflow-hidden border border-white shadow-xl shadow-primary-200/50">
                <img src={registerImage} alt="Prepare for interview" className="w-full h-full object-cover" />
             </div>
          </div>
      </div>
    </div>
  );
}

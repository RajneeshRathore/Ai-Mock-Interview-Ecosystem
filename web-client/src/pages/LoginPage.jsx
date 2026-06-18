import { LoginForm } from '../features/auth/components/LoginForm';
import { SocialLogins } from '../features/auth/components/SocialLogins';
import loginImage from '../assets/images/login_robot.png';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="w-full flex">
      <div className="flex-1 p-12 flex flex-col justify-center max-w-md mx-auto">
         <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back!</h2>
         <p className="text-slate-500 mb-8">Login to continue</p>
         
         <LoginForm />

         <div className="mt-8">
           <SocialLogins />
         </div>
         
         <p className="text-center text-sm text-slate-600 mt-8">
           Don't have an account? <Link to="/register" className="text-primary-600 font-medium hover:underline">Sign up</Link>
         </p>
      </div>
      <div className="hidden lg:flex flex-1 bg-slate-900 rounded-2xl m-4 relative overflow-hidden items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-slate-900"></div>
          <div className="relative z-10 text-center text-white px-12">
             <h3 className="text-3xl font-bold mb-4">Your AI career coach<br/>is here to help you<br/>succeed!</h3>
             <div className="w-64 h-64 mx-auto rounded-full mt-12 flex items-center justify-center overflow-hidden border-4 border-white/10 shadow-2xl">
                <img src={loginImage} alt="AI Coach" className="w-full h-full object-cover" />
             </div>
          </div>
      </div>
    </div>
  );
}

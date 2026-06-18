import { GoogleLogin } from '@react-oauth/google';
import api from '../../../services/api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../app/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export function SocialLogins() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('/auth/google', { credential: credentialResponse.credential });
      dispatch(setCredentials({ user: res.data, token: res.token }));
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login failed', error);
    }
  };
  return (
    <div className="space-y-4">
      <div className="relative flex items-center justify-center">
         <div className="border-t border-slate-200 w-full absolute"></div>
         <span className="bg-white px-4 text-xs text-slate-400 relative">or continue with</span>
      </div>
      <div className="flex justify-center mt-4">
         <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.error('Google Login Failed');
            }}
          />
      </div>
    </div>
  );
}

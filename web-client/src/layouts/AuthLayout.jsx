import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl glass-panel rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px]">
        <Outlet />
      </div>
    </div>
  );
}

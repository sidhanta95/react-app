import { Outlet } from "react-router";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <Outlet />
    </div>
  );
}

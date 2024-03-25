import { Outlet } from 'react-router-dom';
import { Sidebar } from '../sidebar/Sidebar';

export function SidebarLayout() {
  return (
    <div className="h-screen w-screen flex flex-row">
      <Sidebar />
      <div className="min-[1068px]:w-10/12 bg-gray-20 h-screen w-full overflow-y-scroll">
        <Outlet />
      </div>
    </div>
  );
}

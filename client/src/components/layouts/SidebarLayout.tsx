import { Outlet } from 'react-router-dom';
import { Sidebar } from '../sidebar/Sidebar';

export function SidebarLayout() {
  return (
    <div className="flex h-screen w-screen flex-row">
      <Sidebar />
      <div className="bg-gray-20 h-screen w-full overflow-y-scroll min-[1068px]:w-10/12">
        <Outlet />
      </div>
    </div>
  );
}

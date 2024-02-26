import { SidebarLinks } from './components/SidebarLinks';
import { SidebarSheet } from './components/SidebarSheet';
import { SidebarUserInfo } from './components/SidebarUserInfo';

export function Sidebar() {
  return (
    <>
      <div className="min-[1068px]:w-2/12 w-0 h-screen ">
        <div className="w-full h-full min-[1068px]:flex bg-secondary flex-col items-center py-12 px-2  hidden">
          <SidebarUserInfo />
          <SidebarLinks />
        </div>
      </div>
      <div className="min-[1068px]:hidden ">
        <SidebarSheet />
      </div>
    </>
  );
}

import { LogOutButton } from './components/LogOutButton';
import { SidebarLinks } from './components/SidebarLinks';
import { SidebarSheet } from './components/SidebarSheet';
import { SidebarUserInfo } from './components/SidebarUserInfo';

export function Sidebar() {
  return (
    <>
      <div className="h-screen w-0 min-[1068px]:w-2/12">
        <div className="hidden h-full w-full flex-col  items-center bg-secondary pt-12 min-[1068px]:flex">
          <SidebarUserInfo />
          <SidebarLinks />
          <LogOutButton />
        </div>
      </div>
      <div className="min-[1068px]:hidden ">
        <SidebarSheet />
      </div>
    </>
  );
}

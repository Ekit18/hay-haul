import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { useAppSelector } from '@/lib/hooks/redux';
import { selectUser } from '@/store/reducers/user/userSlice';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { links } from '../utils/links';
import { SidebarUserInfo } from './SidebarUserInfo';

export function SidebarSheet() {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  if (!user) return null;

  const userRole = user.role;
  return (
    <Sheet>
      <SheetTrigger className="bg-primary z-10 top-56 left-[-10px] pl-3 h-20 pr-3 rounded-r-full min-[1068px]:hidden fixed">
        <Button
          variant="link"
          className="w-full p-0  hover:rounded-none justify-center text-white font-medium text-lg flex flex-row items-center gap-5 decoration-2 "
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-secondary">
        <SheetHeader>
          <SidebarUserInfo />
        </SheetHeader>
        <div className="w-full pt-10 flex flex-col gap-5">
          {links[userRole].map((link) => (
            <Button
              variant="link"
              className="w-full text-left hover:rounded-none justify-start text-white font-medium text-lg flex flex-row items-center gap-5 decoration-2"
              onClick={() => navigate(link.url)}
              key={link.title}
            >
              <link.icon />
              {link.title}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

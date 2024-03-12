import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { useAppSelector } from '@/lib/hooks/redux';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { links } from '../utils/links';
import { LogOutButton } from './LogOutButton';
import { SidebarUserInfo } from './SidebarUserInfo';

export function SidebarSheet() {
  const [open, setOpen] = useState<boolean>(false);
  const user = useAppSelector((state) => state.user.user);
  const navigate = useNavigate();
  if (!user) return null;

  const userRole = user.role;
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="bg-secondary text-white  z-10  top-56 left-[-10px] pl-3 h-20 pr-3 rounded-r-full min-[1068px]:hidden fixed">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="bg-secondary">
        <SheetHeader>
          <SidebarUserInfo />
        </SheetHeader>
        <div className="w-full h-full pt-10 flex flex-col gap-5">
          {links[userRole].map((link) => (
            <Button
              variant="link"
              className="w-full text-left hover:rounded-none mx-0 justify-start text-white font-medium text-lg flex flex-row items-center gap-5 decoration-2"
              onClick={() => {
                setOpen(false);
                navigate(link.url);
              }}
              key={link.title}
            >
              <link.icon />
              {link.title}
            </Button>
          ))}
          <LogOutButton className="mb-7" />
        </div>
      </SheetContent>
    </Sheet>
  );
}

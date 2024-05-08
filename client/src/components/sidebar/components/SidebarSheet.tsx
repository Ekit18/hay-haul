import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { UserRole } from '@/lib/enums/user-role.enum';
import { useAppSelector } from '@/lib/hooks/redux';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { links } from '../utils/links';
import { LogOutButton } from './LogOutButton';
import { NotificationLink } from './NotificationLink';
import { SidebarUserInfo } from './SidebarUserInfo';

export function SidebarSheet() {
  const [open, setOpen] = useState<boolean>(false);
  const user = useAppSelector((state) => state.user.user);
  const navigate = useNavigate();
  if (!user) return null;

  const userRole = user.role;
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="fixed left-[-10px]  top-56  z-10 h-20 rounded-r-full bg-secondary pl-3 pr-3 text-white min-[1068px]:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="bg-secondary">
        <SheetHeader>
          <SidebarUserInfo />
        </SheetHeader>
        <div className="flex h-full w-full flex-col gap-5 pt-10">
          {links[userRole].map((link) => (
            <Button
              variant="link"
              className="mx-0 flex w-full flex-row items-center justify-start gap-5 text-left text-lg font-medium text-white decoration-2 hover:rounded-none"
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
          <NotificationLink />
          <LogOutButton className="mb-7" />
        </div>
      </SheetContent>
    </Sheet>
  );
}

import { Button } from '@/components/ui/button';
import { Sheet } from '@/components/ui/sheet';
import { useAppSelector } from '@/lib/hooks/redux';
import { selectUser } from '@/store/reducers/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { links } from '../utils/links';
import { SidebarSheet } from './SidebarSheet';

export function SidebarLinks() {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  if (!user) return null;

  const userRole = user.role;

  return (
    <Sheet>
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
      <SidebarSheet />
    </Sheet>
  );
}

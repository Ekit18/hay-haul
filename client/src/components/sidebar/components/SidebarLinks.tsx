import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/lib/hooks/redux';
import { useNavigate } from 'react-router-dom';
import { links } from '../utils/links';

export function SidebarLinks() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);

  if (!user) return null;

  const userRole = user.role;

  return (
    <div className="w-full pt-10 flex flex-col gap-5">
      {links[userRole].map((link) => (
        <Button
          variant="link"
          className="w-full text-left hover:rounded-none justify-start text-white font-medium text-lg flex flex-row items-center gap-5 decoration-2 px-3 xl:px-4"
          onClick={() => navigate(link.url)}
          key={link.title}
        >
          <link.icon className="w-5 h-5 xl:w-6 xl:h-6" />
          {link.title}
        </Button>
      ))}
    </div>
  );
}

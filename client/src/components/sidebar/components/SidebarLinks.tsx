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
    <div className="flex w-full flex-col gap-5 pt-10">
      {links[userRole].map((link) => (
        <Button
          variant="link"
          className="flex w-full flex-row items-center justify-start gap-5 px-3 text-left text-lg font-medium text-white decoration-2 hover:rounded-none xl:px-4"
          onClick={() => navigate(link.url)}
          key={link.title}
        >
          <link.icon className="h-5 w-5 xl:h-6 xl:w-6" />
          {link.title}
        </Button>
      ))}
    </div>
  );
}

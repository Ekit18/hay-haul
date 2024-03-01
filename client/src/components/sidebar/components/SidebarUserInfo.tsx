import { useAppSelector } from '@/lib/hooks/redux';

export function SidebarUserInfo() {
  const user = useAppSelector((state) => state.user.user);

  if (!user) {
    return null;
  }

  return <div className="w-full text-white text-center font-semibold text-xl">{user.name}</div>;
}

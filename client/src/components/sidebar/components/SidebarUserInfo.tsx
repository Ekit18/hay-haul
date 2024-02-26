import { useAppSelector } from '@/lib/hooks/redux';
import { selectUser } from '@/store/reducers/user/userSlice';

export function SidebarUserInfo() {
  const user = useAppSelector(selectUser);
  if (!user) {
    return null;
  }
  return <div className="w-full text-white text-center font-semibold text-xl">{user.name}</div>;
}

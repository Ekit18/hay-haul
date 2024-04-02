import { Button } from '@/components/ui/button';
import { AppRoute } from '@/lib/constants/routes';
import { useNavigate } from 'react-router-dom';

export function OtpSuccess() {
  const navigate = useNavigate();
  const handleNavigateToProfile = () => {
    navigate(AppRoute.General.Main);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-10">
      <div>
        <img src="public/images/confirm.svg" alt="" />
      </div>
      <div className="flex flex-col gap-5 text-center">
        <div className="text-xl font-semibold">Successfully verified</div>
        <div className="text-base">
          Now you can pass background check and set up your profile and start exploring customers who need it farm
          production in your area
        </div>
      </div>
      <Button className="w-full" onClick={handleNavigateToProfile}>
        Set up Profile
      </Button>
    </div>
  );
}

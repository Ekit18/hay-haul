import { Button } from '@/components/ui/button';
import { MAIN_ROUTE } from '@/lib/constants/routes';
import { useNavigate } from 'react-router-dom';

export function OtpSuccess() {
  const navigate = useNavigate();
  const handleNavigateToProfile = () => {
    navigate(MAIN_ROUTE);
  };

  return (
    <div className="w-full flex flex-col gap-10 justify-center items-center">
      <div>
        <img src="public/images/confirm.svg" alt="" />
      </div>
      <div className="text-center flex flex-col gap-5">
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

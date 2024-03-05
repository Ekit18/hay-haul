import { useAppSelector } from '@/lib/hooks/redux';
import { facilityDetailsApi } from '@/store/reducers/facility-details/facilityDetailsApi';

export function Farms() {
  const user = useAppSelector((state) => state.user.user);

  if (!user) return null;

  const { data } = facilityDetailsApi.useGetAllByUserIdQuery(user.id);

  return (
    <div>
      <div className="mt-6">
        <div className="p-4 bg-white">
          <h2 className="text-3xl font-bold mb-9">Farm</h2>
        </div>
        <div className="px-4">ф</div>
      </div>
    </div>
  );
}

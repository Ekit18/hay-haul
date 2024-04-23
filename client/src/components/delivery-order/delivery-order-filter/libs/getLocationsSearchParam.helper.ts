import { AppRoute } from '@/lib/constants/routes'
import { UserRole } from '@/lib/enums/user-role.enum'

export const getLocationsSearchParam = (userRole: UserRole, location: string, userId: string) => {

    switch (userRole) {
        case UserRole.Carrier:
            switch (location) {
                case AppRoute.Carrier.DeliveryOffers:
                    return [['carrierId', userId]]
                default:
                    return undefined;
            }
        case UserRole.Businessman:
            return [['userId', userId]]
        default:
            return undefined;
    }
}
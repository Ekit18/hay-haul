import { TransportType } from "@/lib/types/Transport/Transport.type";
import { Feather, Weight, Container } from 'lucide-react';

export const transportTypeToReadable = {
    [TransportType.HeavyDuty]: "Heavy Duty",
    [TransportType.LightDuty]: "Light Duty",
    [TransportType.MediumDuty]: "Medium Duty",
}

export const transportTypeToIcon = {
    [TransportType.LightDuty]: {
        icon: Feather
    },
    [TransportType.MediumDuty]: {
        icon: Weight
    },
    [TransportType.HeavyDuty]: {
        icon: Container
    }
}
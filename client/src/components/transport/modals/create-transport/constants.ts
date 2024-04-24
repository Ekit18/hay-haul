import { TransportType } from "@/lib/types/Transport/Transport.type";
import { Feather, LucideIcon, Weight, Container } from 'lucide-react';

export type TransportTypeValue = {
    id: number;
    label: string;
    value: TransportType;
    icon: LucideIcon;
}

export const transportTypes: TransportTypeValue[] = [
    {
        id: 1,
        label: 'Light Duty (0 - 4.5 tons)',
        value: TransportType.LightDuty,
        icon: Feather
    },
    {
        id: 2,
        label: 'Medium Duty (4.5 - 11.5 tons)',
        value: TransportType.MediumDuty,
        icon: Weight
    },
    {
        id: 3,
        label: 'Heavy Duty (11.5 - 36 tons)',
        value: TransportType.HeavyDuty,
        icon: Container
    }
]


export type TransportTypeValue = {
    id: number;
    label: string;
    value: string;
}

export const transportTypes: TransportTypeValue[] = [
    {
        id: 1,
        label: 'Light Duty',
        value: 'LightDuty'
    },
    {
        id: 2,
        label: 'Medium Duty',
        value: 'MediumDuty'
    },
    {
        id: 3,
        label: 'Heavy Duty',
        value: 'HeavyDuty'
    }
]
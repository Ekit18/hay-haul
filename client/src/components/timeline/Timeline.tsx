import { cn } from '@/lib/utils';
import { CheckCircle2, Truck } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import styles from './timeline.module.css';
import { ValueOf } from '@/lib/types/types';
import { DeliveryStatus } from '@/lib/types/Delivery/Delivery.type';

export type DeliveryStatusStep = ValueOf<typeof DeliveryStatus>;

export type TimelineItem = {
  stepName: string;
  deliveryStatus: DeliveryStatusStep;
};

interface TimelineProps {
  deliveryStatus: DeliveryStatusStep | null;
}

const steps: TimelineItem[] = [
  {
    stepName: 'Awaiting Driver',
    deliveryStatus: DeliveryStatus.AwaitingDriver
  },
  {
    stepName: 'At Farmer Facility',
    deliveryStatus: DeliveryStatus.AtFarmerFacility
  },
  {
    stepName: 'Loading',
    deliveryStatus: DeliveryStatus.Loading
  },
  {
    stepName: 'On The Way',
    deliveryStatus: DeliveryStatus.OnTheWay
  },
  {
    stepName: 'At Warehouse',
    deliveryStatus: DeliveryStatus.AtBusinessFacility
  },
  {
    stepName: 'Unloading',
    deliveryStatus: DeliveryStatus.Unloading
  }
];

export function Timeline({ deliveryStatus }: TimelineProps) {
  const [currentStep, setCurrentStep] = useState(steps.findIndex((step) => step.deliveryStatus === deliveryStatus) + 1);
  const [complete, setComplete] = useState(false);

  if (deliveryStatus === null) {
    return <p className="mt-2 text-center text-xl font-bold">Driver hasn't accepted delivery yet</p>;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-between  py-5 ">
      <div className="flex w-full flex-col justify-between gap-8 lg:flex-row lg:gap-0">
        {steps?.map((step, index) => (
          <div
            key={step.stepName}
            className={`${styles['step-item']} ${currentStep === index + 1 ? `${styles['active']}` : ''} ${
              index + 1 < currentStep || complete ? `${styles['complete']}` : ''
            } w-full `}
          >
            <div
              className={cn(
                'relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-base font-semibold text-white',
                currentStep === index + 1 && 'bg-sky-600',
                (index + 1 < currentStep || complete) && 'bg-primary text-white'
              )}
            >
              {index + 1 < currentStep || complete ? (
                <CheckCircle2 />
              ) : (
                <>
                  {currentStep === index + 1 ? (
                    <Truck className=" z-20 " size={18} color="white" strokeWidth={1.75} />
                  ) : (
                    <p className="">{index + 1}</p>
                  )}
                </>
              )}
            </div>
            <p className="text-center text-sm text-gray-500">{step.stepName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

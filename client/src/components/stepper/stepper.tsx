import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import './stepper.css';

type StepItem = {
  stepName: string;
  stepComponent: React.ReactNode;
};

interface StepperProps {
  steps: StepItem[];
}

export function Stepper({ steps }: StepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);

  const handleBackClick = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleNextClick = () => {
    if (currentStep === steps.length) {
      setComplete(true);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleChoseStep = (step: number) => {
    setCurrentStep(step);
  };

  const currentStepItem = steps[currentStep - 1];

  return (
    <div className="w-full h-full flex flex-col items-center justify-between py-5">
      <div className="flex justify-between">
        {steps?.map((step, index) => (
          <div
            key={step.stepName}
            className={`step-item ${currentStep === index + 1 && 'active'} ${
              (index + 1 < currentStep || complete) && 'complete'
            } `}
          >
            <button
              type="button"
              className={cn(
                'w-6 h-6 flex text-xs items-center justify-center z-10 relative bg-slate-700 rounded-full font-semibold text-white',
                currentStep === index + 1 && 'bg-sky-600',
                (index + 1 < currentStep || complete) && 'bg-secondary text-white'
              )}
              onClick={() => handleChoseStep(index + 1)}
            >
              {index + 1 < currentStep || complete ? <CheckCircle2 /> : index + 1}
            </button>
            <p className="text-gray-500 text-base">{step.stepName}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">{currentStepItem.stepComponent}</div>
      {!complete && (
        <div className="flex w-full flex-row justify-center gap-1">
          <button
            type="button"
            disabled={currentStep === 1}
            className={cn(
              'btn w-24 bg-primary text-white mt-4 px-4 py-2 rounded-md',
              currentStep === 1 && 'bg-gray-500'
            )}
            onClick={handleBackClick}
          >
            Back
          </button>
          <button
            type="button"
            className="btn w-24 bg-primary text-white mt-4 px-4 py-2 rounded-md"
            onClick={currentStep === steps.length ? () => console.log('register') : handleNextClick}
          >
            {currentStep === steps.length ? 'Register' : 'Next'}
          </button>
        </div>
      )}
    </div>
  );
}

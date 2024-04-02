import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { FieldValues, Path, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { Button } from '../ui/button';
import './stepper.css';

export type StepItem = {
  stepName: string;
  stepComponent: React.ReactNode;
  onNextClick: () => Promise<boolean>;
};

interface StepperProps<T extends FieldValues> {
  steps: StepItem[];
  form: UseFormReturn<T, unknown, T>;
  onSubmit: SubmitHandler<T>;
  submitButtonText: string;
  onBackClick: () => void;
}

export const validateStepFields = async <T extends FieldValues>(
  form: UseFormReturn<T, unknown, T>,
  fields: (keyof T)[]
): Promise<boolean> => {
  form.clearErrors();

  await form.trigger(fields.map((item) => item) as Path<T>[]);

  return !(Object.keys(form.formState.errors).length > 0);
};

export function Stepper<T extends FieldValues>({
  steps,
  form,
  onSubmit,
  submitButtonText,
  onBackClick
}: StepperProps<T>) {
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);

  const currentStepItem = steps[currentStep - 1];

  const handleBackClick = () => {
    if (currentStep === 1) return onBackClick();
    setCurrentStep((prev) => prev - 1);
  };

  const handleNextClick = async () => {
    if (!(await currentStepItem.onNextClick())) return;

    if (currentStep === steps.length) {
      setComplete(true);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleChoseStep = async (step: number) => {
    if (step < currentStep) setCurrentStep(step);

    const chosenStepItem = steps[step - 2];

    if (chosenStepItem && !(await chosenStepItem.onNextClick())) return;

    setCurrentStep(step);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-between py-5">
      <div className="flex justify-between">
        {steps?.map((step, index) => (
          <div
            key={step.stepName}
            className={`step-item ${currentStep === index + 1 && 'active'} ${
              (index + 1 < currentStep || complete) && 'complete'
            } w-24 sm:w-36`}
          >
            <button
              type="button"
              className={cn(
                'relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-white',
                currentStep === index + 1 && 'bg-sky-600',
                (index + 1 < currentStep || complete) && 'bg-primary text-white'
              )}
              onClick={() => handleChoseStep(index + 1)}
            >
              {index + 1 < currentStep || complete ? <CheckCircle2 /> : index + 1}
            </button>
            <p className="text-center text-base text-gray-500">{step.stepName}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 h-full w-full">{currentStepItem.stepComponent}</div>
      {!complete && (
        <div className="flex w-full flex-row justify-center gap-4">
          <Button type="button" size="sm" className="mt-4 w-full" onClick={handleBackClick}>
            Back
          </Button>
          <Button
            type="button"
            size="sm"
            className="mt-4 w-full"
            onClick={currentStep === steps.length ? form.handleSubmit(onSubmit) : handleNextClick}
          >
            {currentStep === steps.length ? submitButtonText : 'Next'}
          </Button>
        </div>
      )}
    </div>
  );
}

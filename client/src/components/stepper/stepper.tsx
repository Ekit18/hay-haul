import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import './stepper.css';

const steps = ['Customer Info', 'Shipping Info', 'Payment'];
export function Stepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  return (
    <div className="w-full h-full flex flex-col items-center justify-between py-5">
      <div className="flex justify-between">
        {steps?.map((step, index) => (
          <div
            key={step}
            className={`step-item ${currentStep === index + 1 && 'active'} ${
              (index + 1 < currentStep || complete) && 'complete'
            } `}
          >
            <div
              className={cn(
                'w-6 h-6 flex text-xs items-center justify-center z-10 relative bg-slate-700 rounded-full font-semibold text-white',
                currentStep === index + 1 && 'bg-sky-600',
                (index + 1 < currentStep || complete) && 'bg-green-600 text-white'
              )}
            >
              {index + 1 < currentStep || complete ? <CheckCircle2 /> : index + 1}
            </div>
            <p className="text-gray-500 text-base">{step}</p>
          </div>
        ))}
      </div>
      <div className="text-black">{steps[currentStep - 1]}</div>
      {!complete && (
        <div className="flex w-full flex-row justify-center gap-1">
          <button
            type="button"
            disabled={currentStep === 1}
            className="btn bg-green-500 text-white mt-4 px-4 py-2 rounded-md"
            onClick={() => {
              setCurrentStep((prev) => prev - 1);
            }}
          >
            Back
          </button>
          <button
            type="button"
            className="btn bg-green-500 text-white mt-4 px-4 py-2 rounded-md"
            onClick={() => {
              currentStep === steps.length ? setComplete(true) : setCurrentStep((prev) => prev + 1);
            }}
          >
            {currentStep === steps.length ? 'Finish' : 'Next'}
          </button>
        </div>
      )}
    </div>
  );
}

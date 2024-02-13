interface AuthContainerProps {
  children: React.ReactNode;
}

export function AuthContainer({ children }: AuthContainerProps) {
  return (
    <div className="bg-secondary h-screen flex justify-center items-center">
      <div className="bg-white m-h-3/5 py-10 px-4 w-11/12 md:w-6/12 2xl:w-3/12 rounded-lg flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}

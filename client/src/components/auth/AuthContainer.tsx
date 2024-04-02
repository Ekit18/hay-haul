interface AuthContainerProps {
  children: React.ReactNode;
}

export function AuthContainer({ children }: AuthContainerProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-secondary">
      <div className="m-h-3/5 flex w-11/12 items-center justify-center rounded-lg bg-white px-4 py-10 md:w-6/12 2xl:w-3/12">
        {children}
      </div>
    </div>
  );
}

interface AuthContainerProps {
  children: React.ReactNode;
}

export function AuthContainer({ children }: AuthContainerProps) {
  return (
    <div className="bg-secondary h-screen flex justify-center items-center">
      <div className="bg-white h-3/5 w-3/12 rounded-lg flex justify-center items-center">{children}</div>
    </div>
  );
}

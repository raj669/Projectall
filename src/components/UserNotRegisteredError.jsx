export default function UserNotRegisteredError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">User Not Registered</h1>
      <p className="text-muted-foreground">Please register to continue</p>
    </div>
  );
}

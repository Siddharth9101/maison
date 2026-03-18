export function LoadingComp() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div
        className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

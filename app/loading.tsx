export default function Loading() {
  return (
    <div className="pt-[70px] min-h-[50vh] flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <div className="h-1.5 w-full rounded-full bg-brand-grayMuted/50 overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-brand-orange to-brand-orangeSoft animate-loading-sweep" />
        </div>
      </div>
    </div>
  );
}

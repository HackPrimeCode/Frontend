export default function Footer() {
  return (
    <footer className="w-full">
      <div className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-center relative">
        <div className="absolute left-0 flex items-center gap-2">
          <img
            src="/HackPrimeCode-logo.svg"
            alt="logo"
            className="w-7 h-5.5 -translate-y-0.5"
          />
          <span className="text-white text-sm">
            Hack<span className="text-red">Prime</span>Code
          </span>
        </div>
        <p className="text-xs text-text-accent">
          // 2026 HackPrimeCode * Все права защищены
        </p>
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border">
      <div className="w-full max-w-6xl mx-auto px-6 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-center relative gap-3 sm:gap-0">
        <div className="sm:absolute sm:left-6 flex items-center gap-2">
          <img
            src="/HackPrimeCode-logo.svg"
            alt="logo"
            className="w-7 h-5.5 -translate-y-0.5"
          />
          <span className="text-white text-sm">
            Hack<span className="text-red">Prime</span>Code
          </span>
        </div>

        <p className="text-xs text-text-accent text-center sm:text-left">
          // 2026 HackPrimeCode * Все права защищены
        </p>
      </div>
    </footer>
  );
}

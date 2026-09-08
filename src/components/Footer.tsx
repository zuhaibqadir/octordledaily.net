interface FooterProps {
  onOpenHelp: () => void;
  onMode: (mode: 'daily' | 'unlimited' | 'sequence') => void;
}

export function Footer({ onOpenHelp, onMode }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <nav className="site-footer__nav" aria-label="Footer">
          <a href="#top">Home</a>
          <button type="button" onClick={onOpenHelp}>
            How to Play
          </button>
          <a href="#about">About</a>
          <a href="#faq">FAQ</a>
          <button type="button" onClick={() => onMode('daily')}>
            Daily
          </button>
          <button type="button" onClick={() => onMode('unlimited')}>
            Unlimited
          </button>
          <button type="button" onClick={() => onMode('sequence')}>
            Sequence
          </button>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
        </nav>
        <p className="site-footer__copy">
          © {new Date().getFullYear()} Octordle Daily · An independent word puzzle
          game. Not affiliated with Merriam-Webster or other trademark holders.
        </p>
      </div>
    </footer>
  );
}

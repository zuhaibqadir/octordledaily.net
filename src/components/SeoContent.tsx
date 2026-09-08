export function SeoContent() {
  return (
    <div className="seo-content">
      <section id="about" className="seo-section">
        <h2>What Is Octordle?</h2>
        <p>
          Octordle is an eight-word puzzle game inspired by classic five-letter
          word games. Instead of solving one word, you solve eight at the same
          time — every guess is scored against all boards. It rewards careful
          planning, letter tracking, and efficient guessing.
        </p>
      </section>

      <section className="seo-section">
        <h2>How to Play Octordle</h2>
        <p>
          Type a valid five-letter word and press Enter. Each board lights up
          with green, yellow, and gray tiles. Green means the letter is correct
          and in the right place; yellow means it belongs somewhere else; gray
          means it is not in that word. Keep guessing until all eight words are
          solved — or you run out of attempts.
        </p>
      </section>

      <section className="seo-section">
        <h2>Octordle Game Modes</h2>
        <ul>
          <li>
            <strong>Daily</strong> — one shared puzzle each day. Everyone plays
            the same eight words.
          </li>
          <li>
            <strong>Unlimited</strong> — practice anytime with a fresh random
            set of eight words.
          </li>
          <li>
            <strong>Sequence</strong> — solve one word at a time. Finish a word
            to unlock the next until all eight are complete.
          </li>
        </ul>
      </section>

      <section className="seo-section">
        <h2>Octordle Tips and Strategy</h2>
        <p>
          Start with words that cover common vowels and consonants. Watch which
          boards are nearly solved and prioritize guesses that finish them.
          Remember that a letter can be green on one board and absent on
          another — the on-screen keyboard shows the best-known status across
          boards so you do not lose confirmed greens.
        </p>
      </section>

      <section id="faq" className="seo-section">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>How many guesses do I get?</summary>
          <p>Daily and Unlimited modes allow 13 guesses. Sequence gives up to 8 guesses per word.</p>
        </details>
        <details>
          <summary>Is the daily puzzle the same for everyone?</summary>
          <p>
            Yes. The daily puzzle is keyed to the UTC calendar date, so players
            worldwide share the same challenge. A new puzzle unlocks at midnight
            UTC.
          </p>
        </details>
        <details>
          <summary>Can I play offline?</summary>
          <p>Once the page has loaded, gameplay runs entirely in your browser. Progress and statistics are saved locally.</p>
        </details>
        <details>
          <summary>Do you store my answers online?</summary>
          <p>No. Game state and statistics stay in your browser&apos;s local storage on this device.</p>
        </details>
      </section>

      <section id="privacy" className="seo-section">
        <h2>Privacy Policy</h2>
        <p>
          This site stores preferences, in-progress games, and statistics in
          your browser only. We do not require an account. If analytics are
          added later, they will be disclosed here.
        </p>
      </section>

      <section id="terms" className="seo-section">
        <h2>Terms of Use</h2>
        <p>
          Octordle Daily is provided for personal entertainment. Play fairly,
          enjoy the puzzle, and do not misuse the site. Word lists are used for
          gameplay validation only.
        </p>
      </section>

      <section className="seo-section">
        <h2>Contact</h2>
        <p>
          Questions or feedback? Reach out via your preferred channel listed on
          the site owner&apos;s profile, or open an issue if this project is hosted
          on a public repository.
        </p>
      </section>
    </div>
  );
}

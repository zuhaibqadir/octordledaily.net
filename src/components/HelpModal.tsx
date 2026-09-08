import { Modal } from './Modal';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export function HelpModal({ open, onClose }: HelpModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="How to Play">
      <div className="help-content">
        <section>
          <h3>Guess the words</h3>
          <p>
            Find eight hidden five-letter words. You have 13 guesses in Daily and
            Unlimited modes.
          </p>
        </section>

        <section>
          <h3>One guess, eight boards</h3>
          <p>
            Every word you submit is checked against all eight boards at once.
            Use each guess carefully.
          </p>
        </section>

        <section>
          <h3>Use the colors</h3>
          <div className="help-examples">
            <div className="help-example">
              <div className="help-example__tiles">
                <span className="tile tile--correct tile--small tile--static">
                  <span className="tile__letter">W</span>
                </span>
                <span className="tile tile--absent tile--small tile--static">
                  <span className="tile__letter">O</span>
                </span>
                <span className="tile tile--absent tile--small tile--static">
                  <span className="tile__letter">R</span>
                </span>
                <span className="tile tile--absent tile--small tile--static">
                  <span className="tile__letter">D</span>
                </span>
                <span className="tile tile--absent tile--small tile--static">
                  <span className="tile__letter">S</span>
                </span>
              </div>
              <p>
                <strong>Green</strong> — correct letter and position
              </p>
            </div>
            <div className="help-example">
              <div className="help-example__tiles">
                <span className="tile tile--absent tile--small tile--static">
                  <span className="tile__letter">P</span>
                </span>
                <span className="tile tile--present tile--small tile--static">
                  <span className="tile__letter">L</span>
                </span>
                <span className="tile tile--absent tile--small tile--static">
                  <span className="tile__letter">A</span>
                </span>
                <span className="tile tile--absent tile--small tile--static">
                  <span className="tile__letter">N</span>
                </span>
                <span className="tile tile--absent tile--small tile--static">
                  <span className="tile__letter">T</span>
                </span>
              </div>
              <p>
                <strong>Yellow</strong> — letter is in the word, wrong spot
              </p>
            </div>
            <div className="help-example">
              <div className="help-example__tiles">
                <span className="tile tile--absent tile--small tile--static">
                  <span className="tile__letter">G</span>
                </span>
                <span className="tile tile--absent tile--small tile--static">
                  <span className="tile__letter">U</span>
                </span>
                <span className="tile tile--absent tile--small tile--static">
                  <span className="tile__letter">E</span>
                </span>
                <span className="tile tile--absent tile--small tile--static">
                  <span className="tile__letter">S</span>
                </span>
                <span className="tile tile--absent tile--small tile--static">
                  <span className="tile__letter">S</span>
                </span>
              </div>
              <p>
                <strong>Gray</strong> — letter is not in the word
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3>Solve all eight</h3>
          <p>
            Win by solving every board before you run out of guesses. In Sequence
            mode, solve one word at a time — each unlocked after the previous.
          </p>
        </section>
      </div>
    </Modal>
  );
}

/* QAMW × Nonprofit Claude Training — Carousel Slides
   Square 1080×1080. 6 slides total.
   Exports Slide01–Slide06 + SlideShell + helpers to window. */

const { useMemo } = React;

/* ────────────────────────────────────────────────────────────────
   Whimsy SVG primitives — hand-drawn squiggles, arrows, marker
   circles, sparkles, confetti dots.
   ──────────────────────────────────────────────────────────────── */

const Squiggle = ({ width = 180, height = 40, color = 'currentColor', stroke = 3, style }) => (
  <svg width={width} height={height} viewBox="0 0 180 40" fill="none"
       className="scribble" style={style} aria-hidden="true">
    <path d="M 4 22 C 18 4, 32 4, 46 22 S 74 40, 88 22 S 116 4, 130 22 S 158 40, 176 22"
          stroke={color} strokeWidth={stroke} strokeLinecap="round" fill="none" />
  </svg>
);

const SquiggleArrow = ({ width = 240, height = 56, color = 'currentColor', stroke = 3, style }) => (
  <svg width={width} height={height} viewBox="0 0 240 56" fill="none"
       className="scribble" style={style} aria-hidden="true">
    <path d="M 6 30 C 30 12, 56 12, 78 30 S 124 48, 148 30 S 196 12, 220 28"
          stroke={color} strokeWidth={stroke} strokeLinecap="round" fill="none" />
    <path d="M 204 14 L 226 28 L 208 44"
          stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const DownArrow = ({ width = 50, height = 120, color = 'currentColor', stroke = 3, style }) => (
  <svg width={width} height={height} viewBox="0 0 50 120" fill="none"
       className="scribble" style={style} aria-hidden="true">
    <path d="M 25 6 C 14 28, 36 50, 22 72 S 32 102, 25 112"
          stroke={color} strokeWidth={stroke} strokeLinecap="round" fill="none" />
    <path d="M 13 100 L 25 114 L 38 100"
          stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const MarkerCircle = ({ width = 360, height = 140, color = 'currentColor', stroke = 5, style }) => (
  <svg width={width} height={height} viewBox="0 0 360 140" fill="none"
       className="scribble" style={style} aria-hidden="true">
    <path d="M 30 72 C 28 24, 120 8, 188 12 C 280 18, 340 38, 336 76 C 332 116, 230 132, 150 128 C 60 124, 18 100, 28 70 C 34 56, 76 46, 110 44"
          stroke={color} strokeWidth={stroke} strokeLinecap="round" fill="none"
          opacity="0.85" />
  </svg>
);

const MarkerUnderline = ({ width = 220, height = 22, color = 'currentColor', stroke = 5, style }) => (
  <svg width={width} height={height} viewBox="0 0 220 22" fill="none"
       className="scribble" style={style} aria-hidden="true">
    <path d="M 6 14 C 50 6, 120 8, 170 12 S 208 18, 214 12"
          stroke={color} strokeWidth={stroke} strokeLinecap="round" fill="none" opacity="0.9"/>
  </svg>
);

const MarkerStrike = ({ width = 220, height = 18, color = 'currentColor', stroke = 5, style }) => (
  <svg width={width} height={height} viewBox="0 0 220 18" fill="none"
       className="scribble" style={style} aria-hidden="true">
    <path d="M 4 10 C 50 4, 110 14, 170 8 S 210 12, 216 9"
          stroke={color} strokeWidth={stroke} strokeLinecap="round" fill="none" opacity="0.9"/>
  </svg>
);

const Sparkle = ({ size = 24, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} aria-hidden="true">
    <path d="M 12 1 L 13.5 9 L 23 12 L 13.5 15 L 12 23 L 10.5 15 L 1 12 L 10.5 9 Z"
          fill={color} />
  </svg>
);

const Dot = ({ size = 8, color = 'currentColor', style }) => (
  <span style={{ display: 'inline-block', width: size, height: size, background: color, borderRadius: '50%', ...style }} />
);

const Confetti = ({ items }) => (
  <div className="confetti" aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
    {items.map((it, i) => {
      const common = { position: 'absolute', top: it.top, left: it.left, transform: `rotate(${it.rot || 0}deg)` };
      if (it.kind === 'sparkle') return <Sparkle key={i} size={it.size || 18} color={it.color} style={common} />;
      if (it.kind === 'dot')     return <span key={i} style={{ ...common, width: it.size, height: it.size, background: it.color, borderRadius: '50%' }} />;
      if (it.kind === 'cross')   return (
        <svg key={i} width={it.size} height={it.size} viewBox="0 0 20 20" style={common} aria-hidden="true">
          <path d="M 4 4 L 16 16 M 16 4 L 4 16" stroke={it.color} strokeWidth="3" strokeLinecap="round"/>
        </svg>
      );
      if (it.kind === 'tick')    return (
        <svg key={i} width={it.size} height={it.size} viewBox="0 0 20 20" style={common} aria-hidden="true">
          <path d="M 3 11 L 8 16 L 17 5" stroke={it.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      );
      return null;
    })}
  </div>
);

/* ────────────────────────────────────────────────────────────────
   Slide shell — 1080×1080 canvas, page number, brand mark,
   optional swipe hint, optional grain.
   ──────────────────────────────────────────────────────────────── */

const SlideShell = ({ index, total = 6, label, showSwipe = true, whimsy = true, grain = true, children }) => (
  <div className={`slide ${grain ? 'grain' : ''} ${whimsy ? '' : 'no-whimsy'}`}
       data-screen-label={`${String(index).padStart(2,'0')} ${label || ''}`.trim()}>
    {children}
    <div className="slide-chrome">
      <div className="slide-num">
        <strong>{String(index).padStart(2,'0')}</strong> / {String(total).padStart(2,'0')}
        {label ? <span style={{ marginLeft: 14, color: 'var(--fg-3)' }}>· {label}</span> : null}
      </div>
      <div className="slide-brand">
        <span className="dot" /> QAMW Consulting
      </div>
      {showSwipe && index < total ? (
        <div className="slide-swipe">
          Swipe
          <svg width="38" height="14" viewBox="0 0 38 14" fill="none" aria-hidden="true">
            <path d="M 2 7 H 32 M 26 2 L 33 7 L 26 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
      ) : null}
    </div>
  </div>
);

/* ────────────────────────────────────────────────────────────────
   Shared bits
   ──────────────────────────────────────────────────────────────── */

const Chip = ({ children }) => (
  <span style={{
    display: 'inline-block',
    padding: '10px 16px',
    border: '1px solid var(--border)',
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--fg-2)',
    background: 'rgba(255,255,255,0.02)',
  }}>{children}</span>
);

const TrackRow = ({ n, children }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '88px 1fr',
    alignItems: 'baseline',
    gap: 24,
    padding: '22px 0',
    borderTop: '1px solid var(--border)',
  }}>
    <div style={{
      fontFamily: 'var(--font-display)',
      fontSize: 64,
      color: 'var(--accent)',
      lineHeight: 0.85,
      letterSpacing: '0.01em',
    }}>{n}</div>
    <div style={{
      fontFamily: 'var(--font-body)',
      fontSize: 24,
      lineHeight: 1.4,
      color: 'var(--fg-1)',
      fontWeight: 400,
    }}>{children}</div>
  </div>
);

/* ────────────────────────────────────────────────────────────────
   Slide 01 — The Ask
   ──────────────────────────────────────────────────────────────── */

const Slide01 = (props) => (
  <SlideShell index={1} label="The Ask" {...props}>
    <div className="backdrop-glyph" style={{ fontSize: 320, top: -40, right: -90, opacity: 0.55 }}>CLAUDE</div>

    <div className="tape" style={{ top: 90, right: -60, width: 280, transform: 'rotate(18deg)' }} />
    <div className="tape tape-green" style={{ bottom: 220, left: -60, width: 240, transform: 'rotate(-12deg)' }} />

    <Confetti items={[
      { kind: 'sparkle', top: 180, left: 120, size: 22, color: 'var(--accent)', rot: 12 },
      { kind: 'sparkle', top: 800, left: 940, size: 26, color: 'var(--accent)', rot: -8 },
      { kind: 'dot',     top: 320, left: 880, size: 10, color: 'var(--green)' },
      { kind: 'dot',     top: 640, left: 70,  size: 8,  color: 'var(--red)' },
      { kind: 'cross',   top: 240, left: 760, size: 18, color: 'var(--fg-3)' },
    ]} />

    <div className="slide-content" style={{ justifyContent: 'center' }}>
      <div style={{ marginTop: 20 }}>
        <div className="eyebrow" style={{ marginBottom: 36 }}>The Ask · Inbox 9:14 AM</div>

        <h1 className="display" style={{ fontSize: 96, marginBottom: 10, color: 'var(--fg-1)' }}>
          <span style={{ color: 'var(--accent)' }}>“</span>Can you teach<br/>
          me how to use<br/>
          <span style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap' }}>
            Claude better<span style={{ color: 'var(--accent)' }}>?”</span>
            <MarkerUnderline width={620} height={22} color="var(--accent)" stroke={5}
              style={{ position: 'absolute', left: 0, bottom: -10 }} />
          </span>
        </h1>

        <div style={{
          marginTop: 44,
          fontFamily: 'var(--font-body)',
          fontWeight: 300, fontStyle: 'italic',
          fontSize: 22, color: 'var(--fg-3)',
        }}>— that was the brief.</div>

        <div style={{ marginTop: 56, display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 28, height: 1, background: 'var(--accent)' }} />
          <span className="mono" style={{ fontSize: 12, color: 'var(--accent)', letterSpacing: '0.22em' }}>His Job, In Full</span>
        </div>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 52, lineHeight: 1.05, marginTop: 16, color: 'var(--fg-1)',
          letterSpacing: '0.01em',
        }}>
          One man. Running an<br/>entire nonprofit.
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 22 }}>
          <Chip>Programs</Chip>
          <Chip>Grants</Chip>
          <Chip>Donors</Chip>
          <Chip>Communications</Chip>
        </div>

        <div style={{
          marginTop: 32,
          fontFamily: 'var(--font-display)', fontSize: 56,
          letterSpacing: '0.01em', lineHeight: 1.05,
          whiteSpace: 'nowrap',
        }}>
          <span style={{ color: 'var(--accent)' }}>All of it.</span>
          <span style={{ display: 'inline-block', width: 18 }} />
          <span style={{ color: 'var(--fg-1)' }}>Just him.</span>
        </div>
      </div>
    </div>

    <div className="sticker accent" style={{ top: 56, right: 60, transform: 'rotate(8deg)' }}>
      Case&nbsp;Study&nbsp;//&nbsp;01
    </div>
  </SlideShell>
);

/* ────────────────────────────────────────────────────────────────
   Slide 02 — The Problem With That Ask
   ──────────────────────────────────────────────────────────────── */

const Slide02 = (props) => (
  <SlideShell index={2} label="The Problem" {...props}>
    <div className="tape tape-red" style={{ top: 80, right: 80, width: 200, transform: 'rotate(10deg)' }} />

    <Confetti items={[
      { kind: 'cross',   top: 220, left: 90,  size: 18, color: 'var(--red)' },
      { kind: 'dot',     top: 940, left: 980, size: 8,  color: 'var(--green)' },
      { kind: 'sparkle', top: 950, left: 90,  size: 20, color: 'var(--accent)' },
    ]} />

    <div className="slide-content">
      <div className="eyebrow" style={{ marginBottom: 28, color: 'var(--red)' }}>
        Diagnosis · The Problem With That Ask
      </div>

      {/* Opening thesis with strike */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 56, lineHeight: 1.0, color: 'var(--fg-1)',
        letterSpacing: '0.01em',
      }}>
        Claude training assumes<br/>
        the problem is{' '}
        <span style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap' }}>
          skill.
          <MarkerStrike width={140} height={18} color="var(--red)" stroke={6}
            style={{ position: 'absolute', left: -6, top: '32%' }} />
        </span>
      </div>

      <div style={{
        marginTop: 18, fontFamily: 'var(--font-display)', fontSize: 64,
        color: 'var(--red)', letterSpacing: '0.01em',
      }}>
        It wasn't.
      </div>

      {/* Bridge */}
      <div style={{
        marginTop: 32,
        fontFamily: 'var(--font-body)', fontSize: 22, lineHeight: 1.5, color: 'var(--fg-2)',
        maxWidth: 780, fontWeight: 300,
      }}>
        He knew how to type a prompt. What he didn't have was a Claude that
        already knew{' '}
        <span style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap', color: 'var(--accent)', fontWeight: 500 }}>
          HIM
          <MarkerUnderline width={60} height={14} color="var(--accent)" stroke={4}
            style={{ position: 'absolute', left: -4, bottom: -6 }} />
        </span>.
      </div>

      {/* Rhythmic list — Every / Every / Every */}
      <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 0 }}>
        {[
          ['Every session', 'started from zero.'],
          ['Every output',  'needed heavy editing.'],
          ['Every grant',   'sounded generic.'],
        ].map(([lead, tail], i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '260px 1fr',
            alignItems: 'baseline', gap: 24,
            padding: '14px 0', borderTop: '1px solid var(--border)',
          }}>
            <span className="mono" style={{
              fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'var(--accent)',
            }}>{lead}</span>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: 22, color: 'var(--fg-1)',
              fontWeight: 400, lineHeight: 1.4,
            }}>{tail}</span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--border)' }} />
      </div>

      {/* Closing thesis */}
      <div style={{
        marginTop: 'auto',
        paddingTop: 32,
        fontFamily: 'var(--font-display)',
        fontSize: 44, lineHeight: 1.05, color: 'var(--fg-1)',
        letterSpacing: '0.01em',
      }}>
        The problem wasn't the tool.<br/>
        It was that the tool{' '}
        <span style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap', color: 'var(--accent)' }}>
          didn't know his world.
          <MarkerUnderline width={620} height={22} color="var(--accent)" stroke={5}
            style={{ position: 'absolute', left: -4, bottom: -10 }} />
        </span>
      </div>
    </div>

    <div className="sticker dark" style={{ top: 240, right: 70, transform: 'rotate(8deg)' }}>
      Wait —
    </div>
  </SlideShell>
);

/* ────────────────────────────────────────────────────────────────
   Track slide — used by 03, 04, 05
   ──────────────────────────────────────────────────────────────── */

const TrackSlide = ({
  index, label, trackEyebrow, trackTitle, headline, rows, kicker,
  decor, stickerLabel, stickerStyle,
}) => (
  <SlideShell index={index} label={label}>
    {decor}
    <div className="slide-content" style={{ paddingBottom: 132 }}>
      <div className="eyebrow" style={{ marginBottom: 14 }}>{trackEyebrow}</div>
      <h2 className="display" style={{
        fontSize: 132, lineHeight: 0.92, marginBottom: 36,
        letterSpacing: '0.02em',
      }}>{trackTitle}</h2>

      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: 44, lineHeight: 1.05, color: 'var(--fg-1)',
        margin: 0, letterSpacing: '0.01em', maxWidth: 880,
      }}>{headline}</p>

      <div style={{ marginTop: 36, flex: 1 }}>
        {rows.map((r, i) => <TrackRow key={i} n={r.n}>{r.text}</TrackRow>)}
        <div style={{ borderTop: '1px solid var(--border)' }} />
      </div>

      <div style={{
        marginTop: 20,
        display: 'flex', alignItems: 'baseline', gap: 18,
      }}>
        <span style={{ width: 36, height: 1, background: 'var(--accent)' }} />
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 32,
          color: 'var(--accent)', letterSpacing: '0.01em',
          lineHeight: 1.1,
        }}>{kicker}</span>
      </div>
    </div>

    {stickerLabel ? (
      <div className="sticker" style={{ top: 60, right: 60, transform: 'rotate(8deg)', ...(stickerStyle || {}) }}>
        {stickerLabel}
      </div>
    ) : null}
  </SlideShell>
);

/* ────────────────────────────────────────────────────────────────
   Slide 03 — Track A: Training
   ──────────────────────────────────────────────────────────────── */

const Slide03 = (props) => (
  <TrackSlide
    index={3}
    label="Track A · Training"
    trackEyebrow="Track A · 03"
    trackTitle="TRAINING"
    headline="We built his Claude workspace from the ground up."
    rows={[
      { n: '01', text: <>Projects organized around how he <em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>actually</em> works.</> },
      { n: '02', text: <>Skills built for the tasks he <em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>repeats every week.</em></> },
      { n: '03', text: <>Cowork set up so nothing lives in his head alone.</> },
    ]}
    kicker="Now Claude knows his org before he types a word."
    stickerLabel="Track A · 1 of 3"
    stickerStyle={{ background: 'var(--accent)', color: 'var(--white)', boxShadow: '4px 4px 0 0 var(--white)' }}
    decor={<>
      <div className="tape tape-green" style={{ top: 90, right: -40, width: 240, transform: 'rotate(14deg)' }} />
      <div className="backdrop-glyph" style={{ fontSize: 260, bottom: -60, right: -40, opacity: 0.45 }}>TRAIN</div>
      <Confetti items={[
        { kind: 'sparkle', top: 200, left: 90, size: 22, color: 'var(--accent)' },
        { kind: 'tick',    top: 940, left: 90, size: 18, color: 'var(--green)' },
        { kind: 'dot',     top: 880, left: 990, size: 10, color: 'var(--green)' },
      ]} />
    </>}
  />
);

/* ────────────────────────────────────────────────────────────────
   Slide 04 — Track B: Documents
   ──────────────────────────────────────────────────────────────── */

const Slide04 = (props) => (
  <TrackSlide
    index={4}
    label="Track B · Documents"
    trackEyebrow="Track B · 04"
    trackTitle="DOCUMENTS"
    headline="Grant writing was starting from scratch every time."
    rows={[
      { n: '01', text: <>Boilerplate templates built around his <em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>actual programs.</em></> },
      { n: '02', text: <>A repeatable grant and RFP workflow — intake to draft to send.</> },
    ]}
    kicker="Same quality. A fraction of the time."
    stickerLabel="Track B · 2 of 3"
    stickerStyle={{ background: 'var(--white)', color: 'var(--black)', boxShadow: '4px 4px 0 0 var(--accent)' }}
    decor={<>
      <div className="tape tape-amber" style={{ top: 90, right: -40, width: 240, transform: 'rotate(14deg)' }} />
      <div className="backdrop-glyph" style={{ fontSize: 260, bottom: -60, right: -40, opacity: 0.45 }}>DOCS</div>
      <Confetti items={[
        { kind: 'sparkle', top: 220, left: 990, size: 22, color: 'var(--accent)' },
        { kind: 'dot',     top: 940, left: 980, size: 8,  color: 'var(--red)' },
        { kind: 'tick',    top: 920, left: 90,  size: 18, color: 'var(--green)' },
      ]} />
    </>}
  />
);

/* ────────────────────────────────────────────────────────────────
   Slide 05 — Track C: Setup
   ──────────────────────────────────────────────────────────────── */

const Slide05 = (props) => (
  <TrackSlide
    index={5}
    label="Track C · Setup"
    trackEyebrow="Track C · 05"
    trackTitle="SETUP"
    headline="The plumbing that makes the rest stick."
    rows={[
      { n: '01', text: <>Claude Design tuned so outputs match his <em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>voice</em> — not a generic one.</> },
      { n: '02', text: <>Everything organized so he stops <em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>burning credits</em> re-explaining context.</> },
    ]}
    kicker="One person. Running like a team."
    stickerLabel="Track C · 3 of 3"
    stickerStyle={{ background: 'var(--off-black)', color: 'var(--white)', border: '1px solid var(--border)', boxShadow: '4px 4px 0 0 var(--accent)' }}
    decor={<>
      <div className="tape tape-white" style={{ top: 90, right: -40, width: 240, transform: 'rotate(14deg)' }} />
      <div className="backdrop-glyph" style={{ fontSize: 260, bottom: -60, right: -40, opacity: 0.45 }}>SETUP</div>
      <Confetti items={[
        { kind: 'sparkle', top: 200, left: 90, size: 22, color: 'var(--accent)' },
        { kind: 'tick',    top: 920, left: 980, size: 18, color: 'var(--green)' },
        { kind: 'dot',     top: 880, left: 100, size: 10, color: 'var(--green)' },
      ]} />
    </>}
  />
);

/* ────────────────────────────────────────────────────────────────
   Slide 06 — CTA
   ──────────────────────────────────────────────────────────────── */

const Slide06 = (props) => (
  <SlideShell index={6} label="CTA" showSwipe={false} {...props}>
    <div className="backdrop-glyph" style={{ fontSize: 360, top: -60, left: -40, opacity: 0.7 }}>SYSTEMS</div>

    <div className="tape" style={{ top: 100, right: -40, width: 260, transform: 'rotate(14deg)' }} />
    <div className="tape tape-green" style={{ bottom: 260, left: -50, width: 240, transform: 'rotate(-10deg)' }} />

    <Confetti items={[
      { kind: 'sparkle', top: 140, left: 140, size: 24, color: 'var(--accent)', rot: 10 },
      { kind: 'sparkle', top: 820, left: 880, size: 28, color: 'var(--accent)', rot: -12 },
      { kind: 'dot',     top: 280, left: 920, size: 10, color: 'var(--green)' },
      { kind: 'tick',    top: 220, left: 800, size: 20, color: 'var(--green)' },
      { kind: 'cross',   top: 760, left: 220, size: 16, color: 'var(--fg-3)' },
    ]} />

    <div className="slide-content" style={{ justifyContent: 'center' }}>
      <div className="eyebrow" style={{ marginBottom: 36 }}>The Offer</div>

      <h2 className="display" style={{ fontSize: 96, marginBottom: 22, lineHeight: 0.95 }}>
        You don't need{' '}
        <span style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap', color: 'var(--fg-3)' }}>
          Claude training.
          <MarkerStrike width={520} height={20} color="var(--red)" stroke={7}
            style={{ position: 'absolute', left: 0, top: '45%' }} />
        </span>
      </h2>

      <h2 className="display" style={{ fontSize: 112, marginBottom: 48, lineHeight: 0.95 }}>
        You need Claude<br/>
        <span style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap' }}>
          built around <em>your</em><br/>
          business.
          <MarkerUnderline width={720} height={22} color="var(--accent)" stroke={5}
            style={{ position: 'absolute', left: 0, bottom: -10 }} />
        </span>
      </h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginTop: 12, flexWrap: 'wrap' }}>
        <div style={{
          background: 'var(--accent)', color: 'var(--white)',
          padding: '22px 36px', fontFamily: 'var(--font-mono)',
          fontSize: 18, fontWeight: 500, letterSpacing: '0.18em',
          textTransform: 'uppercase', position: 'relative',
        }}>
          DM me “AIOS”
          <span style={{
            position: 'absolute', inset: 0,
            border: '1px solid var(--white)',
            transform: 'translate(6px, 6px)',
            pointerEvents: 'none',
          }} />
        </div>
        <SquiggleArrow width={220} height={48} color="var(--accent)" stroke={3} />
      </div>

      <p style={{
        marginTop: 28, fontFamily: 'var(--font-body)', fontSize: 22,
        color: 'var(--fg-2)', maxWidth: 720, fontWeight: 300, lineHeight: 1.5,
        marginBottom: 40,
      }}>
        Tell me what that looks like for yours — I'll walk you through it.
      </p>

      <div style={{ marginTop: 64, display: 'flex', alignItems: 'baseline', gap: 18 }}>
        <span className="mono" style={{ fontSize: 12, letterSpacing: '0.2em', color: 'var(--fg-3)' }}>
          QAMW Consulting
        </span>
        <span style={{ width: 24, height: 1, background: 'var(--border)' }} />
        <span className="mono" style={{ fontSize: 12, letterSpacing: '0.2em', color: 'var(--fg-2)' }}>
          qamwconsulting.com
        </span>
      </div>
    </div>

    <div className="sticker" style={{ top: 56, right: 60, transform: 'rotate(-8deg)' }}>
      End&nbsp;//&nbsp;06&nbsp;of&nbsp;06
    </div>
  </SlideShell>
);

/* ────────────────────────────────────────────────────────────────
   Export to window so other Babel scripts can use these
   ──────────────────────────────────────────────────────────────── */

Object.assign(window, {
  SlideShell,
  Slide01, Slide02, Slide03, Slide04, Slide05, Slide06,
  Squiggle, SquiggleArrow, DownArrow, MarkerCircle, MarkerUnderline, MarkerStrike, Sparkle, Dot, Confetti,
});

window.QAMWSlides = [Slide01, Slide02, Slide03, Slide04, Slide05, Slide06];
window.QAMWSlideLabels = ['The Ask', 'The Problem', 'Track A · Training', 'Track B · Documents', 'Track C · Setup', 'CTA'];

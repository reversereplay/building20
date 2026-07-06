import React, { useState, useMemo } from "react";

/* ------------------------------------------------------------------
   BUILDING 20 — a social network for builders, named after MIT's
   legendary "magical incubator" where disciplines collided.
   Design language: engineering graph paper, cardinal red ink,
   monospace lab-notebook annotations.
------------------------------------------------------------------- */

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
`;

const C = {
  cardinal: "#A31F34",
  ink: "#1B1E23",
  paper: "#FBFCFD",
  grid: "#E3EBF2",
  blueprint: "#1D4E7A",
  chalk: "#5E6B78",
};

const CHANNELS = [
  { id: "all", label: "everything", tag: "∞" },
  { id: "hardware", label: "hardware", tag: "hw" },
  { id: "ai", label: "ai / ml", tag: "6.036" },
  { id: "biotech", label: "biotech", tag: "20.x" },
  { id: "fintech", label: "fintech", tag: "15.x" },
  { id: "energy", label: "climate + energy", tag: "22.x" },
  { id: "spacetech", label: "spacetech", tag: "16.x" },
];

const KIND_META = {
  idea: { label: "IDEA", color: C.cardinal, hint: "napkin stage" },
  build: { label: "BUILD LOG", color: C.blueprint, hint: "in progress" },
  ask: { label: "ASK", color: "#8A6D1A", hint: "needs help" },
  demo: { label: "DEMO", color: "#1F6E4A", hint: "it works" },
};

const SEED_POSTS = [
  {
    id: 1,
    kind: "demo",
    channel: "hardware",
    author: "Priya N.",
    handle: "priya_makes",
    affil: "Course 6-2 · MITERS",
    time: "23 min ago",
    title: "Self-calibrating pick-and-place head under $90 BOM",
    body: "Closed-loop vision on a $12 endoscope camera. Placement error down to ±0.04mm after 3 calibration cycles. Full CAD + firmware in the repo. Roast my kinematics.",
    prototypes: 47,
    forks: 12,
    reviews: 18,
    proto: false,
  },
  {
    id: 2,
    kind: "ask",
    channel: "biotech",
    author: "Marcus T.",
    handle: "mtak",
    affil: "PhD, Bioengineering",
    time: "1 hr ago",
    title: "Anyone scaled microfluidic chips past prototype quantities?",
    body: "PDMS is fine for n=10 but I need 500 units for a pilot. Injection molding quotes are brutal. Looking for someone who has crossed this valley of death, will trade lab access for war stories.",
    prototypes: 21,
    forks: 3,
    reviews: 29,
    proto: false,
  },
  {
    id: 3,
    kind: "idea",
    channel: "ai",
    author: "Yuki S.",
    handle: "ysato",
    affil: "MEng '26 · dropped a class for this",
    time: "2 hr ago",
    title: "Deterministic eval harness for agent loops — proofs, not vibes",
    body: "Every agent benchmark is stochastic theater. What if the eval layer was a tiny deterministic runtime with exact arithmetic and hash-chained run logs, so a result is a proof, not a screenshot? Who wants to whiteboard this Thursday?",
    prototypes: 63,
    forks: 22,
    reviews: 41,
    proto: false,
  },
  {
    id: 4,
    kind: "build",
    channel: "energy",
    author: "Dana K.",
    handle: "dkessler",
    affil: "Sloan MBA · ex-grid ops",
    time: "5 hr ago",
    title: "Week 6: virtual power plant sim now clears real ISO-NE data",
    body: "Dispatch engine handles 40k simulated batteries against actual New England day-ahead prices. Next: degradation-aware bidding. Cofounder search is officially open — need someone who dreams in optimization.",
    prototypes: 34,
    forks: 8,
    reviews: 15,
    proto: false,
  },
  {
    id: 5,
    kind: "idea",
    channel: "spacetech",
    author: "Omar R.",
    handle: "orbital_omar",
    affil: "AeroAstro · Rocket Team alum",
    time: "8 hr ago",
    title: "Cubesat swarms as a shared sensing utility, priced like AWS",
    body: "Universities keep launching one-off cubesats that die in 18 months. Pool them. Standard bus, shared downlink, per-observation pricing. The hard part is governance, not orbit mechanics. Change my mind.",
    prototypes: 29,
    forks: 5,
    reviews: 33,
    proto: false,
  },
];

const EVENTS = [
  { d: "JUL 09", t: "Whiteboard Night", where: "Stata 32-123", note: "bring one unsolved problem" },
  { d: "JUL 11", t: "HackMIT team formation", where: "Walker Memorial", note: "no idea required" },
  { d: "JUL 17", t: "Demo Day: summer cohort", where: "Media Lab E14", note: "6 min, live demos only" },
  { d: "JUL 24", t: "$100K pitch clinic", where: "Trust Center", note: "office hours w/ EIRs" },
];

const COLLISIONS = [
  { name: "Elena V.", field: "computational fabrication", wants: "someone who knows supply chains" },
  { name: "Josh B.", field: "RF hardware", wants: "an ML person who respects physics" },
  { name: "Amara O.", field: "synthetic biology", wants: "a skeptic to stress-test her thesis" },
  { name: "Theo L.", field: "market microstructure", wants: "a systems programmer, the terser the better" },
];

function GridBackdrop() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: C.paper,
        backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
        zIndex: 0,
      }}
    />
  );
}

function KindBadge({ kind }) {
  const m = KIND_META[kind];
  return (
    <span
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10,
        letterSpacing: "0.12em",
        color: "#fff",
        background: m.color,
        padding: "3px 8px",
      }}
    >
      {m.label}
    </span>
  );
}

function Post({ post, onProto }) {
  const m = KIND_META[post.kind];
  return (
    <article
      style={{
        background: "#fff",
        border: `1px solid ${C.grid}`,
        borderLeft: `4px solid ${m.color}`,
        boxShadow: "0 1px 0 rgba(27,30,35,0.04)",
      }}
      className="mb-4"
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <KindBadge kind={post.kind} />
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                color: C.chalk,
                letterSpacing: "0.08em",
              }}
            >
              {m.hint} · #{post.channel}
            </span>
          </div>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: C.chalk }}>
            {post.time}
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 19,
            lineHeight: 1.25,
            color: C.ink,
          }}
          className="mb-2"
        >
          {post.title}
        </h2>

        <p
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 14,
            lineHeight: 1.6,
            color: "#3A414A",
          }}
          className="mb-4"
        >
          {post.body}
        </p>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div
              style={{
                width: 30,
                height: 30,
                background: C.ink,
                color: "#fff",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {post.author.split(" ").map((w) => w[0]).join("")}
            </div>
            <div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 600, color: C.ink }}>
                {post.author}
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: C.chalk }}>
                {post.affil}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onProto(post.id)}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                padding: "6px 12px",
                border: `1.5px solid ${post.proto ? C.cardinal : C.ink}`,
                background: post.proto ? C.cardinal : "transparent",
                color: post.proto ? "#fff" : C.ink,
                cursor: "pointer",
                transition: "all 120ms",
              }}
            >
              ⚡ prototype this · {post.prototypes}
            </button>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.chalk }}>
              ⑂ {post.forks} forks
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.chalk }}>
              ✎ {post.reviews} peer reviews
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Building20() {
  const [posts, setPosts] = useState(SEED_POSTS);
  const [channel, setChannel] = useState("all");
  const [kindFilter, setKindFilter] = useState("all");
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState({ title: "", body: "", kind: "idea", channel: "ai" });
  const [collision, setCollision] = useState(null);

  const visible = useMemo(
    () =>
      posts.filter(
        (p) =>
          (channel === "all" || p.channel === channel) &&
          (kindFilter === "all" || p.kind === kindFilter)
      ),
    [posts, channel, kindFilter]
  );

  const toggleProto = (id) =>
    setPosts((ps) =>
      ps.map((p) =>
        p.id === id
          ? { ...p, proto: !p.proto, prototypes: p.prototypes + (p.proto ? -1 : 1) }
          : p
      )
    );

  const publish = () => {
    if (!draft.title.trim()) return;
    setPosts((ps) => [
      {
        id: Date.now(),
        kind: draft.kind,
        channel: draft.channel,
        author: "You",
        handle: "you",
        affil: "Building 20 member",
        time: "just now",
        title: draft.title.trim(),
        body: draft.body.trim() || "(no notes yet — the whiteboard is open)",
        prototypes: 0,
        forks: 0,
        reviews: 0,
        proto: false,
      },
      ...ps,
    ]);
    setDraft({ title: "", body: "", kind: "idea", channel: "ai" });
    setComposerOpen(false);
  };

  const collide = () =>
    setCollision(COLLISIONS[Math.floor(Math.random() * COLLISIONS.length)]);

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <style>{FONTS}</style>
      <GridBackdrop />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ---------- Header ---------- */}
        <header
          style={{
            background: C.ink,
            borderBottom: `3px solid ${C.cardinal}`,
          }}
        >
          <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-baseline gap-3">
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 22,
                  color: "#fff",
                  letterSpacing: "-0.01em",
                }}
              >
                BUILDING<span style={{ color: C.cardinal }}> 20</span>
              </span>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  color: "#8B95A1",
                  letterSpacing: "0.1em",
                }}
              >
                THE MAGICAL INCUBATOR · EST. WHEREVER IDEAS COLLIDE
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={collide}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                  color: "#fff",
                  border: "1.5px solid #fff",
                  padding: "7px 14px",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                ⌁ random collision
              </button>
              <button
                onClick={() => setComposerOpen((v) => !v)}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                  color: "#fff",
                  background: C.cardinal,
                  padding: "8px 16px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                + post to the corridor
              </button>
            </div>
          </div>
        </header>

        {/* ---------- Collision modal ---------- */}
        {collision && (
          <div
            className="max-w-6xl mx-auto px-5 mt-4"
            style={{ position: "relative" }}
          >
            <div
              style={{
                background: C.ink,
                color: "#fff",
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: C.cardinal, letterSpacing: "0.15em" }}>
                  COLLISION DETECTED
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17 }}>
                  {collision.name} — {collision.field}
                </div>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#B8C0C9" }}>
                  Looking for: {collision.wants}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={collide}
                  style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, border: "1px solid #4A525C", background: "transparent", color: "#fff", padding: "8px 14px", cursor: "pointer" }}
                >
                  re-roll
                </button>
                <button
                  onClick={() => setCollision(null)}
                  style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, background: C.cardinal, border: "none", color: "#fff", padding: "8px 14px", cursor: "pointer" }}
                >
                  say hi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------- Composer ---------- */}
        {composerOpen && (
          <div className="max-w-6xl mx-auto px-5 mt-4">
            <div style={{ background: "#fff", border: `1.5px solid ${C.ink}`, padding: 20 }}>
              <div className="flex gap-2 mb-3 flex-wrap">
                {Object.keys(KIND_META).map((k) => (
                  <button
                    key={k}
                    onClick={() => setDraft((d) => ({ ...d, kind: k }))}
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      padding: "5px 10px",
                      border: `1.5px solid ${draft.kind === k ? KIND_META[k].color : C.grid}`,
                      background: draft.kind === k ? KIND_META[k].color : "transparent",
                      color: draft.kind === k ? "#fff" : C.chalk,
                      cursor: "pointer",
                    }}
                  >
                    {KIND_META[k].label}
                  </button>
                ))}
                <select
                  value={draft.channel}
                  onChange={(e) => setDraft((d) => ({ ...d, channel: e.target.value }))}
                  style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, border: `1.5px solid ${C.grid}`, padding: "5px 8px", background: "#fff", color: C.ink }}
                >
                  {CHANNELS.filter((c) => c.id !== "all").map((c) => (
                    <option key={c.id} value={c.id}>#{c.id}</option>
                  ))}
                </select>
              </div>
              <input
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                placeholder="One line. What are you building, breaking, or asking?"
                style={{
                  width: "100%",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 17,
                  border: "none",
                  borderBottom: `2px solid ${C.grid}`,
                  padding: "8px 0",
                  outline: "none",
                  color: C.ink,
                  background: "transparent",
                }}
              />
              <textarea
                value={draft.body}
                onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
                placeholder="Notes, numbers, links. Specificity gets peer review; vibes get ignored."
                rows={3}
                style={{
                  width: "100%",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: 14,
                  border: "none",
                  padding: "10px 0",
                  outline: "none",
                  resize: "vertical",
                  color: "#3A414A",
                  background: "transparent",
                }}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setComposerOpen(false)}
                  style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, padding: "8px 14px", border: `1.5px solid ${C.grid}`, background: "transparent", color: C.chalk, cursor: "pointer" }}
                >
                  discard
                </button>
                <button
                  onClick={publish}
                  style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, padding: "8px 18px", background: C.ink, color: "#fff", border: "none", cursor: "pointer" }}
                >
                  publish →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------- Main grid ---------- */}
        <main className="max-w-6xl mx-auto px-5 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left rail: channels */}
          <aside className="lg:col-span-3">
            <div style={{ background: "#fff", border: `1px solid ${C.grid}` }}>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  color: C.chalk,
                  padding: "12px 16px 8px",
                }}
              >
                CORRIDORS
              </div>
              {CHANNELS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setChannel(c.id)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    textAlign: "left",
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: channel === c.id ? 600 : 400,
                    padding: "9px 16px",
                    background: channel === c.id ? "#F3E9EB" : "transparent",
                    borderLeft: `3px solid ${channel === c.id ? C.cardinal : "transparent"}`,
                    border: "none",
                    borderLeftStyle: "solid",
                    borderLeftWidth: 3,
                    borderLeftColor: channel === c.id ? C.cardinal : "transparent",
                    color: C.ink,
                    cursor: "pointer",
                  }}
                >
                  <span>#{c.label}</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: C.chalk }}>{c.tag}</span>
                </button>
              ))}
            </div>

            <div style={{ background: "#fff", border: `1px solid ${C.grid}`, marginTop: 16, padding: 16 }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: C.chalk, marginBottom: 8 }}>
                HOUSE RULES
              </div>
              <ul style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, lineHeight: 1.7, color: "#3A414A", paddingLeft: 16, margin: 0 }}>
                <li>Show the work, not the deck.</li>
                <li>Peer review hard, never cruel.</li>
                <li>Forking is a compliment.</li>
                <li>NDAs don't survive the corridor.</li>
              </ul>
            </div>
          </aside>

          {/* Center: feed */}
          <section className="lg:col-span-6">
            <div className="flex gap-2 mb-4 flex-wrap">
              {["all", "idea", "build", "ask", "demo"].map((k) => (
                <button
                  key={k}
                  onClick={() => setKindFilter(k)}
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    padding: "6px 12px",
                    border: `1.5px solid ${kindFilter === k ? C.ink : C.grid}`,
                    background: kindFilter === k ? C.ink : "#fff",
                    color: kindFilter === k ? "#fff" : C.chalk,
                    cursor: "pointer",
                  }}
                >
                  {k === "all" ? "everything" : k + "s"}
                </button>
              ))}
            </div>

            {visible.length === 0 ? (
              <div style={{ background: "#fff", border: `1px dashed ${C.chalk}`, padding: 32, textAlign: "center" }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: C.ink }}>
                  This corridor is quiet.
                </div>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: C.chalk, marginTop: 4 }}>
                  Post something worth arguing about.
                </div>
              </div>
            ) : (
              visible.map((p) => <Post key={p.id} post={p} onProto={toggleProto} />)
            )}
          </section>

          {/* Right rail: events + leaderboard */}
          <aside className="lg:col-span-3">
            <div style={{ background: "#fff", border: `1px solid ${C.grid}`, padding: 16 }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: C.chalk, marginBottom: 12 }}>
                ON THE BOARD
              </div>
              {EVENTS.map((e, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                  <div
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 10,
                      color: C.cardinal,
                      fontWeight: 500,
                      whiteSpace: "pre",
                      lineHeight: 1.3,
                      paddingTop: 2,
                    }}
                  >
                    {e.d.replace(" ", "\n")}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 600, color: C.ink }}>
                      {e.t}
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: C.chalk }}>
                      {e.where} · {e.note}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", border: `1px solid ${C.grid}`, padding: 16, marginTop: 16 }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: C.chalk, marginBottom: 10 }}>
                PROOF OF WORK · THIS WEEK
              </div>
              {[
                ["ysato", "63 ⚡"],
                ["priya_makes", "47 ⚡"],
                ["dkessler", "34 ⚡"],
              ].map(([h, s], i) => (
                <div key={h} style={{ display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.ink, padding: "5px 0", borderBottom: i < 2 ? `1px solid ${C.grid}` : "none" }}>
                  <span>@{h}</span>
                  <span style={{ color: C.cardinal }}>{s}</span>
                </div>
              ))}
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: C.chalk, marginTop: 10 }}>
                Ranked by prototypes earned, not followers. Followers are vanity; forks are love.
              </div>
            </div>
          </aside>
        </main>

        <footer style={{ borderTop: `1px solid ${C.grid}`, padding: "20px 0 32px", textAlign: "center" }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: C.chalk, letterSpacing: "0.1em" }}>
            THE ORIGINAL BUILDING 20 WAS DEMOLISHED IN 1998. THE COLLISIONS CONTINUE.
          </span>
        </footer>
      </div>
    </div>
  );
}

// Room backgrounds behind the door (bought in the Store). Drawn as flat
// shapes in a 1600 x 900 box that covers the screen; the door stands in
// the middle, so the detail is kept to the sides.

const KITCHEN = `
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <rect width="1600" height="900" fill="#e9e1d3"/>
  <!-- tiled backsplash -->
  <g fill="none" stroke="#d6cbb8" stroke-width="3">
    ${Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="${520 + i * 28}" x2="1600" y2="${520 + i * 28}"/>`).join('')}
  </g>
  <!-- window with sky, left -->
  <rect x="120" y="150" width="300" height="230" rx="8" fill="#b9d7ee"/>
  <rect x="120" y="150" width="300" height="230" rx="8" fill="none" stroke="#f6f1e8" stroke-width="16"/>
  <line x1="270" y1="150" x2="270" y2="380" stroke="#f6f1e8" stroke-width="10"/>
  <circle cx="190" cy="215" r="26" fill="#f6f1e8" opacity="0.7"/>
  <!-- upper cabinets, right -->
  <rect x="1130" y="120" width="380" height="220" rx="8" fill="#7a8f9e"/>
  <line x1="1320" y1="130" x2="1320" y2="330" stroke="#62778a" stroke-width="6"/>
  <circle cx="1300" cy="300" r="7" fill="#d9cdb5"/><circle cx="1340" cy="300" r="7" fill="#d9cdb5"/>
  <!-- shelf with jars, left -->
  <rect x="90" y="455" width="380" height="14" fill="#8a6a4a"/>
  <rect x="120" y="395" width="44" height="60" rx="8" fill="#c7d6c0"/><rect x="118" y="388" width="48" height="12" rx="4" fill="#8a6a4a"/>
  <rect x="190" y="410" width="40" height="45" rx="8" fill="#e6c79b"/><rect x="188" y="403" width="44" height="11" rx="4" fill="#8a6a4a"/>
  <rect x="255" y="400" width="44" height="55" rx="8" fill="#d9a8a0"/><rect x="253" y="393" width="48" height="11" rx="4" fill="#8a6a4a"/>
  <!-- counters left and right -->
  <rect x="0" y="690" width="560" height="210" fill="#8a6a4a"/><rect x="0" y="672" width="580" height="26" fill="#c7b39a"/>
  <rect x="1040" y="690" width="560" height="210" fill="#8a6a4a"/><rect x="1020" y="672" width="580" height="26" fill="#c7b39a"/>
  <!-- hanging pans, right -->
  <line x1="1150" y1="380" x2="1450" y2="380" stroke="#6b5a48" stroke-width="6"/>
  <circle cx="1200" cy="450" r="40" fill="#5a6470"/><rect x="1196" y="380" width="8" height="30" fill="#5a6470"/>
  <circle cx="1310" cy="440" r="32" fill="#6c7682"/><rect x="1306" y="380" width="8" height="28" fill="#6c7682"/>
  <circle cx="1410" cy="455" r="44" fill="#5a6470"/><rect x="1406" y="380" width="8" height="30" fill="#5a6470"/>
  <!-- kettle on the right counter -->
  <path d="M1180 672 Q1180 610 1230 605 Q1280 610 1280 672 Z" fill="#b0453e"/>
  <path d="M1280 640 Q1310 630 1318 610" stroke="#b0453e" stroke-width="10" fill="none"/>
</svg>`;

const BARRACKS = `
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <rect width="1600" height="900" fill="#6f7a52"/>
  <rect y="560" width="1600" height="340" fill="#4c5638"/>
  <rect y="550" width="1600" height="14" fill="#3d4630"/>
  <!-- bunk bed, left -->
  <g fill="#3a3f45">
    <rect x="80" y="240" width="18" height="600"/><rect x="430" y="240" width="18" height="600"/>
  </g>
  <rect x="98" y="400" width="332" height="40" fill="#5a6a46"/><rect x="98" y="380" width="120" height="28" rx="10" fill="#e8e4d6"/>
  <rect x="98" y="700" width="332" height="40" fill="#5a6a46"/><rect x="98" y="680" width="120" height="28" rx="10" fill="#e8e4d6"/>
  <rect x="98" y="436" width="332" height="10" fill="#3a3f45"/><rect x="98" y="736" width="332" height="10" fill="#3a3f45"/>
  <!-- lockers, right -->
  <g fill="#7d8a6a" stroke="#5f6b4e" stroke-width="6">
    <rect x="1120" y="200" width="130" height="640"/><rect x="1250" y="200" width="130" height="640"/><rect x="1380" y="200" width="130" height="640"/>
  </g>
  <g fill="#5f6b4e">
    ${[1150, 1280, 1410].map(x => `<rect x="${x}" y="240" width="70" height="8"/><rect x="${x}" y="260" width="70" height="8"/><rect x="${x + 60}" y="500" width="12" height="40" rx="4"/>`).join('')}
  </g>
  <!-- a flag on the wall, top left -->
  <rect x="560" y="110" width="160" height="100" fill="#2f4a2f"/>
  <path d="M640 130 L648 152 L672 152 L652 166 L660 190 L640 175 L620 190 L628 166 L608 152 L632 152 Z" fill="#c9a85a"/>
  <!-- duffel bag on the floor -->
  <rect x="1180" y="780" width="200" height="80" rx="40" fill="#3d4630"/>
  <path d="M1220 780 Q1280 740 1340 780" stroke="#2a3020" stroke-width="10" fill="none"/>
</svg>`;

const BEDROOM = `
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <rect width="1600" height="900" fill="#d9e3f0"/>
  <g fill="#cdd8e8">${Array.from({ length: 20 }, (_, i) => `<rect x="${i * 80}" width="40" height="900"/>`).join('')}</g>
  <rect y="740" width="1600" height="160" fill="#a88a6c"/>
  <!-- window with night sky, left -->
  <rect x="140" y="160" width="280" height="260" rx="8" fill="#26385e"/>
  <circle cx="340" cy="220" r="26" fill="#f2efe0"/><circle cx="352" cy="212" r="24" fill="#26385e"/>
  <circle cx="200" cy="230" r="3" fill="#f2efe0"/><circle cx="250" cy="300" r="2.5" fill="#f2efe0"/><circle cx="380" cy="350" r="3" fill="#f2efe0"/>
  <rect x="140" y="160" width="280" height="260" rx="8" fill="none" stroke="#f6f8fb" stroke-width="16"/>
  <line x1="280" y1="160" x2="280" y2="420" stroke="#f6f8fb" stroke-width="10"/>
  <!-- desk and lamp, left -->
  <rect x="80" y="600" width="420" height="20" fill="#8a6a4a"/><rect x="100" y="620" width="16" height="140" fill="#8a6a4a"/><rect x="464" y="620" width="16" height="140" fill="#8a6a4a"/>
  <rect x="140" y="560" width="60" height="40" fill="#d65f5f"/><rect x="150" y="530" width="60" height="30" fill="#5f8fd6"/><rect x="146" y="510" width="56" height="20" fill="#e0b44c"/>
  <path d="M380 600 L392 520 M372 520 L420 520 L404 480 L388 480 Z" stroke="#4a4a52" stroke-width="8" fill="#e0b44c"/>
  <!-- bed, right -->
  <rect x="1080" y="560" width="460" height="190" rx="16" fill="#f6f8fb"/>
  <rect x="1060" y="440" width="40" height="320" rx="10" fill="#8a6a4a"/>
  <rect x="1110" y="600" width="430" height="150" rx="18" fill="#7a9ad6"/>
  <rect x="1110" y="560" width="150" height="56" rx="20" fill="#ffffff"/>
  <!-- a poster, right -->
  <rect x="1250" y="170" width="180" height="230" rx="6" fill="#2f6fdd"/>
  <circle cx="1340" cy="260" r="50" fill="#e0b44c"/><rect x="1280" y="330" width="120" height="14" rx="7" fill="#f6f8fb"/>
</svg>`;

export const ROOMS = { 'bg-kitchen': KITCHEN, 'bg-barracks': BARRACKS, 'bg-bedroom': BEDROOM };

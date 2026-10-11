// The father: only a dark, locked silhouette in this version.
// Same rig proportions as the others, so he lines up in the store.
// Coordinates: (0, 0) is between his feet; up is negative y.

const C = { body: '#1a2540', rim: '#2b3a5e' };

export function fatherSvg() {
  return `
<g class="char char-father">
  <rect x="-34" y="-200" width="26" height="200" rx="8" fill="${C.body}"/>
  <rect x="8" y="-200" width="26" height="200" rx="8" fill="${C.body}"/>
  <path d="M-66 -318 Q-64 -342 -36 -344 L36 -344 Q64 -342 66 -318 L58 -190 Q0 -180 -58 -190 Z" fill="${C.body}"/>
  <path d="M-66 -318 L-84 -200 L-66 -196 L-50 -300 Z" fill="${C.body}"/>
  <path d="M66 -318 L84 -200 L66 -196 L50 -300 Z" fill="${C.body}"/>
  <rect x="-12" y="-370" width="24" height="30" fill="${C.body}"/>
  <ellipse cx="0" cy="-402" rx="38" ry="44" fill="${C.body}"/>
  <path d="M-38 -404 Q-36 -446 0 -448 Q36 -446 38 -404" stroke="${C.rim}" stroke-width="3" fill="none"/>
  <text x="0" y="-392" text-anchor="middle" font-size="44" font-weight="800" fill="${C.rim}">?</text>
</g>`;
}

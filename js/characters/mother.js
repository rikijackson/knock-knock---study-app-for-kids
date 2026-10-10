// The mother, drawn as SVG shapes.
// Style rules (after Carmen Sandiego): bold silhouettes with smooth curves,
// almond eyes with heavy flicked lashes, angular brows, pointed chin, flat fills, one
// hard-edged darker shape per part for shading (light comes from the left),
// no outlines. Clothes and hair in cool colors; skin in a natural tone.
// Coordinates: (0, 0) is between her feet; up is negative y.

const C = {
  skin: '#d6a184', skinShade: '#ae7559',
  hair: '#1b2a52', hairShade: '#111c3a', hairShine: '#2f4a85',
  cardigan: '#1b8a9a', cardiganShade: '#146f7c',
  apron: '#e6effb', apronShade: '#bfd0ea',
  skirt: '#24508f', skirtShade: '#1a3d72',
  legs: '#1c2d55', shoes: '#0f1a33',
  spoon: '#b9c7dd', spoonShade: '#8fa1bf',
  plate: '#e6effb', plateShade: '#bfd0ea', lid: '#b9c7dd', lidShade: '#8fa1bf',
  crust: '#d5deec', berry: '#4b4a9c',
  eyeWhite: '#eef2f8', iris: '#8d92bd', pupil: '#14213d', lash: '#0f1730',
  lips: '#a23d63', lipsLight: '#c25a80', earring: '#4fc2d0',
};

// One eye, drawn around its center (cx, cy). `flip` mirrors the eye shape
// for the right eye, but not the iris, so both irises dart the same way.
function eye(cx, cy, flip, side) {
  const shape = 'M-12 1 Q-7 -7 3 -7 Q10 -6 12 0 Q6 6 -2 6 Q-9 5 -12 1 Z';
  const lash = 'M-16 -3 Q-11 -4 -10 -3 Q-4 -9 4 -8.5 Q10 -7 12 0 Q8 -5 3 -5.5 Q-5 -5.8 -12 1 Q-13 -2 -16 -3 Z';
  const lowerLid = 'M-9 4.5 Q-2 7.5 6 5 Q-2 6.2 -9 4.5 Z';
  const clip = `mother-eye-${side}`;
  return `
    <g transform="translate(${cx} ${cy})">
      <g class="eye eye-${side}">
        <clipPath id="${clip}"><path d="${shape}" transform="scale(${flip} 1)"/></clipPath>
        <path d="${shape}" transform="scale(${flip} 1)" fill="${C.eyeWhite}"/>
        <g clip-path="url(#${clip})">
          <g class="pupil">
            <circle cx="${flip}" cy="-0.5" r="6.5" fill="${C.iris}"/>
            <circle cx="${flip}" cy="-0.5" r="3.4" fill="${C.pupil}"/>
            <circle cx="${flip + 2.4}" cy="-3" r="1.7" fill="#ffffff"/>
          </g>
        </g>
        <path d="${lash}" transform="scale(${flip} 1)" fill="${C.lash}"/>
        <path d="${lowerLid}" transform="scale(${flip} 1)" fill="${C.skinShade}"/>
      </g>
    </g>`;
}

export function motherSvg() {
  return `
<g class="char char-mother">
  <!-- legs and shoes -->
  <rect x="-30" y="-84" width="15" height="72" rx="7" fill="${C.legs}"/>
  <rect x="15" y="-84" width="15" height="72" rx="7" fill="${C.legs}"/>
  <path d="M-36 -16 Q-36 -22 -26 -22 L-12 -22 Q-9 -10 -10 0 L-42 0 Q-44 -9 -36 -16 Z" fill="${C.shoes}"/>
  <path d="M36 -16 Q36 -22 26 -22 L12 -22 Q9 -10 10 0 L42 0 Q44 -9 36 -16 Z" fill="${C.shoes}"/>

  <!-- skirt -->
  <path d="M-46 -222 L46 -222 Q58 -150 66 -76 Q0 -64 -66 -76 Q-58 -150 -46 -222 Z" fill="${C.skirt}"/>
  <path d="M16 -222 L46 -222 Q58 -150 66 -76 Q50 -72 32 -70 Q32 -150 16 -222 Z" fill="${C.skirtShade}"/>

  <!-- torso: cardigan with an apron over it -->
  <g class="torso">
    <path d="M-58 -316 Q-56 -336 -32 -336 L32 -336 Q56 -336 58 -316 Q44 -270 42 -214 Q0 -206 -42 -214 Q-44 -270 -58 -316 Z" fill="${C.cardigan}"/>
    <path d="M22 -336 L32 -336 Q56 -336 58 -316 Q44 -270 42 -214 Q34 -211 26 -210 Q34 -272 22 -336 Z" fill="${C.cardiganShade}"/>
    <path d="M-15 -336 L15 -336 Q8 -318 0 -308 Q-8 -318 -15 -336 Z" fill="${C.skin}"/>
    <path d="M-30 -298 Q0 -305 30 -298 Q38 -200 42 -116 Q0 -106 -42 -116 Q-38 -200 -30 -298 Z" fill="${C.apron}"/>
    <path d="M14 -302 Q24 -301 30 -298 Q38 -200 42 -116 Q33 -113 23 -112 Q28 -210 14 -302 Z" fill="${C.apronShade}"/>
    <path d="M-27 -336 L-20 -336 L-24 -298 L-31 -298 Z" fill="${C.apron}"/>
    <path d="M20 -336 L27 -336 L31 -298 L24 -298 Z" fill="${C.apronShade}"/>
    <rect x="-19" y="-252" width="38" height="28" rx="8" fill="${C.apronShade}"/>
  </g>

  <!-- arms (hang from the shoulders) -->
  <g class="arm-l">
    <path d="M-58 -332 Q-44 -332 -45 -316 L-58 -212 Q-70 -206 -80 -214 L-70 -318 Q-68 -332 -58 -332 Z" fill="${C.cardigan}"/>
    <path d="M-61 -210 L-80 -214 Q-83 -204 -81 -192 Q-79 -184 -72 -184 Q-67 -185 -66 -190 L-64 -198 Q-58 -198 -57 -202 Q-58 -207 -61 -210 Z" fill="${C.skin}"/>
  </g>
  <g class="arm-r">
    <!-- a ladle (blue-grey so it stays in the cool palette), hidden until she wags it -->
    <g class="prop prop-spoon">
      <path d="M68 -192 L75 -193 L81 -142 L75 -141 Z" fill="${C.spoon}"/>
      <ellipse cx="79" cy="-128" rx="9" ry="14" fill="${C.spoon}"/>
      <path d="M80 -142 Q90 -132 84 -116 Q82 -128 76 -140 Z" fill="${C.spoonShade}"/>
    </g>
    <path d="M58 -332 Q44 -332 45 -316 L58 -212 Q70 -206 80 -214 L70 -318 Q68 -332 58 -332 Z" fill="${C.cardigan}"/>
    <path d="M58 -332 Q68 -332 70 -318 L80 -214 Q75 -210 70 -210 L60 -318 Q60 -328 58 -332 Z" fill="${C.cardiganShade}"/>
    <path d="M61 -210 L80 -214 Q83 -204 81 -192 Q79 -184 72 -184 Q67 -185 66 -190 L64 -198 Q58 -198 57 -202 Q58 -207 61 -210 Z" fill="${C.skin}"/>
    <path d="M74 -212 L80 -214 Q83 -204 81 -192 Q79 -184 72 -184 Q78 -194 74 -212 Z" fill="${C.skinShade}"/>
  </g>

  <!-- shoulder caps: cover the joint so the arms stay attached however they swing -->
  <circle cx="-56" cy="-321" r="14" fill="${C.cardigan}"/>
  <circle cx="56" cy="-321" r="14" fill="${C.cardiganShade}"/>
  <path d="M46 -331 A14 14 0 0 0 46 -311 Q52 -321 46 -331 Z" fill="${C.cardigan}"/>

  <!-- a blueberry pie she's been making, hidden until the big finale -->
  <g class="prop prop-dish">
    <ellipse cx="0" cy="-226" rx="52" ry="11" fill="${C.plate}"/>
    <path d="M16 -236 Q48 -236 52 -226 Q48 -218 16 -216 Z" fill="${C.plateShade}"/>
    <ellipse cx="0" cy="-234" rx="40" ry="11" fill="${C.crust}"/>
    <ellipse cx="0" cy="-236" rx="32" ry="7" fill="${C.berry}"/>
    <path d="M-22 -240 L-14 -231 M-6 -242 L4 -230 M10 -242 L20 -231" stroke="${C.crust}" stroke-width="3" stroke-linecap="round"/>
    <g class="prop-lid">
      <path d="M-45 -232 Q-45 -286 0 -288 Q45 -286 45 -232 Z" fill="${C.lid}"/>
      <path d="M14 -286 Q45 -282 45 -232 L22 -232 Q28 -262 14 -286 Z" fill="${C.lidShade}"/>
      <path d="M-30 -262 Q-24 -276 -10 -280" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.7"/>
      <circle cx="0" cy="-292" r="7" fill="${C.lidShade}"/>
    </g>
  </g>

  <!-- neck: long and slim, with a hard shadow under the chin -->
  <path d="M-10 -392 L10 -392 L12 -330 L-12 -330 Z" fill="${C.skin}"/>
  <path d="M-10 -364 Q0 -352 10 -364 L11 -342 Q0 -337 -11 -345 Z" fill="${C.skinShade}"/>

  <!-- head -->
  <g class="head">
    <!-- messy bun with loose strands -->
    <path d="M12 -492 Q24 -501 31 -494 Q22 -494 16 -486 Z" fill="${C.hair}"/>
    <path d="M-10 -496 Q-16 -506 -24 -502 Q-16 -500 -14 -492 Z" fill="${C.hair}"/>
    <path d="M-22 -470 Q-27 -497 0 -500 Q27 -497 22 -470 Q12 -459 0 -461 Q-12 -459 -22 -470 Z" fill="${C.hair}"/>
    <path d="M8 -498 Q26 -494 22 -470 Q16 -463 8 -461 Q18 -478 8 -498 Z" fill="${C.hairShade}"/>

    <!-- hair behind the face, ending in pointed locks by the jaw -->
    <path d="M-39 -446 Q-41 -472 -12 -472 L12 -472 Q41 -472 39 -446 C44 -420 42 -398 38 -380 L32 -392 C34 -410 34 -428 30 -440 L-30 -440 C-34 -428 -34 -410 -32 -392 L-38 -380 C-42 -398 -44 -420 -39 -446 Z" fill="${C.hair}"/>
    <path d="M26 -466 Q40 -460 39 -446 C44 -420 42 -398 38 -380 L34 -388 C38 -410 38 -440 26 -466 Z" fill="${C.hairShade}"/>

    <!-- ear and a little teal earring -->
    <ellipse cx="-36" cy="-404" rx="5" ry="8" fill="${C.skin}"/>
    <circle cx="-37" cy="-393" r="2.6" fill="${C.earring}"/>

    <!-- face: high cheekbones, straight jaw, pointed chin -->
    <path d="M-35 -440 C-39 -418 -38 -400 -34 -386 Q-24 -364 -8 -356 Q0 -352 8 -356 Q24 -364 34 -386 C38 -400 39 -418 35 -440 Q0 -454 -35 -440 Z" fill="${C.skin}"/>
    <path d="M19 -447 Q33 -444 35 -440 C39 -418 38 -400 34 -386 Q24 -364 8 -356 Q4 -354 1 -353 Q20 -368 25 -390 C28 -410 26 -430 19 -447 Z" fill="${C.skinShade}"/>
    <!-- hard shadow cast by the fringe -->
    <path d="M-36 -422 Q-24 -434 -14 -444 Q-7 -434 -8 -423 Q0 -429 14 -435 Q29 -426 35 -406 L35 -398 Q27 -418 14 -428 Q1 -420 -10 -416 Q-11 -427 -14 -436 Q-23 -426 -36 -415 Z" fill="${C.skinShade}"/>

    <!-- fringe: side-swept, pointed locks -->
    <path d="M-40 -440 Q-40 -472 -10 -473 Q33 -474 41 -440 Q41 -420 35 -406 Q29 -428 14 -436 Q0 -429 -8 -424 Q-7 -436 -14 -446 Q-24 -434 -37 -422 Q-41 -432 -40 -440 Z" fill="${C.hair}"/>
    <path d="M14 -472 Q37 -468 41 -440 Q41 -420 35 -406 Q34 -446 14 -472 Z" fill="${C.hairShade}"/>
    <path d="M-22 -457 Q-4 -466 16 -461 Q-3 -461 -20 -452 Z" fill="${C.hairShine}"/>
    <!-- a loose strand falling by her cheek -->
    <path d="M-37 -432 Q-49 -402 -41 -370 Q-44 -398 -33 -426 Z" fill="${C.hair}"/>

    <!-- the face features move together so the head can "turn" -->
    <g class="features">
      <!-- eyebrows: thick, angular, tapered; one raised, very suspicious -->
      <path d="M-27 -413 Q-16 -422 -4 -421 L-4 -415 Q-16 -417 -27 -413 Z" fill="${C.hair}"/>
      <path d="M4 -423 Q16 -431 28 -420 Q16 -425 4 -417 Z" fill="${C.hair}"/>

      <!-- eyes: almond shapes with a heavy upper lash line that flicks out.
           The iris slides around inside the eye, leading every look. -->
      ${eye(-15, -404, 1, 'l')}
      ${eye(15, -404, -1, 'r')}

      <!-- small sharp nose and two-tone berry lips -->
      <path d="M2 -394 L6 -381 L0 -380 Z" fill="${C.skinShade}"/>
      <path d="M-8 -369 Q-3 -372 0 -370 Q3 -372 8 -369 Q0 -366 -8 -369 Z" fill="${C.lips}"/>
      <path d="M-6 -368 Q0 -362 6 -368 Q0 -366 -6 -368 Z" fill="${C.lipsLight}"/>
    </g>
  </g>
</g>`;
}

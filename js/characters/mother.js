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
  spoon: '#b98652', spoonShade: '#93633a',
  watchBand: '#1c2d55', watchFace: '#dce8fa', note: '#6a9df5',
  plate: '#e6effb', plateShade: '#bfd0ea', lid: '#b9c7dd', lidShade: '#8fa1bf',
  crust: '#d9a45e', crustShade: '#b47b3b', crustDark: '#8e5d2a', crustLight: '#ecc583', berry: '#4b4a9c',
  sponge: '#f1dcae', spongeShade: '#d6bb83', frosting: '#6a9df5',
  cookie: '#cf9452', cookieShade: '#ad7438', chip: '#3a2414',
  flame: '#6a9df5', flameCore: '#dce8fa',
  eyeWhite: '#eef2f8', iris: '#8d92bd', pupil: '#14213d', lash: '#0f1730',
  lips: '#a23d63', lipsLight: '#c25a80', earring: '#4fc2d0',
  mouthInside: '#5a1f33', flush: 'rgba(214, 60, 60, 0.45)', angerMark: '#d63c3c', blush: 'rgba(225, 110, 130, 0.45)',
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
          <!-- happy squint: the lower lid pushes up (delighted moods only) -->
          <g class="happy-lid">
            <path d="M-14 10 L-14 7 Q0 2.5 14 7 L14 10 Z" fill="${C.skin}"/>
            <path d="M-11 6.4 Q0 2.6 11 6.4" stroke="${C.skinShade}" stroke-width="1.4" fill="none"/>
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
  <!-- rocket flames under her feet (blue, to stay cool), hidden until the rocket stunt -->
  <g class="prop prop-rocket">
    <g class="flame">
      <path d="M-40 -2 Q-26 0 -12 -2 Q-14 40 -26 78 Q-38 40 -40 -2 Z" fill="${C.flame}"/>
      <path d="M-34 -2 Q-26 0 -18 -2 Q-20 26 -26 50 Q-32 26 -34 -2 Z" fill="${C.flameCore}"/>
    </g>
    <g class="flame">
      <path d="M12 -2 Q26 0 40 -2 Q38 40 26 78 Q14 40 12 -2 Z" fill="${C.flame}"/>
      <path d="M18 -2 Q26 0 34 -2 Q32 26 26 50 Q20 26 18 -2 Z" fill="${C.flameCore}"/>
    </g>
  </g>

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
    <!-- rounded top, centered on the shoulder pivot, so the joint never shows -->
    <circle cx="-56" cy="-321" r="12" fill="${C.cardigan}"/>
    <path d="M-58 -332 Q-44 -332 -45 -316 L-58 -212 Q-70 -206 -80 -214 L-70 -318 Q-68 -332 -58 -332 Z" fill="${C.cardigan}"/>
    <path d="M-61 -210 L-80 -214 Q-83 -204 -81 -192 Q-79 -184 -72 -184 Q-67 -185 -66 -190 L-64 -198 Q-58 -198 -57 -202 Q-58 -207 -61 -210 Z" fill="${C.skin}"/>
    <!-- her watch, for checking how long your break is taking -->
    <path d="M-80.5 -214.5 L-59.5 -211.5 L-60 -207.5 L-81 -210.5 Z" fill="${C.watchBand}"/>
    <circle cx="-70" cy="-211" r="3.4" fill="${C.watchFace}" stroke="${C.watchBand}" stroke-width="1.4"/>
  </g>
  <g class="arm-r">
    <!-- a wooden spoon, hidden until she wags it -->
    <g class="prop prop-spoon">
      <path d="M68 -192 L75 -193 L81 -142 L75 -141 Z" fill="${C.spoon}"/>
      <ellipse cx="79" cy="-128" rx="9" ry="14" fill="${C.spoon}"/>
      <path d="M80 -142 Q90 -132 84 -116 Q82 -128 76 -140 Z" fill="${C.spoonShade}"/>
    </g>
    <!-- on her shaded side: rounded top on the pivot, sleeve in shade, a thin lit edge -->
    <circle cx="56" cy="-321" r="12" fill="${C.cardiganShade}"/>
    <path d="M58 -332 Q44 -332 45 -316 L58 -212 Q70 -206 80 -214 L70 -318 Q68 -332 58 -332 Z" fill="${C.cardiganShade}"/>
    <path d="M46.5 -322 Q47 -328 51 -331 L50.5 -316 L61.5 -212 L58 -212 L45.5 -316 Z" fill="${C.cardigan}"/>
    <path d="M61 -210 L80 -214 Q83 -204 81 -192 Q79 -184 72 -184 Q67 -185 66 -190 L64 -198 Q58 -198 57 -202 Q58 -207 61 -210 Z" fill="${C.skin}"/>
    <path d="M74 -212 L80 -214 Q83 -204 81 -192 Q79 -184 72 -184 Q78 -194 74 -212 Z" fill="${C.skinShade}"/>
  </g>


  <!-- a covered dish for the dish finale; which food is under the lid changes -->
  <g class="prop prop-dish">
    <ellipse cx="0" cy="-226" rx="52" ry="11" fill="${C.plate}"/>
    <path d="M16 -236 Q48 -236 52 -226 Q48 -218 16 -216 Z" fill="${C.plateShade}"/>
    <g class="food food-pie">
      <!-- the deep fluted side of the crust -->
      <path d="M-41 -236 L41 -236 L37 -220 Q0 -213 -37 -220 Z" fill="${C.crustShade}"/>
      <path d="M-31 -234 L-29 -218 M-19 -235 L-18 -216 M-7 -235 L-6 -215 M6 -235 L6 -215 M18 -235 L18 -216 M30 -234 L29 -218" stroke="${C.crustDark}" stroke-width="2" stroke-linecap="round"/>
      <!-- top: crust, blueberry filling, lattice -->
      <ellipse cx="0" cy="-237" rx="41" ry="11" fill="${C.crust}"/>
      <clipPath id="mother-pie-filling"><ellipse cx="0" cy="-238" rx="33" ry="7.5"/></clipPath>
      <ellipse cx="0" cy="-238" rx="33" ry="7.5" fill="${C.berry}"/>
      <g clip-path="url(#mother-pie-filling)" stroke="${C.crustLight}" stroke-width="4" stroke-linecap="round">
        <path d="M-30 -232 L-14 -246 M-14 -230 L2 -246 M2 -230 L18 -246 M18 -230 L34 -246"/>
        <path d="M-30 -246 L-14 -230 M-14 -246 L2 -230 M2 -246 L18 -230 M18 -246 L34 -230"/>
      </g>
      <!-- crimped rim -->
      <ellipse cx="0" cy="-237.5" rx="37" ry="9.5" fill="none" stroke="${C.crustLight}" stroke-width="3.5" stroke-dasharray="5 3"/>
      <path d="M-34 -241 Q-24 -247 -8 -248" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.4"/>
      <!-- steam: fresh out of the oven -->
      <path d="M-12 -252 Q-17 -260 -12 -267 Q-7 -274 -12 -281 M2 -254 Q-3 -263 2 -271 Q7 -279 2 -287 M16 -252 Q11 -260 16 -267 Q21 -274 16 -281" stroke="#9fb0cc" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.8"/>
    </g>
    <g class="food food-cake">
      <path d="M-32 -232 L-32 -262 Q0 -268 32 -262 L32 -232 Q0 -226 -32 -232 Z" fill="${C.sponge}"/>
      <path d="M14 -265 Q26 -264 32 -262 L32 -232 Q24 -230 16 -229 Z" fill="${C.spongeShade}"/>
      <path d="M-32 -248 Q0 -252 32 -248 L32 -243 Q0 -247 -32 -243 Z" fill="${C.frosting}"/>
      <path d="M-33 -262 Q0 -272 33 -262 Q30 -254 24 -256 Q20 -250 14 -255 Q6 -249 0 -255 Q-8 -250 -14 -256 Q-20 -250 -26 -256 Q-30 -253 -33 -262 Z" fill="${C.frosting}"/>
      <circle cx="0" cy="-272" r="6" fill="${C.berry}"/>
      <circle cx="-2" cy="-274" r="1.8" fill="#ffffff" opacity="0.7"/>
    </g>
    <g class="food food-cookies">
      <ellipse cx="-14" cy="-236" rx="17" ry="7" fill="${C.cookie}"/>
      <ellipse cx="14" cy="-236" rx="17" ry="7" fill="${C.cookieShade}"/>
      <ellipse cx="0" cy="-246" rx="17" ry="7" fill="${C.cookie}"/>
      <ellipse cx="0" cy="-256" rx="17" ry="7" fill="${C.cookie}"/>
      <circle cx="-6" cy="-257" r="2.4" fill="${C.chip}"/><circle cx="5" cy="-255" r="2.4" fill="${C.chip}"/>
      <circle cx="-2" cy="-245" r="2.4" fill="${C.chip}"/><circle cx="8" cy="-247" r="2.4" fill="${C.chip}"/>
      <circle cx="-18" cy="-236" r="2.4" fill="${C.chip}"/><circle cx="16" cy="-235" r="2.4" fill="${C.chip}"/>
    </g>
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
      <!-- eyebrows: thick, angular, tapered. Suspicious (one raised) by default;
           soft, even arches when she's happy. -->
      <g class="brows brows-suspicious">
        <path d="M-31 -413 Q-20 -422 -8 -421 L-8 -415 Q-20 -417 -31 -413 Z" fill="${C.hair}"/>
        <path d="M8 -423 Q20 -431 32 -420 Q20 -425 8 -417 Z" fill="${C.hair}"/>
      </g>
      <g class="brows brows-soft">
        <path d="M-31 -414 Q-21 -425 -8 -421 L-8 -417 Q-21 -420 -31 -410 Z" fill="${C.hair}"/>
        <path d="M31 -414 Q21 -425 8 -421 L8 -417 Q21 -420 31 -410 Z" fill="${C.hair}"/>
      </g>

      <!-- rosy cheeks (over the moon only) -->
      <g class="brows brows-flat">
        <path d="M-31 -413 L-8 -414.5 L-8 -410.5 L-31 -409.5 Z" fill="${C.hair}"/>
        <path d="M31 -413 L8 -414.5 L8 -410.5 L31 -409.5 Z" fill="${C.hair}"/>
      </g>
      <g class="brows brows-angry">
        <path d="M-31 -421 Q-20 -419 -7 -412 L-8.5 -408 Q-20 -414 -31 -417 Z" fill="${C.hair}"/>
        <path d="M31 -421 Q20 -419 7 -412 L8.5 -408 Q20 -414 31 -417 Z" fill="${C.hair}"/>
      </g>

      <!-- furious: a red flush and a cartoon anger mark -->
      <g class="flush">
        <ellipse cx="-21" cy="-386" rx="9" ry="5" fill="${C.flush}"/>
        <ellipse cx="21" cy="-386" rx="9" ry="5" fill="${C.flush}"/>
        <path d="M18 -434 L22 -428 M26 -436 L22 -428 M15 -425 L22 -428 M28 -423 L22 -428" stroke="${C.angerMark}" stroke-width="2.6" stroke-linecap="round"/>
      </g>

      <g class="blush">
        <ellipse cx="-23" cy="-385" rx="7" ry="3.5" fill="${C.blush}"/>
        <ellipse cx="23" cy="-385" rx="7" ry="3.5" fill="${C.blush}"/>
      </g>

      <!-- eyes: almond shapes with a heavy upper lash line that flicks out.
           The iris slides around inside the eye, leading every look. -->
      ${eye(-18, -404, 1, 'l')}
      ${eye(18, -404, -1, 'r')}

      <!-- small sharp nose and two-tone berry lips -->
      <path d="M2 -394 L6 -381 L0 -380 Z" fill="${C.skinShade}"/>
      <!-- mouths: tight and unimpressed / a smile / a big open grin -->
      <g class="mouth mouth-flat">
        <path d="M-8 -368.5 L8 -368.5 L8 -366 L-8 -366 Z" fill="${C.lips}"/>
      </g>
      <g class="mouth mouth-frown">
        <path d="M-9 -364.5 Q0 -372 9 -364.5 Q0 -368.5 -9 -364.5 Z" fill="${C.lips}"/>
      </g>
      <g class="mouth mouth-grit">
        <path d="M-10 -370 L10 -370 L9 -363.5 L-9 -363.5 Z" fill="#ffffff" stroke="${C.lips}" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M-9.5 -366.8 L9.5 -366.8 M-4 -370 L-4 -363.5 M2 -370 L2 -363.5 M7 -370 L7 -363.5" stroke="#b9c3d6" stroke-width="0.9"/>
      </g>
      <g class="mouth mouth-neutral">
        <path d="M-8 -369 Q-3 -372 0 -370 Q3 -372 8 -369 Q0 -366 -8 -369 Z" fill="${C.lips}"/>
        <path d="M-6 -368 Q0 -362 6 -368 Q0 -366 -6 -368 Z" fill="${C.lipsLight}"/>
      </g>
      <g class="mouth mouth-smile">
        <path d="M-10 -373 Q0 -369 10 -373 Q7 -365 0 -364 Q-7 -365 -10 -373 Z" fill="${C.lips}"/>
        <path d="M-8 -371 Q0 -368 8 -371 Q5 -366.5 0 -366 Q-5 -366.5 -8 -371 Z" fill="${C.lipsLight}"/>
      </g>
      <!-- whistling: lips in a little "o", with music notes floating up -->
      <g class="whistle">
        <ellipse cx="2" cy="-368" rx="3.6" ry="4" fill="${C.lips}"/>
        <ellipse cx="2" cy="-367.6" rx="1.6" ry="1.9" fill="${C.mouthInside}"/>
      </g>
      <g class="prop-notes">
        <g class="note">
          <ellipse cx="14" cy="-372" rx="3.2" ry="2.4" transform="rotate(-20 14 -372)" fill="${C.note}"/>
          <path d="M16.8 -373 L16.8 -385 Q21 -383 22 -379" stroke="${C.note}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        </g>
        <g class="note">
          <ellipse cx="14" cy="-372" rx="3.2" ry="2.4" transform="rotate(-20 14 -372)" fill="${C.note}"/>
          <path d="M16.8 -373 L16.8 -385 Q21 -383 22 -379" stroke="${C.note}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        </g>
      </g>
      <g class="mouth mouth-grin">
        <path d="M-10 -374 Q0 -370.5 10 -374 Q8.5 -364 0 -362.5 Q-8.5 -364 -10 -374 Z" fill="${C.mouthInside}"/>
        <path d="M-8.5 -372.8 Q0 -370 8.5 -372.8 L8 -369.8 Q0 -367.6 -8 -369.8 Z" fill="#ffffff"/>
        <path d="M-10 -374 Q0 -370.5 10 -374" stroke="${C.lips}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      </g>
    </g>
  </g>
</g>`;
}

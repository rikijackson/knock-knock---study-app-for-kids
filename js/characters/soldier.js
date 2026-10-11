// The soldier: a strict drill sergeant in dark green, drawn as SVG shapes on
// the same rig as the mother (same named parts and shoulder pivots, so the
// shared moves, moods and break loop work for him too).
// Style: bold silhouettes with smooth curves, flat fills, one hard darker
// shape per part (light from the left), no outlines.
// Coordinates: (0, 0) is between his feet; up is negative y.

const C = {
  skin: '#c08a62', skinShade: '#986541', stubble: 'rgba(70, 45, 30, 0.22)',
  hair: '#3a2a1e', hairShade: '#261a12', hairShine: '#5a4433',
  uniform: '#3c5a35', uniformShade: '#2c4527', uniformDark: '#22361e',
  shirt: '#1f2a1c',
  belt: '#2a2420', brass: '#c9a85a',
  boots: '#1d1916', bootShade: '#121010',
  stripes: '#c9a85a',
  eyeWhite: '#eef0ec', iris: '#5a4030', pupil: '#1b120c', lid: '#3a2a20',
  lips: '#8a5444', lipsLight: '#a86a56',
  mouthInside: '#4a1d1d', flush: 'rgba(214, 60, 60, 0.45)', angerMark: '#d63c3c',
  blush: 'rgba(225, 110, 130, 0.45)', note: '#6a9df5',
  watchBand: '#1d1916', watchFace: '#dfe6dc',
  metal: '#b9c3cc', metalShade: '#8b96a1',
  gold: '#e0b44c', goldShade: '#b88a2c', ribbon: '#2f6fdd', ribbonShade: '#2457b3',
  badge: '#2c4527', gun: '#3a3f45', gunShade: '#5a6168', gunGrip: '#2a2420', flash: '#ffd45a',
};

// One eye, around its center. Narrower than the mother's, with a heavy
// straight upper lid: a permanent squint.
function eye(cx, cy, flip, side) {
  const shape = 'M-11 0 Q-5 -5.5 4 -5.5 Q9 -4 11 0 Q5 4.5 -2 4.5 Q-8 4 -11 0 Z';
  const lid = 'M-12.5 -1 Q-5 -8 5 -7 Q10 -5.5 12.5 0 Q6 -4 3 -4.2 Q-5 -4.4 -12.5 -1 Z';
  const clip = `soldier-eye-${side}`;
  return `
    <g transform="translate(${cx} ${cy})">
      <g class="eye eye-${side}">
        <clipPath id="${clip}"><path d="${shape}" transform="scale(${flip} 1)"/></clipPath>
        <path d="${shape}" transform="scale(${flip} 1)" fill="${C.eyeWhite}"/>
        <g clip-path="url(#${clip})">
          <g class="pupil">
            <circle cx="${flip}" cy="0" r="4.6" fill="${C.iris}"/>
            <circle cx="${flip}" cy="0" r="2.4" fill="${C.pupil}"/>
            <circle cx="${flip + 1.6}" cy="-1.8" r="1.1" fill="#ffffff"/>
          </g>
          <g class="happy-lid">
            <path d="M-14 10 L-14 6 Q0 1.5 14 6 L14 10 Z" fill="${C.skin}"/>
          </g>
        </g>
        <path d="${lid}" transform="scale(${flip} 1)" fill="${C.lid}"/>
      </g>
    </g>`;
}

export function soldierSvg() {
  return `
<g class="char char-soldier">
  <!-- boots -->
  <path d="M-40 -34 L-10 -34 L-9 0 L-46 0 Q-48 -10 -40 -14 Z" fill="${C.boots}"/>
  <path d="M40 -34 L10 -34 L9 0 L46 0 Q48 -10 40 -14 Z" fill="${C.boots}"/>
  <path d="M24 -34 L40 -34 L40 -14 Q48 -10 46 0 L30 0 Z" fill="${C.bootShade}"/>

  <!-- trousers -->
  <path d="M-44 -192 L44 -192 L42 -30 L10 -30 L4 -120 L-4 -120 L-10 -30 L-42 -30 Z" fill="${C.uniform}"/>
  <path d="M18 -192 L44 -192 L42 -30 L24 -30 Z" fill="${C.uniformShade}"/>
  <path d="M-38 -150 L-14 -150 L-14 -112 L-38 -112 Z" fill="${C.uniformShade}"/>

  <!-- torso: jacket, belt, pockets, collar -->
  <g class="torso">
    <path d="M-60 -318 Q-58 -338 -34 -338 L34 -338 Q58 -338 60 -318 Q50 -260 46 -194 Q0 -186 -46 -194 Q-50 -260 -60 -318 Z" fill="${C.uniform}"/>
    <path d="M22 -338 L34 -338 Q58 -338 60 -318 Q50 -260 46 -194 Q36 -191 26 -190 Q34 -270 22 -338 Z" fill="${C.uniformShade}"/>
    <path d="M-16 -338 L16 -338 L0 -306 Z" fill="${C.shirt}"/>
    <path d="M-22 -338 L-4 -312 L-14 -300 L-30 -336 Z" fill="${C.uniformDark}"/>
    <path d="M22 -338 L4 -312 L14 -300 L30 -336 Z" fill="${C.uniformDark}"/>
    <rect x="-40" y="-290" width="26" height="30" rx="3" fill="${C.uniformShade}"/>
    <rect x="14" y="-290" width="26" height="30" rx="3" fill="${C.uniformDark}"/>
    <rect x="-41" y="-292" width="28" height="9" rx="2" fill="${C.uniformDark}"/>
    <rect x="13" y="-292" width="28" height="9" rx="2" fill="${C.uniformDark}"/>
    <path d="M-48 -206 L48 -206 L47 -192 L-47 -192 Z" fill="${C.belt}"/>
    <rect x="-9" y="-208" width="18" height="18" rx="2" fill="${C.brass}"/>
    <rect x="-4" y="-203" width="8" height="8" fill="${C.belt}"/>
  </g>

  <!-- his right arm (viewer's left, lit side) with his watch -->
  <g class="arm-l">
    <circle cx="-56" cy="-321" r="13" fill="${C.uniform}"/>
    <path d="M-58 -334 Q-43 -334 -44 -316 L-58 -210 Q-71 -204 -82 -213 L-71 -318 Q-69 -334 -58 -334 Z" fill="${C.uniform}"/>
    <path d="M-60 -224 L-80 -228 L-82 -212 L-58 -208 Z" fill="${C.uniformDark}"/>
    <path d="M-61 -208 L-82 -212 Q-86 -202 -83 -190 Q-81 -181 -73 -181 Q-67 -182 -66 -188 L-64 -196 Q-58 -196 -56 -200 Q-57 -205 -61 -208 Z" fill="${C.skin}"/>
    <path d="M-81 -213 L-59 -210 L-59.5 -205 L-81.5 -208 Z" fill="${C.watchBand}"/>
    <circle cx="-70" cy="-209" r="3.2" fill="${C.watchFace}" stroke="${C.watchBand}" stroke-width="1.3"/>
  </g>

  <!-- his left arm (viewer's right, shaded side): stripes, and props he holds -->
  <g class="arm-r">
    <circle cx="56" cy="-321" r="13" fill="${C.uniformShade}"/>
    <path d="M58 -334 Q43 -334 44 -316 L58 -210 Q71 -204 82 -213 L71 -318 Q69 -334 58 -334 Z" fill="${C.uniformShade}"/>
    <path d="M45.5 -322 Q46 -329 50 -332 L49.5 -316 L61 -212 L57.5 -211 L44.5 -316 Z" fill="${C.uniform}"/>
    <path d="M52 -296 L60 -288 L68 -298 M52 -287 L60 -279 L68 -289 M52 -278 L60 -270 L68 -280" stroke="${C.stripes}" stroke-width="3" fill="none" stroke-linejoin="round"/>
    <path d="M60 -224 L80 -228 L82 -212 L58 -208 Z" fill="${C.uniformDark}"/>
    <path d="M61 -208 L82 -212 Q86 -202 83 -190 Q81 -181 73 -181 Q67 -182 66 -188 L64 -196 Q58 -196 56 -200 Q57 -205 61 -208 Z" fill="${C.skin}"/>
    <path d="M75 -210 L82 -212 Q86 -202 83 -190 Q81 -181 73 -181 Q80 -192 75 -210 Z" fill="${C.skinShade}"/>

    <!-- props held in his hand, drawn over it (hidden until their moment) -->
    <g class="prop prop-badge"><g transform="translate(72 -195) scale(2.2) translate(-72 195)">
      <path d="M72 -186 L92 -186 L92 -170 Q82 -158 72 -170 Z" fill="${C.gold}" stroke="${C.goldShade}" stroke-width="2"/>
      <path d="M82 -182 L84.5 -176 L91 -176 L86 -172 L88 -166 L82 -170 L76 -166 L78 -172 L73 -176 L79.5 -176 Z" fill="${C.uniformDark}"/>
    </g></g>
    <g class="prop prop-medal"><g transform="translate(72 -195) scale(2.2) translate(-72 195)">
      <path d="M74 -200 L80 -200 L84 -176 L78 -176 Z" fill="${C.ribbon}"/>
      <path d="M86 -200 L92 -200 L86 -176 L80 -176 Z" fill="${C.ribbonShade}"/>
      <circle cx="82" cy="-164" r="12" fill="${C.gold}"/>
      <circle cx="82" cy="-164" r="7.5" fill="none" stroke="${C.goldShade}" stroke-width="2"/>
      <path d="M88 -172 A12 12 0 0 1 90 -156 Q86 -164 88 -172 Z" fill="${C.goldShade}"/>
    </g></g>
    <g class="prop prop-trophy"><g transform="translate(72 -195) scale(2.2) translate(-72 195)">
      <path d="M66 -214 L98 -214 Q98 -184 82 -178 Q66 -184 66 -214 Z" fill="${C.gold}"/>
      <path d="M86 -214 L98 -214 Q98 -184 82 -178 Q92 -190 86 -214 Z" fill="${C.goldShade}"/>
      <path d="M66 -208 Q56 -208 58 -198 Q60 -190 68 -192" stroke="${C.gold}" stroke-width="3.5" fill="none"/>
      <path d="M98 -208 Q108 -208 106 -198 Q104 -190 96 -192" stroke="${C.goldShade}" stroke-width="3.5" fill="none"/>
      <rect x="78" y="-178" width="8" height="12" fill="${C.goldShade}"/>
      <rect x="70" y="-167" width="24" height="7" rx="2" fill="${C.gold}"/>
    </g></g>
    <g class="prop prop-bomb"><g transform="translate(72 -195) scale(2.2) translate(-72 195)">
      <circle cx="82" cy="-176" r="13" fill="${C.uniformDark}"/>
      <path d="M86 -188 Q92 -196 98 -194" stroke="${C.metalShade}" stroke-width="2.5" fill="none"/>
      <circle cx="98" cy="-194" r="3.5" fill="${C.gold}"/>
      <text x="82" y="-171" text-anchor="middle" font-size="11" font-weight="800" fill="${C.gold}">!</text>
    </g></g>
    <g class="prop prop-gun"><g transform="translate(72 -195) scale(2.2) translate(-72 195)">
      <!-- grip under his hand -->
      <path d="M68 -186 L80 -186 L82 -164 L70 -164 Z" fill="${C.gunGrip}"/>
      <!-- the gun, end-on: a square slide with the round muzzle in the middle -->
      <rect x="62" y="-212" width="24" height="24" rx="4" fill="${C.gun}"/>
      <rect x="62" y="-212" width="24" height="5" rx="2" fill="${C.gunShade}"/>
      <circle cx="74" cy="-199" r="8" fill="${C.gunShade}"/>
      <circle cx="74" cy="-199" r="5" fill="#05070c"/>
      <!-- the flash bursts toward you -->
      <g class="muzzle-flash">
        <path d="M74 -221 L78 -206 L92 -213 L82 -201 L96 -195 L81 -194 L86 -180 L74 -190 L62 -180 L67 -194 L52 -195 L66 -201 L56 -213 L70 -206 Z" fill="${C.flash}"/>
        <circle cx="74" cy="-199" r="6" fill="#ffffff"/>
      </g>
    </g></g>

  </g>

  <!-- a confetti cannon on the floor beside him (only for that stunt) -->
  <g class="prop prop-cannon">
    <ellipse cx="128" cy="-6" rx="30" ry="6" fill="rgba(0,0,0,0.25)"/>
    <circle cx="112" cy="-16" r="15" fill="${C.belt}"/>
    <circle cx="112" cy="-16" r="6" fill="${C.brass}"/>
    <g class="cannon-barrel">
      <path d="M96 -44 L150 -78 L160 -62 L106 -26 Z" fill="${C.uniformDark}"/>
      <rect x="146" y="-82" width="18" height="26" rx="4" transform="rotate(-32 155 -69)" fill="${C.brass}"/>
    </g>
  </g>

  <!-- neck (reaches up under the head so its corners never show) -->
  <path d="M-14 -392 L14 -392 L16 -332 L-16 -332 Z" fill="${C.skin}"/>
  <path d="M-14 -366 Q0 -352 14 -366 L15 -344 Q0 -337 -15 -347 Z" fill="${C.skinShade}"/>

  <!-- head -->
  <g class="head">
    <!-- ears -->
    <ellipse cx="-38" cy="-404" rx="6" ry="10" fill="${C.skin}"/>
    <ellipse cx="38" cy="-404" rx="6" ry="10" fill="${C.skinShade}"/>
    <!-- face: square jaw -->
    <path d="M-35 -444 L35 -444 L38 -396 Q37 -372 26 -360 L12 -350 L-12 -350 L-26 -360 Q-37 -372 -38 -396 Z" fill="${C.skin}"/>
    <path d="M18 -444 L35 -444 L38 -396 Q37 -372 26 -360 L12 -350 L4 -350 L16 -366 Q26 -384 26 -404 Q24 -430 18 -444 Z" fill="${C.skinShade}"/>
    <!-- stubble along the jaw -->
    <path d="M-34 -384 Q-30 -366 -12 -352 L12 -352 Q30 -366 34 -384 Q20 -366 0 -362 Q-20 -366 -34 -384 Z" fill="${C.stubble}"/>
    <!-- hair peeking out from under the cap: soft locks across the forehead,
         curling down a little at the temples, stopping above the ears -->
    <path d="M-41 -447 L41 -447 Q44 -432 39 -419 Q36 -426 33 -428 Q31 -421 28 -419 Q26 -430 21 -434
             Q14 -430 8 -434 Q2 -429 -4 -434 Q-11 -429 -17 -434 Q-23 -430 -28 -419 Q-31 -421 -33 -428
             Q-36 -426 -39 -419 Q-44 -432 -41 -447 Z" fill="${C.hair}"/>
    <path d="M18 -447 L41 -447 Q44 -432 39 -419 Q36 -426 33 -428 Q31 -421 28 -419 Q26 -430 21 -434
             Q20 -440 18 -447 Z" fill="${C.hairShade}"/>
    <path d="M-30 -440 Q-24 -444 -16 -442 M-6 -441 Q2 -445 10 -441" stroke="${C.hairShine}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <!-- patrol cap -->
    <path d="M-38 -444 L-35 -484 Q0 -492 35 -484 L38 -444 Z" fill="${C.uniform}"/>
    <path d="M14 -490 Q28 -488 35 -484 L38 -444 L22 -444 Q24 -470 14 -490 Z" fill="${C.uniformShade}"/>
    <path d="M-43 -446 Q0 -440 47 -447 L50 -436 Q0 -428 -45 -436 Z" fill="${C.uniformDark}"/>
    <rect x="-7" y="-474" width="14" height="14" rx="2" fill="${C.brass}"/>

    <!-- the face features move together so the head can "turn" -->
    <g class="features">
      <!-- brows: stern by default, softer when you've earned it -->
      <g class="brows brows-suspicious">
        <path d="M-31 -421 L-7 -414 L-8 -409 L-31 -415 Z" fill="${C.hair}"/>
        <path d="M31 -421 L7 -414 L8 -409 L31 -415 Z" fill="${C.hair}"/>
      </g>
      <g class="brows brows-soft">
        <path d="M-31 -418 Q-20 -424 -7 -419 L-8 -414 Q-20 -418 -31 -413 Z" fill="${C.hair}"/>
        <path d="M31 -418 Q20 -424 7 -419 L8 -414 Q20 -418 31 -413 Z" fill="${C.hair}"/>
      </g>
      <g class="brows brows-flat">
        <path d="M-31 -416 L-7 -415 L-7 -410 L-31 -411 Z" fill="${C.hair}"/>
        <path d="M31 -416 L7 -415 L7 -410 L31 -411 Z" fill="${C.hair}"/>
      </g>
      <g class="brows brows-angry">
        <path d="M-31 -425 L-6 -412 L-8 -407 L-31 -419 Z" fill="${C.hair}"/>
        <path d="M31 -425 L6 -412 L8 -407 L31 -419 Z" fill="${C.hair}"/>
      </g>

      ${eye(-16, -402, 1, 'l')}
      ${eye(16, -402, -1, 'r')}

      <!-- red flush and an anger mark (furious) / rosy cheeks (over the moon) -->
      <g class="flush">
        <ellipse cx="-22" cy="-384" rx="9" ry="5" fill="${C.flush}"/>
        <ellipse cx="22" cy="-384" rx="9" ry="5" fill="${C.flush}"/>
        <path d="M18 -436 L22 -430 M26 -438 L22 -430 M15 -427 L22 -430 M28 -425 L22 -430" stroke="${C.angerMark}" stroke-width="2.6" stroke-linecap="round"/>
      </g>
      <g class="blush">
        <ellipse cx="-22" cy="-384" rx="7" ry="3.5" fill="${C.blush}"/>
        <ellipse cx="22" cy="-384" rx="7" ry="3.5" fill="${C.blush}"/>
      </g>

      <!-- strong nose -->
      <path d="M1 -398 L8 -378 L-3 -376 Z" fill="${C.skinShade}"/>

      <!-- mouths: a hard flat line by default -->
      <g class="mouth mouth-neutral">
        <path d="M-10 -366 L10 -366 L10 -363 L-10 -363 Z" fill="${C.lips}"/>
      </g>
      <!-- pleased: a one-sided smirk (the most approval you'll get) -->
      <g class="mouth mouth-smile">
        <path d="M-10 -365.5 L5 -365.5 Q9 -366 11 -369 L12 -367 Q10 -363 5 -363 L-10 -363 Z" fill="${C.lips}"/>
      </g>
      <!-- delighted: a small closed smile -->
      <g class="mouth mouth-grin">
        <path d="M-10 -366.5 Q0 -362 10 -366.5 L10.5 -364.5 Q0 -359.5 -10.5 -364.5 Z" fill="${C.lips}"/>
      </g>
      <!-- over the moon (2-hour sessions only): a real grin -->
      <g class="mouth mouth-cheer">
        <path d="M-11 -369 Q0 -365.5 11 -369 Q9 -358 0 -356.5 Q-9 -358 -11 -369 Z" fill="${C.mouthInside}"/>
        <path d="M-9.5 -367.8 Q0 -365 9.5 -367.8 L9 -364.6 Q0 -362.6 -9 -364.6 Z" fill="#ffffff"/>
      </g>
      <g class="mouth mouth-flat">
        <path d="M-9 -365.5 L9 -365.5 L9 -363 L-9 -363 Z" fill="${C.lips}"/>
      </g>
      <g class="mouth mouth-frown">
        <path d="M-10 -360.5 Q0 -369 10 -360.5 Q0 -365 -10 -360.5 Z" fill="${C.lips}"/>
      </g>
      <g class="mouth mouth-grit">
        <path d="M-11 -368 L11 -368 L10 -360 L-10 -360 Z" fill="#ffffff" stroke="${C.lips}" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M-10.5 -364 L10.5 -364 M-4 -368 L-4 -360 M2 -368 L2 -360 M7 -368 L7 -360" stroke="#b9c3cc" stroke-width="0.9"/>
      </g>
      <!-- shouting (orders!) -->
      <g class="shout">
        <path d="M-11 -370 Q0 -372 11 -370 Q10 -354 0 -351 Q-10 -354 -11 -370 Z" fill="${C.mouthInside}"/>
        <path d="M-9.5 -369 Q0 -370.5 9.5 -369 L9 -366 Q0 -367 -9 -366 Z" fill="#ffffff"/>
      </g>

      <!-- whistling during a break (a march, naturally) -->
      <g class="whistle">
        <ellipse cx="2" cy="-365" rx="3.6" ry="4" fill="${C.lips}"/>
        <ellipse cx="2" cy="-364.6" rx="1.6" ry="1.9" fill="${C.mouthInside}"/>
      </g>
      <g class="prop-notes">
        <g class="note">
          <ellipse cx="14" cy="-369" rx="3.2" ry="2.4" transform="rotate(-20 14 -369)" fill="${C.note}"/>
          <path d="M16.8 -370 L16.8 -382 Q21 -380 22 -376" stroke="${C.note}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        </g>
        <g class="note">
          <ellipse cx="14" cy="-369" rx="3.2" ry="2.4" transform="rotate(-20 14 -369)" fill="${C.note}"/>
          <path d="M16.8 -370 L16.8 -382 Q21 -380 22 -376" stroke="${C.note}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        </g>
      </g>

      <!-- his drill whistle (signature check-in) -->
      <g class="prop prop-whistle">
        <path d="M4 -368 L22 -372 L23 -362 L5 -362 Z" fill="${C.metal}"/>
        <circle cx="26" cy="-366" r="7" fill="${C.metal}"/>
        <circle cx="26" cy="-366" r="3" fill="${C.metalShade}"/>
        <path d="M14 -362 Q4 -340 -14 -332" stroke="${C.ribbon}" stroke-width="1.5" fill="none"/>
      </g>
    </g>
  </g>

  <!-- his saluting arm: upper arm out to the side, elbow bent, hand flat at
       the brim of his cap. Shown instead of his straight arm for the salute,
       and drawn last so it's in front of his head. -->
  <g class="prop prop-salute-arm">
    <circle cx="56" cy="-321" r="13" fill="${C.uniformShade}"/>
    <!-- upper arm: shoulder out and up to the elbow -->
    <path d="M65.8 -314.1 L46.2 -327.9 L88.2 -387.9 L107.8 -374.1 Z" fill="${C.uniformShade}"/>
    <path d="M46.2 -327.9 L88.2 -387.9 L93 -384.5 L51 -324.5 Z" fill="${C.uniform}"/>
    <circle cx="98" cy="-381" r="12" fill="${C.uniformShade}"/>
    <!-- forearm: elbow back in to the brim of his cap -->
    <path d="M105.8 -388.8 L90.2 -373.2 L34.2 -428.2 L49.8 -443.8 Z" fill="${C.uniformShade}"/>
    <path d="M90.2 -373.2 L94 -369.5 L38 -424.5 L34.2 -428.2 Z" fill="${C.uniformDark}"/>
    <path d="M104 -390.5 L108 -386.5 L52 -441.5 L49.8 -443.8 Z" fill="${C.uniform}"/>
    <!-- flat hand at the brim -->
    <path d="M51 -446 L35 -428 L16 -437 Q12 -446 18 -450 L32 -454 Z" fill="${C.skin}"/>
    <path d="M51 -446 L35 -428 L40 -438 Z" fill="${C.skinShade}"/>
  </g>
</g>`;
}

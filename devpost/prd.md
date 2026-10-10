---
doc: prd
status: approved
---

# Study Check-In (working title) — Product Requirements

A free, minimalistic study website for students who burn out on long study sessions. You knock on a door, pick who checks on you, and a funny animated character pops out at intervals to make sure you're studying.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`.

## The Core Journey
Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

1. **First visit:** the screen shows only a giant door. Curious, you click it. *Tuk tuk.* The door opens a crack and shuts. You knock again, and it happens again. On the third knock someone peeks out: "Yo, why are you knocking on my door?" A short conversation follows.
2. **Starting a session:** you knock, there's darkness behind the door, and a voice asks in a speech bubble, "Do you want to start a study session?"
   - **No:** the door slams shut with a *bang*.
   - **Yes:** "Who do you want to check up on you?" You pick a character (mother, soldier, or father if unlocked).
3. **Setup by the character:** your chosen character peeks out and asks:
   - Timer (counts down) or stopwatch (counts up)?
   - "How often do you want me to check up on you?" Pick a number of minutes, or **random**.
   - "Would you like to choose any tasks for this session?" Pick from your to-do list, or add new ones.
   - "Are you sure you'd like to start?" Yes.
4. **Studying:** the door slides to the left and shuts. A huge clock fills the right-center of the screen, with your session's tasks below it.
5. **Check-ins:** when a check-in is due, the door **creaks** open and the character comes out with one of several animations, never the same one twice in a row. For example, they lean forward with their eyes darting left and right, give a slow nod, and sneak back in. Or they lean out and stare at you. A speech bubble says something like "Are you sure you're studying?" Then they go back inside.
6. **Ending:** the timer hits zero, or you end the stopwatch session. You're asked which of your session's tasks you finished.
7. **The finale:** the door opens and the character comes **fully out** with their signature funny move, like mom doing a backflip or bringing out a dish she's been making in the kitchen. They give a short, varied summary: "I checked on you 3 times, you studied 45 minutes, you finished 2 tasks." If you finished no tasks, the task line is skipped and they praise your focus instead. **How big the finale is depends on how long you studied** *(changed during the build)*: under 40 minutes, a short proud moment; 40 minutes to 2 hours, she brings out a dish (a different one each time); 2 hours or more, a stunt (a different one each time).
8. **Rewards:** you earn coins (1 per minute studied). Spend them in the marketplace to unlock characters.
9. **Progress:** the stats panel shows a heat map of hours studied per day, plus simple numbers.

## Screens and Layout
There is one main page, plus pop-up panels that open inside the page.

- **Door screen (home):** a giant door in the center, and nothing else on the very first visit. After that, a small column of buttons sits at the start (left side) of the screen: **Stats**, **Tasks**, **Marketplace**.
- **Study screen:** the same page, rearranged. The door is on the left, a huge clock (big numbers) in the right-center, and the session's tasks below the clock. There's a break button too (see *Breaks*).
- **Stats panel (pop-up):** a heat map of hours studied per day, plus a few simple numbers (e.g. most-studied day, average study time). Nothing else.
- **Tasks panel (pop-up):** your full to-do list. Add tasks anytime.
- **Marketplace panel (pop-up):** characters with their prices, showing which are owned, which you can afford, and which are locked. Your coin balance is visible.
- **Speech bubbles** carry all character dialogue and questions, with buttons for answers (Yes/No, character choice, etc.).

## Look and Feel
- **Colors:** the overall theme is cool, dark blue, meaning blues and whites, with **no yellow, orange or warm colors in the interface**. Things in the scene can use natural colors: skin, food, a wooden spoon. *(Clarified by the learner during the build.)*
- **Modes:** light and dark mode (dark mode is a must).
- **Style:** minimalistic, but interactive and eye-catching. Very little on screen at once, and the door is the star.
- **Art reference:** the Netflix show *Carmen Sandiego*. Animated, shaded cartoon style with bold, clean shapes. Characters and the door should take inspiration from that look, in cool colors.
- **Sound:** a knock (*tuk tuk*), a door creak when a check-in starts, and a bang when the door slams.
- **Tone:** funny and surprising. Dialogue should be playful, never annoying, and speech bubbles stay quiet so they don't disturb studying.

## Features and Behavior

### Door Intro (first visit)
- [ ] On first visit, only the door is visible: no buttons, no text.
- [ ] Clicking the door plays a knock sound. The 1st and 2nd knocks make the door open a crack and shut.
- [ ] The 3rd knock makes a character peek out with "Yo, why are you knocking on my door?" and a short back-and-forth in speech bubbles.
- [ ] After the intro, the side buttons (Stats, Tasks, Marketplace) appear.

### Starting a Session
- [ ] Knocking (after the intro) shows darkness behind the door and asks "Do you want to start a study session?" with Yes/No.
- [ ] **No** slams the door with a bang sound and returns to the door screen.
- [ ] **Yes** asks who should check on you and shows **all three characters**. Locked ones are visibly locked and can't be chosen.
- [ ] The chosen character peeks out and asks, in order: timer or stopwatch; check-in frequency; which tasks for this session; then "Are you sure you'd like to start?"
- [ ] Timer mode lets you set a session length.
- [ ] Every setup question after the first has a **← Back** button that returns to the previous question, keeping your answers. *(Added during the build at the learner's request.)*

### Check-In Frequency
- [ ] **Fixed:** choose a number of minutes between check-ins. Very short options exist so it can be shown in the demo.
- [ ] **Random:** check-ins happen at irregular, unpredictable times (e.g. at the 15, 35 and 60 minute marks).

### Study Screen and Clock
- [ ] When the session starts, the door slides left and shuts, and a huge clock appears right-center.
- [ ] Stopwatch counts **up** from 0:00. Timer counts **down** from the chosen length.
- [ ] The tasks chosen for this session are listed below the clock, each with a tickbox. Ticking one marks it done right away. *(Added during the build at the learner's request.)*

### Door Pranks
- [ ] Clicking the door while studying makes it creak open onto darkness (nobody there), then slam shut with a bang. It never interrupts a check-in. *(Added during the build at the learner's request.)*

### Settings and Sounds
- [ ] A settings button in the top-right corner opens a panel with a **sound effects on/off** switch, remembered between visits. *(Added during the build at the learner's request.)*
- [ ] Buttons make a soft click sound (made in the browser, no file needed). *(Added during the build.)*

### Breaks
Source: `scope.md > The POC Boundary`.
- [ ] A break button pauses the session so you can get water or food. The clock stops and no check-ins happen during a break.
- [ ] Resuming continues the clock where it left off.
- [ ] **During a break she comes out and waits** *(added during the build at the learner's request)*: she looks around and whistles, with a quick glance at her watch now and then. As the break goes on she gets **annoyed** (at 25% of the break limit), **angry** (50%) and **furious** (80%), with nagging lines. At the **break limit** (Settings, default 1 hour) she storms in, **slams the door and ends the session**: no finale, but studied minutes still earn coins. A small **break timer** above the clock shows how long the break has been, against the limit.
- [ ] Settings also has **Longest break** (15 min – 2 hours).

### Character Check-Ins
- [ ] At each check-in, a door creak plays, the door opens, and the character appears.
- [ ] Each character has **several** check-in animations (e.g. peek-and-retreat; lean, eyes darting, slow nod, sneak back; lean and stare). The same one never plays twice in a row.
- [ ] A short speech bubble line appears (e.g. "Are you sure you're studying?") and varies between check-ins.
- [ ] **The longer you study, the happier she is** *(added during the build)*: suspicious at first, pleased after 20 minutes (a smile, warmer lines), delighted after 1 hour (a big grin). At the finale she's pleased (proud hop), delighted (dish) or over the moon (stunt).
- [ ] The character returns behind the door and the session continues. No input is needed from the student.

### Session End and Finale
- [ ] The session ends when the timer reaches zero, or when you press end (stopwatch).
- [ ] You're asked which session tasks you completed, with any already ticked during the session pre-ticked. Completed ones are checked off in your to-do list.
- [ ] The character comes fully out of the door, with the door fully open.
- [ ] The finale depends on study time: **under 15 min** she's unimpressed (head shake, no praise, "let's aim for longer next time"); **15–40 min** a short proud moment; **40 min – 2 h** a dish (mother: blueberry pie, cake or cookies, picked at random); **2 h or more** a stunt (mother: cartwheel, backflip or rocket, picked at random). Demo mode shrinks these thresholds so they fit in a short video. *(Changed during the build, replacing the 3+ tasks rule: the learner wants the reward tied to time studied.)*
- [ ] The summary speech bubble shows the number of check-ins, minutes studied, and tasks completed. The task line is skipped if none were completed. The wording varies between sessions.
- [ ] Coins earned are shown and added to your balance.

### Tasks
- [ ] You can add tasks to a to-do list anytime from the Tasks panel.
- [ ] Before a session, you choose which tasks to work on from that list, or add new ones there.
- [ ] Tasks you complete are marked done.

### Coins and Marketplace
- [ ] You earn 1 coin per minute studied.
- [ ] Characters get more expensive as you go (100, then 200, then 300…).
- [ ] **Mother** is free and owned from the start. **Soldier** can be unlocked. **Father** is shown but stays locked in this version.
- [ ] You start with **150 coins**. Soldier costs **100**, father costs **200**, so the soldier unlock can be shown in the demo while father stays locked.
- [ ] Buying a character deducts the coins and makes them choosable right away.
- [ ] You can't buy a character you can't afford, and the panel makes that clear.

### Stats and Heat Map
- [ ] The Stats panel shows a heat map of hours studied per day.
- [ ] A few simple numbers are shown (e.g. most-studied day, average study time).
- [ ] The heat map starts with **sample past data**, with a small label marking it as demo data. Your real sessions get added on top.

## Characters
| Character | Status in this version | Animations needed |
|---|---|---|
| Mother | Free, owned from start | Peek, several check-ins, three finale tiers (proud moment, 3 dishes, 3 stunts) |
| Soldier | Unlockable, unlocked in the demo | Peek, several check-ins, three finale tiers (his versions decided in the build) |
| Father | Shown, locked | None. Never unlocked in this version. |

## States and Boundaries
- **First visit:** only the door. The intro plays once. Later visits go straight to the door screen with buttons.
- **No tasks:** if your to-do list is empty or you choose none, the session runs without tasks and the finale skips the task line.
- **Can't afford:** the marketplace shows the price and doesn't let you buy.
- **Locked character:** visible in the picker but not selectable.
- **On break:** the clock is paused and there are no check-ins.
- **What's kept when you come back:** coins, unlocked characters, your to-do list, and study history (for the heat map). *(Confirmed by learner.)*
- **Closing the page mid-session:** the session is lost and not counted. *(Confirmed by learner.)*

## Product Decisions
- **Keep stats/heat map now:** "Otherwise, my app's just gonna feel like a comedy app." It gives the app a real study-tracking purpose. It's kept small and is the first thing to simplify if the build runs long.
- **Fake heat-map history:** "we won't be able to show it in the video" otherwise. Labeled as demo data to stay honest.
- **Timer and stopwatch now** (moved from scope's *Later*): "it's very important," and it's small.
- **Session setup happens through the character, not a form,** to keep the surprise and humor (`scope.md > The Unique Kernel`).
- **Different animation every check-in:** "again, element of surprise."
- **Speech bubbles, not loud audio, for dialogue:** "I don't want it to disturb the person." Sound is used only for door effects.
- **Three characters in the picker** (mother, soldier, father) because "that would look fun," but only two are fully animated.
- **Start with 150 coins; soldier 100, father 200,** so an unlock can be shown in the demo while father stays locked.
- **Cool colors only, with dark mode,** and Carmen Sandiego–inspired art.

## What We're Building
Everything under *Features and Behavior*: the door intro, starting a session through dialogue, timer/stopwatch, fixed or random check-ins, breaks, varied check-in animations, the finale with a summary, tasks, coins and the marketplace (soldier unlockable, father locked), and a stats panel with a heat map seeded with demo data. Two fully animated characters, light and dark mode, and door sound effects.

## Deferred From the POC
- **Mood/streak-based reactions:** motivational messages on a good streak, funny threats ("you better study… or else") on a bad one, and different finales by streak. These need real multi-day history.
- **Character's face getting sadder/angrier each day you skip.** Same reason.
- **Father's animations and unlock.**
- **Marketplace door accessories.**

## Possible Later Enhancements
- More characters, each with their own personality and signature finale.
- Optional timelapse recording of yourself studying (off by default).

## Non-Goals
- **App blocking / strict modes:** a website can't block other apps.
- **Camera presence detection:** too unreliable and big for this build.
- **Accounts or logins:** not needed to prove the idea.
- **Detailed analytics:** the stats stay to the heat map and a couple of numbers.

## Open Questions
- **Project name (can wait, needed by `6-ship`):** still "Study Check-In (working title)."
- **Soldier's signature finale move (can wait until build):** mom's is a backflip or bringing out a dish. The soldier's is not decided.

*Resolved at review: coin numbers (start 150, soldier 100, father 200) and what's kept between visits.*

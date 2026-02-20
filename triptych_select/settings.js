// Set speeds
const SLOW = 0.0001;
const MEDIUM = 0.001;
const FAST = 0.05;

// Set layout ratios
const TRIPTYCH = 0.34;
const SLIVER = 0.49;
const DESERT = 0.1;

// Narrative
const PROGRESSIONS = {
  FILE: {
    PROCESS: [SLOW, SLOW],
    FOLLOW: [MEDIUM, MEDIUM],
    VANISH: [FAST, FAST],
    OVERTAKE: [MEDIUM, SLOW],
    WIPEOUT: [FAST, MEDIUM],
    DEPART: [SLOW, MEDIUM],
    DUST: [SLOW, FAST]
  },
  EXPAND: {
    PROCESS: [-SLOW, SLOW],
    LEAVE: [-MEDIUM, MEDIUM],
    VANISH: [-FAST, FAST],
    DEPART: [-SLOW, MEDIUM],
    RUNAWAY: [-MEDIUM, FAST],
    DESERT: [-SLOW, FAST]
  },
  SHRINK: {
    PROCESS: [SLOW, -SLOW],
    APPROACH: [MEDIUM, -MEDIUM],
    VANISH: [FAST, -FAST],
    ACCOST: [SLOW, -MEDIUM],
    RUSH: [SLOW, -FAST],
  }
}

// Sets
const SCORE = {
  1: {
    layout: SLIVER,
    progression: PROGRESSIONS.FILE.FOLLOW,
    dir : 1,
    fade_time: 3,
    hold_time: 1
  },
  2: {
    layout: TRIPTYCH,
    progression: PROGRESSIONS.SHRINK.APPROACH,
    dir : 1,
    fade_time: 5,
    hold_time: 3
  }
}
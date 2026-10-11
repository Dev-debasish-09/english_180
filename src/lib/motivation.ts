import type { DailyProgress, StepKey } from "../db/types";
import { addDays } from "./date";

export interface Milestone {
  day: number;
  title: string;
  en: string;
  hi: string;
}

export const MILESTONES: Milestone[] = [
  {
    day: 7,
    title: "One week",
    en: "You now have a real daily habit. Most people who try something like this quit before day 7 — you didn't.",
    hi: "अब आपकी एक असली रोज़ की आदत है। ज़्यादातर लोग दिन 7 से पहले छोड़ देते हैं — आपने नहीं छोड़ा।",
  },
  {
    day: 30,
    title: "30 days",
    en: "You've learned roughly 300 words and written about 30 short pieces. Re-read your Day 1 writing — the gap is already visible.",
    hi: "आपने लगभग 300 शब्द सीखे और लगभग 30 छोटी लेखनी लिखी हैं। दिन 1 की लेखनी फिर पढ़ें — फर्क साफ दिखेगा।",
  },
  {
    day: 60,
    title: "Foundation complete",
    en: "Foundation is done. You can now build correct basic sentences, hold a short spoken answer, and recognise your own common mistakes.",
    hi: "फाउंडेशन पूरा हुआ। अब आप सही बुनियादी वाक्य बना सकते हैं, छोटा बोला गया उत्तर दे सकते हैं, और अपनी सामान्य गलतियों को पहचान सकते हैं।",
  },
  {
    day: 90,
    title: "Halfway",
    en: "You're halfway through the 180 days. You can now write a precis, hold an IELTS Part 2 answer, and read editorial-style English.",
    hi: "आप 180 दिनों के आधे रास्ते पर हैं। अब आप प्रीसिस लिख सकते हैं, IELTS पार्ट 2 का उत्तर दे सकते हैं, और एडिटोरियल अंग्रेज़ी पढ़ सकते हैं।",
  },
  {
    day: 120,
    title: "Building complete",
    en: "Building is done. You can now write a 250-word answer, discuss a topic in Part 3, and read without stopping at every hard word.",
    hi: "बिल्डिंग पूरी हुई। अब आप 250 शब्दों का उत्तर लिख सकते हैं, पार्ट 3 में किसी विषय पर चर्चा कर सकते हैं, और हर कठिन शब्द पर रुके बिना पढ़ सकते हैं।",
  },
  {
    day: 150,
    title: "150 days",
    en: "You can now sit a full IELTS mock, read a GMAT-style passage under time, and write a UPSC Mains answer within its word limit.",
    hi: "अब आप पूरा IELTS मॉक दे सकते हैं, समय-सीमा में GMAT जैसा पैराग्राफ पढ़ सकते हैं, और UPSC मेन्स उत्तर शब्द-सीमा में लिख सकते हैं।",
  },
  {
    day: 180,
    title: "180 days — finished",
    en: "You finished the plan. You can now write a full 1000-1200 word essay, handle GMAT Sentence Correction, and speak for 2 minutes without falling apart. Compare that to Day 1.",
    hi: "आपने योजना पूरी कर ली। अब आप पूरा 1000-1200 शब्दों का निबंध लिख सकते हैं, GMAT सेंटेंस करेक्शन संभाल सकते हैं, और 2 मिनट बिना रुके बोल सकते हैं। दिन 1 से इसकी तुलना करें।",
  },
];

export function getNewlyReachedMilestone(streak: number, alreadySeen: number[]): Milestone | null {
  const milestone = MILESTONES.find((m) => m.day === streak);
  if (!milestone) return null;
  if (alreadySeen.includes(milestone.day)) return null;
  return milestone;
}

// How many days in a row, immediately before today, were NOT completed.
// 0 means yesterday was completed (or today is Day 1, so there's no
// "before" to check).
export function countMissedDaysBeforeToday(
  records: DailyProgress[],
  todayDate: string,
  todayDayNumber: number,
): number {
  if (todayDayNumber <= 1) return 0;

  const byDate = new Map(records.map((r) => [r.date, r]));
  let missed = 0;
  let cursorDate = addDays(todayDate, -1);
  let cursorDayNumber = todayDayNumber - 1;

  while (cursorDayNumber >= 1) {
    const rec = byDate.get(cursorDate);
    if (rec?.completedAt) break;
    missed++;
    cursorDate = addDays(cursorDate, -1);
    cursorDayNumber--;
  }
  return missed;
}

const COMEBACK_MESSAGES: { en: string; hi: string }[] = [
  {
    en: "You missed a day. That happens. Today, just do the first task — nothing else matters right now.",
    hi: "एक दिन छूट गया। ऐसा होता है। आज सिर्फ पहला काम करें — बाकी कुछ ज़रूरी नहीं अभी।",
  },
  {
    en: "A missed day doesn't erase the days before it. Pick the plan back up today, right where it is.",
    hi: "एक छूटा दिन पहले के दिनों को मिटाता नहीं। आज से योजना फिर से वहीं से शुरू करें।",
  },
  {
    en: "No guilt needed. Open today's task, do it, and the streak starts counting again from here.",
    hi: "कोई अफसोस ज़रूरी नहीं। आज का काम खोलें, करें, और आज से फिर गिनती शुरू।",
  },
];

export function getComebackMessage(missedDays: number): { en: string; hi: string } {
  return COMEBACK_MESSAGES[missedDays % COMEBACK_MESSAGES.length];
}

// "One thing I did well today" for the end-of-day card. No real scores
// exist yet (that needs the Grammar/Writing/Speaking modules), so this
// picks an honest, specific line based on which step was hardest to
// finish today, highest-effort first.
const DONE_WELL_NOTES: Record<StepKey, { en: string; hi: string }> = {
  speaking: {
    en: "You finished today's Speaking task. Speaking out loud is the step most learners put off — you didn't.",
    hi: "आपने आज का स्पीकिंग टास्क पूरा किया। बोलना वह कदम है जिसे ज़्यादातर लोग टालते हैं — आपने नहीं टाला।",
  },
  writing: {
    en: "You finished today's Writing task. Getting words onto the page is the hardest part — you did it.",
    hi: "आपने आज का राइटिंग टास्क पूरा किया। शब्दों को कागज़ पर लाना सबसे कठिन हिस्सा है — आपने कर दिया।",
  },
  reading: {
    en: "You finished today's Reading task, questions and summary included. That's real, active reading, not skimming.",
    hi: "आपने आज का रीडिंग टास्क, सवाल और सारांश के साथ, पूरा किया। यह सच में पढ़ना है, सरसरी नज़र नहीं।",
  },
  grammar: {
    en: "You finished today's Grammar practice. Every exercise you got right or wrong today is one rule that's now a little more automatic.",
    hi: "आपने आज का ग्रामर अभ्यास पूरा किया। आज सही या गलत हर सवाल, एक नियम को थोड़ा और अपने आप आने वाला बनाता है।",
  },
  vocabulary: {
    en: "You learned today's new words. Vocabulary compounds — today's words make tomorrow's reading a little easier.",
    hi: "आपने आज के नए शब्द सीखे। शब्द-भंडार जुड़ता जाता है — आज के शब्द कल की पढ़ाई को थोड़ा आसान बनाएंगे।",
  },
  watch: {
    en: "You watched today's video and wrote down what you learned. That note is worth more than the video itself.",
    hi: "आपने आज का वीडियो देखा और जो सीखा वह लिखा। वह नोट वीडियो से भी ज़्यादा काम का है।",
  },
  warmup: {
    en: "You did today's warm-up — reviewing old mistakes is less exciting than new material, and you did it anyway.",
    hi: "आपने आज का वार्म-अप किया — पुरानी गलतियाँ दोहराना नए काम जैसा दिलचस्प नहीं होता, फिर भी आपने किया।",
  },
  extra: {
    en: "You did today's extra task. That's work most people on this plan would have skipped.",
    hi: "आपने आज का एक्स्ट्रा टास्क किया। यह वह काम है जिसे ज़्यादातर लोग छोड़ देते।",
  },
  endOfDay: {
    en: "You showed up today, start to finish.",
    hi: "आप आज शुरू से आखिर तक टिके रहे।",
  },
};

const DONE_WELL_PRIORITY: StepKey[] = [
  "speaking",
  "writing",
  "reading",
  "grammar",
  "vocabulary",
  "watch",
  "warmup",
  "extra",
];

export function getDoneWellNote(progress: DailyProgress): { en: string; hi: string } {
  const fieldByStep: Record<StepKey, keyof DailyProgress> = {
    warmup: "warmupDone",
    watch: "watchDone",
    grammar: "grammarDone",
    reading: "readingDone",
    vocabulary: "vocabularyDone",
    writing: "writingDone",
    speaking: "speakingDone",
    extra: "extraDone",
    endOfDay: "endOfDayDone",
  };

  for (const step of DONE_WELL_PRIORITY) {
    if (progress[fieldByStep[step]]) return DONE_WELL_NOTES[step];
  }
  return DONE_WELL_NOTES.endOfDay;
}

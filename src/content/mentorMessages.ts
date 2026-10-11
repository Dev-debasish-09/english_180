import type { StageId } from "../db/types";

export interface MentorMessage {
  en: string;
  hi: string;
}

// Hand-written messages for specific days — mostly stage transitions and
// round numbers, where it's worth saying something that day only.
const UNIQUE_MESSAGES: Record<number, MentorMessage> = {
  1: {
    en: "Day 1: Welcome. The plan is simple — show up, do the steps in order, don't skip. Everything else follows from that.",
    hi: "दिन 1: स्वागत है। योजना सीधी है — आएं, कदम क्रम में पूरे करें, कोई कदम न छोड़ें। बाकी सब इससे ही बनता है।",
  },
  7: {
    en: "Day 7: One full week. This is usually where people decide if a habit sticks. Yours just did.",
    hi: "दिन 7: पूरा एक हफ्ता। आम तौर पर यहीं तय होता है कि आदत बनेगी या नहीं। आपकी बन गई।",
  },
  14: {
    en: "Day 14: Two weeks in. You've probably repeated the same Odia-pattern mistake more than once — that is exactly how you stop making it.",
    hi: "दिन 14: दो हफ्ते हो गए। आपने शायद वही ओड़िया-पैटर्न गलती एक से ज़्यादा बार की होगी — यही तरीका है उसे रोकने का।",
  },
  21: {
    en: "Day 21: Three weeks. This is close to where a routine stops needing willpower. Notice if it's getting easier to start each day.",
    hi: "दिन 21: तीन हफ्ते। यहीं से आदत को ज़्यादा जोर लगाने की ज़रूरत कम होने लगती है। देखें, क्या हर दिन शुरू करना आसान हो रहा है।",
  },
  30: {
    en: "Day 30: One sixth of the plan done. Go back and read your Day 1 writing — don't judge it, just notice what's different now.",
    hi: "दिन 30: योजना का छठा हिस्सा पूरा। दिन 1 की अपनी लेखनी फिर से पढ़ें — आलोचना न करें, बस देखें अब क्या अलग है।",
  },
  45: {
    en: "Day 45: Three quarters through Foundation. The next stage asks more of you — you're ready for more.",
    hi: "दिन 45: फाउंडेशन का तीन-चौथाई हिस्सा पूरा। अगला चरण आपसे ज़्यादा मांगेगा — आप उसके लिए तैयार हैं।",
  },
  60: {
    en: "Day 60: Foundation is finished. Everything from here uses what you just built — tenses, articles, sentence structure. It wasn't wasted time.",
    hi: "दिन 60: फाउंडेशन खत्म। अब से जो भी होगा, वह आपकी बनाई नींव पर ही चलेगा — टेंस, आर्टिकल, वाक्य संरचना। यह समय बेकार नहीं गया।",
  },
  61: {
    en: "Day 61: Welcome to Building. English-only resources from here — your ear has earned it over the last 60 days.",
    hi: "दिन 61: बिल्डिंग चरण में आपका स्वागत है। अब से संसाधन सिर्फ अंग्रेज़ी में — पिछले 60 दिनों ने आपके कान को इसके लिए तैयार किया है।",
  },
  67: {
    en: "Day 67: One week into Building. Harder material, same habit. That's the only adjustment needed.",
    hi: "दिन 67: बिल्डिंग चरण का एक हफ्ता। सामग्री कठिन है, पर आदत वही है। बस यही बदलाव काफी है।",
  },
  80: {
    en: "Day 80: Two thirds of Building done. Precis and IELTS Part 2 should feel a little less foreign than they did on Day 61.",
    hi: "दिन 80: बिल्डिंग का दो-तिहाई हिस्सा पूरा। प्रीसिस और IELTS पार्ट 2 अब दिन 61 जितना अजनबी नहीं लगना चाहिए।",
  },
  100: {
    en: "Day 100: Triple digits. Look back at how far the words, the writing, and the speaking have come since Day 1 — not since yesterday.",
    hi: "दिन 100: तीन अंकों में। देखें शब्द, लेखन और बोलना दिन 1 से कितना आगे आ गए हैं — कल से नहीं, दिन 1 से।",
  },
  110: {
    en: "Day 110: Ten days from the exam stage. Keep the middle-of-the-plan grind going a little longer.",
    hi: "दिन 110: एग्ज़ाम चरण से दस दिन दूर। योजना के बीच की यह मेहनत थोड़ी और जारी रखें।",
  },
  120: {
    en: "Day 120: Building is done. GMAT, IELTS mocks, and UPSC Mains answers are next — and you've already done the groundwork for all three.",
    hi: "दिन 120: बिल्डिंग पूरी हुई। अब GMAT, IELTS मॉक और UPSC मेन्स उत्तर बाकी हैं — और तीनों की नींव आप पहले ही रख चुके हैं।",
  },
  121: {
    en: "Day 121: Welcome to the exam stage. Everything now is about performing what you know under real conditions and real limits.",
    hi: "दिन 121: एग्ज़ाम चरण में आपका स्वागत है। अब बात है जो आप जानते हैं उसे असली समय-सीमा में दिखाने की।",
  },
  127: {
    en: "Day 127: One week into exam-level work. Timed essays and full mocks get less intimidating with repetition, not with time passing.",
    hi: "दिन 127: एग्ज़ाम-स्तर के काम का एक हफ्ता। समय-सीमा वाले निबंध और पूरे मॉक दोहराने से आसान लगते हैं, सिर्फ समय बीतने से नहीं।",
  },
  140: {
    en: "Day 140: Just over halfway through the exam stage. Keep comparing your work to the model answers — that's where the real correction happens.",
    hi: "दिन 140: एग्ज़ाम चरण का आधे से थोड़ा ज़्यादा हिस्सा पूरा। अपने काम को मॉडल उत्तर से मिलाते रहें — असली सुधार वहीं होता है।",
  },
  160: {
    en: "Day 160: Twenty days left. Close enough to see the finish line, far enough that it still needs full effort.",
    hi: "दिन 160: बीस दिन बाकी। अंत दिखने लगा है, पर अभी भी पूरी मेहनत ज़रूरी है।",
  },
  170: {
    en: "Day 170: Ten days left. Whatever band, score, or score-out-of-10 you're at right now, it is higher than Day 1 and Day 61 and Day 121.",
    hi: "दिन 170: दस दिन बाकी। आज जो भी बैंड या स्कोर है, वह दिन 1, दिन 61 और दिन 121 से बेहतर ही है।",
  },
  180: {
    en: "Day 180: You finished. 180 days ago this felt far away. Read your Day 1 writing one more time, then decide what's next.",
    hi: "दिन 180: आपने पूरा कर लिया। 180 दिन पहले यह दूर लगता था। अपनी दिन 1 की लेखनी एक बार फिर पढ़ें, फिर तय करें अगला कदम।",
  },
};

const FOUNDATION_TEMPLATES: MentorMessage[] = [
  {
    en: "Day {day}: You showed up again. That is the whole game right now — just showing up.",
    hi: "दिन {day}: आप फिर आए। अभी बस यही सबसे ज़रूरी है — आना।",
  },
  {
    en: "Day {day}: Grammar feels slow today. That is normal — the rules are still new to your ear.",
    hi: "दिन {day}: आज ग्रामर धीमी लग रही है। यह सामान्य है — नियम अभी आपके कान के लिए नए हैं।",
  },
  {
    en: "Day {day}: You don't need to feel confident yet. You need to keep doing the steps in order.",
    hi: "दिन {day}: अभी आत्मविश्वास महसूस करना ज़रूरी नहीं। कदम क्रम में करते रहना ज़रूरी है।",
  },
  {
    en: "Day {day}: Mistakes today are tomorrow's error-bank practice. Keep making them — by trying, not by guessing.",
    hi: "दिन {day}: आज की गलतियाँ कल के एरर-बैंक अभ्यास हैं। कोशिश करके गलती करें, अनुमान लगाकर नहीं।",
  },
  {
    en: "Day {day}: Small steps every day beat a big effort once a week. You're doing the slow, correct thing.",
    hi: "दिन {day}: हर दिन का छोटा कदम हफ्ते में एक बड़ी कोशिश से बेहतर है। आप धीमा पर सही तरीका अपना रहे हैं।",
  },
  {
    en: "Day {day}: Your English ear is adjusting. You may not notice it, but it is happening.",
    hi: "दिन {day}: आपका कान अंग्रेज़ी के लिए ढल रहा है। शायद दिखे नहीं, पर हो रहा है।",
  },
  {
    en: "Day {day}: Articles and prepositions will feel strange for a while. Odia doesn't work this way — that's why, not because you're bad at this.",
    hi: "दिन {day}: आर्टिकल और प्रिपोज़िशन कुछ समय अजीब लगेंगे। ओड़िया में ऐसा नहीं होता — यही कारण है, आपकी कमी नहीं।",
  },
  {
    en: "Day {day}: One more day of basics. The exam-level work later gets easier because of days exactly like this one.",
    hi: "दिन {day}: बुनियाद का एक और दिन। आगे का एग्ज़ाम-स्तर का काम ऐसे ही दिनों की वजह से आसान होगा।",
  },
  {
    en: "Day {day}: If today's words felt easy, that's good — it means yesterday's practice worked.",
    hi: "दिन {day}: अगर आज के शब्द आसान लगे, तो अच्छा है — मतलब कल का अभ्यास काम कर गया।",
  },
  {
    en: "Day {day}: Keep your sentences short and correct, not long and wrong. Simple English done right beats fancy English done wrong.",
    hi: "दिन {day}: वाक्य छोटे और सही रखें, लंबे और गलत नहीं। सही सरल अंग्रेज़ी, गलत भारी अंग्रेज़ी से बेहतर है।",
  },
  {
    en: "Day {day}: You're building the habit most people never build. Don't stop now.",
    hi: "दिन {day}: आप वह आदत बना रहे हैं जो ज़्यादातर लोग कभी नहीं बनाते। अभी न रुकें।",
  },
  {
    en: "Day {day}: No empty praise today — just this: you're still here, and that's what matters at this stage.",
    hi: "दिन {day}: आज कोई खाली तारीफ नहीं — सिर्फ यह: आप अब भी यहाँ हैं, और इस चरण में बस यही मतलब रखता है।",
  },
];

const BUILDING_TEMPLATES: MentorMessage[] = [
  {
    en: "Day {day}: This is the hardest part of the plan — the middle, where progress feels invisible. It isn't invisible, it's just slow to see.",
    hi: "दिन {day}: यह योजना का सबसे कठिन हिस्सा है — बीच का हिस्सा, जहाँ तरक्की दिखती नहीं। दिखती नहीं, पर हो रही है, बस धीरे।",
  },
  {
    en: "Day {day}: IELTS-style tasks are harder than Foundation ones on purpose. You're ready for harder, even if it doesn't feel that way.",
    hi: "दिन {day}: IELTS जैसे काम जानबूझकर फाउंडेशन से कठिन हैं। आप कठिन के लिए तैयार हैं, भले ऐसा न लगे।",
  },
  {
    en: "Day {day}: Precis writing forces you to understand before you can shorten. That skill carries straight into UPSC answers.",
    hi: "दिन {day}: प्रीसिस लिखने के लिए पहले समझना पड़ता है, फिर छोटा करना। यह हुनर सीधे UPSC उत्तरों में काम आता है।",
  },
  {
    en: "Day {day}: If Part 2 cue cards still feel awkward, that's expected — two minutes of speaking is a real skill, not a given.",
    hi: "दिन {day}: अगर पार्ट 2 क्यू कार्ड अब भी अजीब लगते हैं, यह सामान्य है — दो मिनट बोलना एक वास्तविक हुनर है, आसान नहीं।",
  },
  {
    en: "Day {day}: You've passed the beginner stage. Most people stop here because the fast wins are gone. Don't stop.",
    hi: "दिन {day}: आप शुरुआती चरण पार कर चुके हैं। यहीं ज़्यादातर लोग रुक जाते हैं क्योंकि तेज़ जीत खत्म हो जाती है। आप न रुकें।",
  },
  {
    en: "Day {day}: Editorial English is denser than what you read before. Reading it slowly today is still reading it.",
    hi: "दिन {day}: एडिटोरियल की अंग्रेज़ी पहले से घनी है। आज इसे धीरे पढ़ना भी पढ़ना ही है।",
  },
  {
    en: "Day {day}: Clauses and connectors are the difference between short sentences and real arguments. Keep practicing them.",
    hi: "दिन {day}: क्लॉज़ और कनेक्टर्स ही छोटे वाक्यों और असली तर्क के बीच का फर्क हैं। इनका अभ्यास जारी रखें।",
  },
  {
    en: "Day {day}: You're past the halfway point of the Building stage. The GMAT-level work ahead will use everything you're doing now.",
    hi: "दिन {day}: आप बिल्डिंग चरण के आधे से आगे हैं। आगे का GMAT-स्तर का काम अभी के सब काम का उपयोग करेगा।",
  },
  {
    en: "Day {day}: Direct and indirect speech trips up most Odia speakers in the same few spots. You're working through exactly those spots.",
    hi: "दिन {day}: डायरेक्ट और इनडायरेक्ट स्पीच ज़्यादातर ओड़िया भाषियों को उन्हीं जगहों पर उलझाती है। आप वही जगहें सुधार रहे हैं।",
  },
  {
    en: "Day {day}: No one feels fluent in the middle of learning. Feeling behind right now does not mean you are behind.",
    hi: "दिन {day}: सीखने के बीच में कोई भी धाराप्रवाह महसूस नहीं करता। अभी पीछे महसूस करना, पीछे होना नहीं है।",
  },
  {
    en: "Day {day}: Keep showing this habit to your harder self at Day 121 — they'll need it more than you do today.",
    hi: "दिन {day}: यह आदत दिन 121 वाले अपने आप को दिखाते रहें — उन्हें इसकी ज़रूरत आज से भी ज़्यादा होगी।",
  },
  {
    en: "Day {day}: 250 words is not a small task. Doing it daily, even badly, is how it stops being hard.",
    hi: "दिन {day}: 250 शब्द छोटा काम नहीं है। हर दिन करना, भले खराब ही हो, इसे आसान बनाने का तरीका है।",
  },
];

const EXAM_TEMPLATES: MentorMessage[] = [
  {
    en: "Day {day}: This is exam-level work now — GMAT words, UPSC answers, full IELTS mocks. You earned the right to find this hard.",
    hi: "दिन {day}: अब यह एग्ज़ाम-स्तर का काम है — GMAT शब्द, UPSC उत्तर, पूरे IELTS मॉक। इसे कठिन पाने का हक आपने कमाया है।",
  },
  {
    en: "Day {day}: A timed essay is stressful the first few times. By Day 180 it will just be Tuesday.",
    hi: "दिन {day}: समय-सीमा वाला निबंध पहली कुछ बार तनाव देता है। दिन 180 तक यह सामान्य दिन जैसा लगेगा।",
  },
  {
    en: "Day {day}: GMAT Sentence Correction rewards the grammar you built on Day 1. It's the same rules, just tested meaner.",
    hi: "दिन {day}: GMAT सेंटेंस करेक्शन वही ग्रामर मांगता है जो आपने दिन 1 पर बनाई थी — नियम वही हैं, बस परीक्षा कठिन है।",
  },
  {
    en: "Day {day}: Full IELTS mocks are supposed to feel long. That's the actual exam length — you're training for the real thing.",
    hi: "दिन {day}: पूरे IELTS मॉक लंबे लगने ही चाहिए। यह असली परीक्षा की लंबाई है — आप असली परीक्षा के लिए तैयार हो रहे हैं।",
  },
  {
    en: "Day {day}: You are closer to UPSC Mains-level writing than Day-1-you would believe.",
    hi: "दिन {day}: आप UPSC मेन्स-स्तर के लेखन के उतने करीब हैं जितना दिन 1 वाला आप मान भी न पाता।",
  },
  {
    en: "Day {day}: If today's passage felt dense, that's the GMAT Reading Comprehension level doing its job. Read it twice.",
    hi: "दिन {day}: अगर आज का पैराग्राफ घना लगा, यही GMAT रीडिंग कॉम्प्रिहेंशन का स्तर है। इसे दो बार पढ़ें।",
  },
  {
    en: "Day {day}: Exam-stage vocabulary is abstract on purpose. Use the root, not just the memory trick, when a word feels unfamiliar.",
    hi: "दिन {day}: एग्ज़ाम-स्तर के शब्द जानबूझकर अमूर्त हैं। अनजान शब्द पर रूट (मूल) देखें, सिर्फ याद रखने की तरकीब नहीं।",
  },
  {
    en: "Day {day}: You don't need to feel ready for the real exam today. You need today's mock, today's essay, today's words.",
    hi: "दिन {day}: आज असली परीक्षा के लिए तैयार महसूस करना ज़रूरी नहीं। आज का मॉक, आज का निबंध, आज के शब्द ज़रूरी हैं।",
  },
  {
    en: "Day {day}: Confidence comes from repetition, not from a sudden feeling of readiness. Today is one more repetition.",
    hi: "दिन {day}: आत्मविश्वास दोहराव से आता है, अचानक तैयार महसूस होने से नहीं। आज एक और दोहराव है।",
  },
  {
    en: "Day {day}: However today's essay or mock went, it is one data point, not a verdict. Fix what the self-check shows, and move on.",
    hi: "दिन {day}: आज का निबंध या मॉक जैसा भी रहा, यह एक आंकड़ा है, फैसला नहीं। सेल्फ-चेक में जो दिखे उसे सुधारें और आगे बढ़ें।",
  },
  {
    en: "Day {day}: Most of the hard grammar and vocabulary work is behind you. What's left is mostly practice under exam conditions.",
    hi: "दिन {day}: ज़्यादातर कठिन ग्रामर और शब्द-भंडार का काम पीछे छूट गया है। बाकी ज़्यादातर एग्ज़ाम जैसी स्थिति में अभ्यास है।",
  },
  {
    en: "Day {day}: You are in the last stretch. The habit that got you here is the same habit that finishes this.",
    hi: "दिन {day}: आप आखिरी हिस्से में हैं। जो आदत आपको यहाँ लाई, वही आदत इसे पूरा भी करेगी।",
  },
];

function fillTemplate(template: MentorMessage, day: number): MentorMessage {
  return {
    en: template.en.replace(/\{day\}/g, String(day)),
    hi: template.hi.replace(/\{day\}/g, String(day)),
  };
}

const TEMPLATES_BY_STAGE: Record<StageId, MentorMessage[]> = {
  foundation: FOUNDATION_TEMPLATES,
  building: BUILDING_TEMPLATES,
  exam: EXAM_TEMPLATES,
};

// One message per day (1-180). A hand-written set covers the key
// transition/round-number days; the rest cycle through a stage-specific
// pool of hand-written templates with the day number filled in, so every
// day still gets its own distinct line.
export function getMentorMessage(day: number, stage: StageId): MentorMessage {
  const unique = UNIQUE_MESSAGES[day];
  if (unique) return unique;

  const templates = TEMPLATES_BY_STAGE[stage];
  return fillTemplate(templates[day % templates.length], day);
}

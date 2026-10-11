interface GuideSection {
  title: string;
  english: string;
  hindi: string;
}

const SECTIONS: GuideSection[] = [
  {
    title: "How to watch a lesson video",
    english:
      "Watch the video once, all the way through, without pausing. Watch it a second time and pause after each rule. Write the rule in your notebook. Then make 3 of your own sentences using the rule.",
    hindi:
      "वीडियो को पहले बिना रोके, पूरा देखें। फिर दोबारा देखें और हर नियम के बाद रुकें। नियम को अपनी नोटबुक में लिखें। अब उस नियम का उपयोग करके अपने 3 वाक्य बनाएं।",
  },
  {
    title: "How to read an editorial",
    english:
      "Read it once just for the meaning — don't stop for hard words. Read it a second time and underline the new words. Then write a summary in your own words, without looking at the article.",
    hindi:
      "पहले सिर्फ अर्थ समझने के लिए पढ़ें — कठिन शब्दों पर न रुकें। फिर दोबारा पढ़ें और नए शब्दों को रेखांकित करें। अब लेख को देखे बिना, अपने शब्दों में एक सारांश लिखें।",
  },
  {
    title: "How to do shadowing",
    english:
      "Play a short clip and listen once. Play a few seconds, pause, and say the same words out loud — copy the speed and the sound, not just the words. Then play it again and try speaking at the same time as the speaker.",
    hindi:
      "एक छोटा क्लिप एक बार सुनें। कुछ सेकंड चलाएं, रोकें, और वही शब्द बोलें — गति और आवाज़ की नकल करें, सिर्फ शब्दों की नहीं। फिर इसे फिर से चलाएं और बोलने वाले के साथ-साथ बोलने की कोशिश करें।",
  },
  {
    title: "How to use the dictionary and YouGlish for a new word",
    english:
      "Look up the word in a dictionary (like Cambridge Dictionary) to get its simple meaning and part of speech. Then search the same word on YouGlish to hear real people say it in many different videos.",
    hindi:
      "किसी शब्दकोश (जैसे Cambridge Dictionary) में शब्द को खोजें और उसका सरल अर्थ व प्रकार जानें। फिर वही शब्द YouGlish पर खोजें ताकि आप असली लोगों को उसे कई अलग-अलग वीडियो में बोलते हुए सुन सकें।",
  },
];

export function GuidePage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <h2 className="text-lg font-bold">How to Study</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Short notes on how to do each kind of task well. These also show up the first time that
        task type appears in your daily mission.
      </p>

      {SECTIONS.map((section) => (
        <section
          key={section.title}
          className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <h3 className="mb-2 font-bold">{section.title}</h3>
          <p className="text-sm">{section.english}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{section.hindi}</p>
        </section>
      ))}
    </div>
  );
}

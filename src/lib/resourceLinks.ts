import type { StageId } from "../db/types";

// "Open article" always opens the reading site for the user's stage -
// a fixed homepage/section link, never a specific (and breakable) article
// URL. The full resources.json (Phase 5) will make this editable.
export const READING_SITE_BY_STAGE: Record<StageId, { name: string; url: string }> = {
  foundation: { name: "VOA Learning English", url: "https://learningenglish.voanews.com/" },
  building: { name: "The Hindu Editorials", url: "https://www.thehindu.com/opinion/editorial/" },
  exam: { name: "Aeon", url: "https://aeon.co/" },
};

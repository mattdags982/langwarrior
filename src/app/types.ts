export type Blurb = {
  id: string;
  characterName: string;
  contentEnglish: string;
  translations: {
    blurbId: string;
    languageCode: string;
    translatedContent: string;
  }[];
};

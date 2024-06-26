import { converToDate } from "./liturgy";
import { currentVersion } from "../config/global";
import { BlockType } from "../types";

export const createDefaultAnnouncementsBlock = () => ({
  type: "announcements",
  title: "",
  data: {
    items: [{ title: "", detail: "" }],
  },
});

export const createDefaultReadingBlock = ({ title = "" } = {}) => ({
  type: "reading",
  title,
  data: {
    bibleRefs: [
      {
        id: "",
        excerpt: "",
      },
    ],
  },
});

export const createDefaultSermonBlock = () => ({
  type: "sermon",
  title: "",
  data: {
    title: "",
    author: "",
    bibleRefs: [{ id: "" }],
    plan: [{ text: "" }],
  },
});

export const createDefaultOpenDoorsBlock = () => ({
  type: "openDoors",
  title: "",
  data: {
    title: "",
    detail: "",
    prayerTopics: [{ text: "" }],
  },
});

export const createDefaultSectionBlock = ({ title = "" } = {}) => ({
  type: "section",
  title: "",
  data: {
    title,
  },
});

export const createDefaultSongsBlock = () => ({
  type: "songs",
  title: "",
  data: {
    items: [],
  },
});

export const createDefaultRecitationBlock = () => ({
  type: "recitation",
  title: "",
  data: {
    id: "",
    infos: "",
  },
});

const functions = {
  announcements: createDefaultAnnouncementsBlock,
  reading: createDefaultReadingBlock,
  sermon: createDefaultSermonBlock,
  openDoors: createDefaultOpenDoorsBlock,
  section: createDefaultSectionBlock,
  songs: createDefaultSongsBlock,
  recitation: createDefaultRecitationBlock,
} as const;

export const createDefaultBlock = <T extends BlockType>(
  type: T,
  ...args: Parameters<(typeof functions)[T]>
) => {
  return functions[type](...args);
};

export const createDefaultLiturgy = (id: string) => ({
  date: +converToDate(id),
  version: currentVersion,
  blocks: [
    createDefaultAnnouncementsBlock(),
    createDefaultReadingBlock({ title: "Ouverture" }),
    createDefaultReadingBlock({ title: "Loi de Dieu" }),
    createDefaultReadingBlock({ title: "Grâce de Dieu" }),
    createDefaultReadingBlock({ title: "Inter-chants" }),
    createDefaultSermonBlock(),
    createDefaultSectionBlock({ title: "Sainte cène" }),
    createDefaultOpenDoorsBlock(),
    createDefaultReadingBlock({ title: "Envoi" }),
  ],
});

import uuid from "uuid/v4";

export default ({ date }) => ({
  date: +date,
  blocks: [
    {
      id: uuid(),
      type: "announcements",
      data: [{ title: "", detail: "" }]
    },
    {
      id: uuid(),
      type: "reading",
      data: {
        title: "Ouverture",
        bibleRefs: [{ ref: "", excerpt: "" }]
      }
    },
    {
      id: uuid(),
      type: "songs",
      data: []
    },
    {
      id: uuid(),
      type: "reading",
      data: {
        title: "Loi de Dieu",
        bibleRefs: [{ ref: "", excerpt: "" }]
      }
    },
    {
      id: uuid(),
      type: "songs",
      data: []
    },
    {
      id: uuid(),
      type: "reading",
      data: {
        title: "Grâce de Dieu",
        bibleRefs: [{ ref: "", excerpt: "" }]
      }
    },
    {
      id: uuid(),
      type: "songs",
      data: []
    },
    {
      id: uuid(),
      type: "reading",
      data: {
        title: "Lecture inter-chants",
        bibleRefs: [{ ref: "", excerpt: "" }]
      }
    },
    {
      id: uuid(),
      type: "songs",
      data: []
    },
    {
      id: uuid(),
      type: "sermon",
      data: {
        author: "",
        bibleRefs: [""],
        title: "",
        plan: [""]
      }
    },
    {
      id: uuid(),
      type: "songs",
      data: []
    },
    {
      id: uuid(),
      type: "section",
      data: {
        title: "Sainte cène",
        bibleRefs: [{ ref: "", excerpt: "" }]
      }
    },
    {
      id: uuid(),
      type: "songs",
      data: []
    },
    {
      id: uuid(),
      type: "reading",
      data: {
        title: "Envoi",
        bibleRefs: [{ ref: "", excerpt: "" }]
      }
    }
  ]
});

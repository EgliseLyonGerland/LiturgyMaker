import uuid from "uuid/v4";

export default ({ date }) => ({
  date: +date,
  version: 2,
  blocks: [
    {
      id: uuid(),
      type: "announcements",
      title: "Annonces",
      data: [{ title: "", detail: "" }]
    },
    {
      id: uuid(),
      type: "reading",
      title: "Ouverture",
      data: {
        bibleRefs: [{ ref: "", excerpt: "" }]
      }
    },
    {
      id: uuid(),
      type: "songs",
      title: "Chants",
      data: []
    },
    {
      id: uuid(),
      type: "reading",
      title: "Loi de Dieu",
      data: {
        bibleRefs: [{ ref: "", excerpt: "" }]
      }
    },
    {
      id: uuid(),
      type: "songs",
      title: "Chants",
      data: []
    },
    {
      id: uuid(),
      type: "reading",
      title: "Grâce de Dieu",
      data: {
        bibleRefs: [{ ref: "", excerpt: "" }]
      }
    },
    {
      id: uuid(),
      type: "songs",
      title: "Chants",
      data: []
    },
    {
      id: uuid(),
      type: "reading",
      title: "Lecture inter-chants",
      data: {
        bibleRefs: [{ ref: "", excerpt: "" }]
      }
    },
    {
      id: uuid(),
      type: "songs",
      title: "Chants",
      data: []
    },
    {
      id: uuid(),
      type: "sermon",
      title: "Prédication",
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
      title: "Chants",
      data: []
    },
    {
      id: uuid(),
      type: "section",
      title: null,
      data: {
        title: "Sainte cène"
      }
    },
    {
      id: uuid(),
      type: "songs",
      title: "Chants",
      data: []
    },
    {
      id: uuid(),
      type: "reading",
      title: "Envoi",
      data: {
        bibleRefs: [{ ref: "", excerpt: "" }]
      }
    }
  ]
});

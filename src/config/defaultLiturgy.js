import uuid from "uuid/v4";

export default () => ({
  blocks: [
    {
      id: uuid(),
      type: "announcements",
      data: []
    },
    {
      id: uuid(),
      type: "reading",
      data: {
        title: "Ouverture"
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
        title: "Loi de Dieu"
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
        title: "Grâce de Dieu"
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
        title: "Lecture inter-chants"
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
      data: {}
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
        title: "Sainte cène"
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
        title: "Envois"
      }
    }
  ]
});

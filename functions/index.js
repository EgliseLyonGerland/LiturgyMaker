const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const { format, toDate } = require("date-fns");
const locale = require("date-fns/locale/fr");
const deepDiff = require("deep-diff");

admin.initializeApp();

function formatDate(date) {
  if (date.getDate() === 1) {
    return format(date, "EEEE '1er' MMMM", { locale });
  }

  return format(date, "EEEE d MMMM", { locale });
}

exports.notifyChanges = functions.firestore
  .document("liturgies/{liturgyId}")
  .onWrite(async change => {
    const created = !change.before.exists;
    const data = change.after.data();
    const date = toDate(data.date);
    const formattedDate = formatDate(date);
    const { gmail } = functions.config();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "egliselyongerland@gmail.com",
        pass: gmail.pass
      }
    });

    const from = "Eglise Lyon Gerland <egliselyongerland@gmail.com>";

    const to = [
      "alexsarran@gmail.com",
      "blumdenis@aol.com",
      "nicolas@bazille.fr"
    ].join(", ");

    let subject;
    if (created) {
      subject = `Les informations sur le culte du ${formattedDate} on été ajoutées`;
    } else {
      subject = `Des informations sur le culte du ${formattedDate} on été modifées`;
    }

    let diff;
    if (!created) {
      diff = deepDiff(change.before.data(), data);
      diff = JSON.stringify(diff, null, "  ");
    }

    const html = [
      `Bonjour,`,
      ``,
      `${subject}.`,
      ``,
      `Rendez vous sur culte.egliselyongerland.org pour visualiser les informations.`,
      ``,
      ...(diff
        ? [
            `Vous trouverez ci-dessous le rapport des changements effectués :`,
            `<pre>${diff}</pre>`,
            ``
          ]
        : []),
      ``,
      `Cordialement,`,
      `Église Lyon Gerland`
    ].join("<br />");

    await transporter.sendMail({ from, to, subject, html });
    console.log("Mail sent");
  });

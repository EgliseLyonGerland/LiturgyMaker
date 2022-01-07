import { format, toDate } from 'date-fns';
import locale from 'date-fns/locale/fr';
import { diff as deepDiff } from 'deep-diff';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { createTransport } from 'nodemailer';

admin.initializeApp();

const { gmail } = functions.config();

function formatDate(date: Date) {
  if (date.getDate() === 1) {
    return format(date, "'1er' MMMM y", { locale });
  }

  return format(date, 'd MMMM y', { locale });
}

export const notifyChanges = functions
  .region('europe-west1')
  .firestore.document('liturgies/{liturgyId}')
  .onWrite(async (change) => {
    const created = !change.before.exists;
    const data = change.after.data();

    if (!data) {
      console.log('No data');
      return;
    }

    const date = toDate(data.date);
    const formattedDate = formatDate(date);
    const { uid } = data;
    const db = admin.firestore();

    const user = (await db.collection('users').doc(uid).get()).data();

    if (!user) {
      console.log(`User ${uid} not found`);
      return;
    }

    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: 'egliselyongerland@gmail.com',
        pass: gmail.pass,
      },
    });

    const from =
      'Église Lyon Gerland - Présidence <egliselyongerland@gmail.com>';
    const to = 'culte@egliselyongerland.org';

    let subject = `Présidence du ${formattedDate}`;
    if (!created) {
      subject = `Re: ${subject}`;
    }

    let diff;
    if (!created) {
      diff = deepDiff(change.before.data(), data);
      diff = JSON.stringify(diff, null, '  ');
    }

    let verb = 'modifier';
    if (created) {
      verb = 'créer';
    }

    const html = [
      `Bonjour,`,
      ``,
      `${user.displayName} vient de ${verb} les informations sur le culte du ${formattedDate}.`,
      ``,
      `Rendez vous sur culte.egliselyongerland.org pour visualiser les informations.`,
      ``,
      ...(diff
        ? [
            `Vous trouverez ci-dessous le rapport des changements effectués :`,
            `<pre>${diff}</pre>`,
            ``,
          ]
        : []),
      ``,
      `Cordialement,`,
      `Église Lyon Gerland`,
    ].join('<br />');

    await transporter.sendMail({ from, to, subject, html });
    console.log('Mail sent');
  });

export default null;

/**
 *
 * This class constructs an email that can be sent with the send() method
 * The class uses Mailjet to send emails
 * 
 *
 */

const mailjet = require('node-mailjet');
const validator = require('email-validator');

class Mail {

  constructor(API_KEY_PUBLIC, API_KEY_PRIVATE, from, to, subject, body) {
    this.from = from;
    this.to = to;
    this.subject = subject;
    this.body = body;

    this.API_VERSION = 'v3.1';
    this.API_KEY_PUBLIC = API_KEY_PUBLIC;
    this.API_KEY_PRIVATE = API_KEY_PRIVATE;

    this.mailjet = mailjet
      .connect(this.API_KEY_PUBLIC, this.API_KEY_PRIVATE);
  }

  send() {
    /* Support tests to this point */
    if (process.env.NODE_ENV === 'testing') return new Promise(
      resolve => resolve(JSON.stringify({ result: 'succesful' }))
    );
    if (!this.isMailValid()) return new Error('Mailer error, please check \'Mail\' contructor');
    return (
      this.mailjet
        .post('send', {
          'version': this.API_VERSION
        })
        .request({
          'Messages': [{
            'From': {'Email': this.from},
            'To': [{'Email': this.to}],
            'Subject': this.subject,
            'TextPart': this.body,
            'HTMLPart': this.body,
          }]
        })
    );
  }

  isMailValid() {
    return (
      Boolean(this.API_KEY_PUBLIC) &&
      Boolean(this.API_KEY_PRIVATE) &&
      Boolean(this.mailjet) &&
      validator.validate(this.from) &&
      validator.validate(this.to)
    );
  }

}

module.exports = Mail;
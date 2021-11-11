import * as nodemailer from "nodemailer";
import { config } from "../../config/config";
import { paceLoggingService } from "../../utils/services/logger";

/**
 * Class responsible for sending emails
 * using nodemailder
 */
class EmailService {
  private static instance: EmailService;
  private transporter: nodemailer.Transporter;
  private emailCreds = config.email;
  private port = 587;
  private host = "smtp.ethereal.email";

  /**
   * Emailservice constructor
   * @private
   */
  private constructor() {
    this.transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: false, // true for 465, false for other ports
      service: "Gmail",
      auth: {
        user: this.emailCreds.user,
        pass: this.emailCreds.password,
      },
    });
  }

  /**
   * getInstance
   * @return {EmailService}
   */
  public static getInstance(): EmailService {
    if (EmailService.instance) {
      return EmailService.instance;
    }
    return (EmailService.instance = new EmailService());
  }

  /**
   * Send reset password link
   * @param {string} email
   * @param {string} link
   */
  public async sendPasswordResetLink(email: string, link: string) {
    try {
      const res = await this.transporter.sendMail({
        from: `"Pace" ${this.emailCreds.user}`, // sender address
        to: email, // list of receivers
        subject: `Pace - Reset password`, // Subject line
        html: `<p>Hello!. We have registered password reset request for your account.</p> <p>To do so, please click this link to reset your password:</p><a href=${link}>Reset password</a>`, // html body
      });
      paceLoggingService.info(`Sending confirmation email to user: ${email}. Message id: ${res.messageId}`, { link });
      return { success: true };
    } catch (err) {
      paceLoggingService.error("Error while sending confirmation email.", { error: err });
      return { error: "Something wennt wrong" };
    }
  }
}
export const emailService = EmailService.getInstance();

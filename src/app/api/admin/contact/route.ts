import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { firstName, email, phone, message } = await req.json();

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
  from: `"${firstName}" <${email}>`,
  to: process.env.CONTACT_RECEIVER_EMAIL,
  subject: `New Contact Form Submission from ${firstName}`,
  html: `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
    <!-- Container -->
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">

      <!-- Header -->
      <div style="background: linear-gradient(90deg, #e94e4e, #ff6b6b); color: white; padding: 25px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
      </div>

      <!-- Body -->
      <div style="padding: 25px; color: #333333; line-height: 1.6;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 15px;">
          <tr>
            <td style="padding: 12px; font-weight: bold; background-color: #f9f9f9; width: 120px;">Name</td>
            <td style="padding: 12px;">${firstName}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold; background-color: #f1f1f1;">Email</td>
            <td style="padding: 12px;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold; background-color: #f9f9f9;">Phone</td>
            <td style="padding: 12px;">${phone || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold; background-color: #f1f1f1;">Message</td>
            <td style="padding: 12px;">${message}</td>
          </tr>
        </table>

        <!-- Call-to-action buttons -->
        <div style="text-align: center; margin-top: 25px;">
          <a href="mailto:${email}" style="background-color: #e94e4e; color: white; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold; margin-right: 10px;">Reply</a>
          ${phone ? `<a href="tel:${phone}" style="background-color: #ff6b6b; color: white; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold;">Call</a>` : ''}
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #f1f3f6; padding: 20px; text-align: center; font-size: 12px; color: #888888;">
        <p style="margin: 0;">© ${new Date().getFullYear()} Dikshant IAS. All rights reserved.</p>
      </div>

    </div>
  </div>
  `,
};


    // Wrap await in try/catch to satisfy parser
    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error("Mail error:", mailError);
      return NextResponse.json(
        { success: false, error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}

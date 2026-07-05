import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { name, email, description } = await request.json();

    if (!name || !email || !description) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // 1. Insert into Supabase table contact_requests
    const { error: dbError } = await supabase
      .from('contact_requests')
      .insert({ name, email, description });

    if (dbError) {
      console.error('Database insertion error:', dbError);
      return NextResponse.json({ error: 'Failed to save request.' }, { status: 500 });
    }

    // 2. Send email using Nodemailer
    const emailUser = process.env.EMAIL_USER || 'ajancreativestudio@gmail.com';
    const emailPass = process.env.EMAIL_PASS; // Gmail App Password configured in Vercel env

    if (emailPass) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      const mailOptions = {
        from: `"AJ&AN Creative Studio" <${emailUser}>`,
        to: email,
        subject: 'Thank you for reaching out to AJ&AN Creative Studio!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <h2 style="color: #e31c1c;">Hello ${name},</h2>
            <p>Thank you for contacting <strong>AJ&AN Creative Studio</strong>! We have received your message and our crew will get back to you shortly.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 14px; color: #666;"><strong>Your inquiry summary:</strong></p>
            <blockquote style="border-left: 4px solid #e31c1c; padding-left: 15px; margin: 15px 0; color: #555; font-style: italic;">
              ${description.replace(/\n/g, '<br/>')}
            </blockquote>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 13px; color: #888;">
              Best regards,<br/>
              <strong>AJ&AN Creative Studio Crew</strong><br/>
              <a href="mailto:ajancreativestudio@gmail.com">ajancreativestudio@gmail.com</a>
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Confirmation email sent successfully to ${email}`);
    } else {
      console.log('EMAIL_PASS environment variable not set. Skipping real email dispatch.');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

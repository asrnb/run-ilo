import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'onboarding@resend.dev'
const ADMIN_EMAIL = 'aprilsuarnaba5@gmail.com'
const SITE = 'run.ilo'

export async function sendSubmissionConfirmation(to: string, raceName: string) {
  if (!process.env.RESEND_API_KEY) return
  await resend.emails.send({
    from: FROM,
    to,
    subject: `We received your race submission — ${raceName}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a">
        <p style="font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#f97057;margin-bottom:8px">${SITE}</p>
        <h1 style="font-size:24px;font-weight:700;margin:0 0 16px">Race submitted!</h1>
        <p style="color:#555;line-height:1.6">
          Thanks for submitting <strong>${raceName}</strong>. We'll review it and publish it shortly.
          You'll get another email once it goes live.
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="font-size:12px;color:#999">run.ilo — Iloilo City Race Directory</p>
      </div>
    `,
  })
}

export async function sendApprovalEmail(to: string, raceName: string, status: 'published' | 'rejected') {
  if (!process.env.RESEND_API_KEY) return
  const approved = status === 'published'
  await resend.emails.send({
    from: FROM,
    to,
    subject: approved
      ? `Your race is live — ${raceName}`
      : `Update on your submission — ${raceName}`,
    html: approved
      ? `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a">
          <p style="font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#f97057;margin-bottom:8px">${SITE}</p>
          <h1 style="font-size:24px;font-weight:700;margin:0 0 16px">Your race is live! 🎉</h1>
          <p style="color:#555;line-height:1.6">
            <strong>${raceName}</strong> has been approved and is now listed on run.ilo.
            Runners in Iloilo can now find and register for your race.
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
          <p style="font-size:12px;color:#999">run.ilo — Iloilo City Race Directory</p>
        </div>
      `
      : `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a">
          <p style="font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#f97057;margin-bottom:8px">${SITE}</p>
          <h1 style="font-size:24px;font-weight:700;margin:0 0 16px">Submission not approved</h1>
          <p style="color:#555;line-height:1.6">
            Unfortunately <strong>${raceName}</strong> wasn't approved at this time.
            If you think this is a mistake, reply to this email and we'll take another look.
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
          <p style="font-size:12px;color:#999">run.ilo — Iloilo City Race Directory</p>
        </div>
      `,
  })
}

export async function sendAdminNotification(raceName: string, organizerEmail: string) {
  if (!process.env.RESEND_API_KEY) return
  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New race submission: ${raceName}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a">
        <p style="font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#f97057;margin-bottom:8px">${SITE}</p>
        <h1 style="font-size:24px;font-weight:700;margin:0 0 16px">New submission</h1>
        <p style="color:#555;line-height:1.6">
          <strong>${raceName}</strong> was submitted by ${organizerEmail} and is waiting for review.
        </p>
        <a href="https://run-ilo.vercel.app/admin" style="display:inline-block;margin-top:16px;background:#f97057;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">
          Review in Admin →
        </a>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="font-size:12px;color:#999">run.ilo — Iloilo City Race Directory</p>
      </div>
    `,
  })
}

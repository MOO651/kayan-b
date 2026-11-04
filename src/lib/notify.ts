import "server-only";

/**
 * Email notifications via Resend (https://resend.com).
 * Set RESEND_API_KEY and NOTIFY_EMAIL in the environment to enable.
 * If either is missing, notifications are silently skipped — form
 * submissions still succeed; email is best-effort.
 */

type NotifyArgs = {
  subject: string;
  lines: string[];
};

export async function notifyNewRequest({ subject, lines }: NotifyArgs): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  try {
    const html = `
      <div style="font-family:sans-serif;direction:rtl;text-align:right;padding:24px">
        <h2 style="color:#b08d57">${subject}</h2>
        ${lines.map((l) => `<p style="margin:8px 0">${l}</p>`).join("")}
      </div>
    `;
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Makki Bashmeel <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    });
  } catch {
    // Best-effort: never block the form submission on email failure.
  }
}

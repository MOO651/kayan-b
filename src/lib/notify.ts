import "server-only";

type NotifyArgs = {
  subject: string;
  lines: string[];
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function notifyNewRequest({ subject, lines }: NotifyArgs): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  try {
    const html =
      '<div style="font-family:sans-serif;direction:rtl;text-align:right;padding:24px">' +
      '<h2 style="color:#b08d57">' + escapeHtml(subject) + '</h2>' +
      lines.map((line) => '<p style="margin:8px 0">' + escapeHtml(line) + '</p>').join("") +
      "</div>";
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Mekky & Bashmeil <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    });
    if (!response.ok) console.error("Email notification failed:", response.status);
  } catch {
    // Best-effort: never block the form submission on email failure.
  }
}

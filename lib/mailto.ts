interface MailtoOptions {
    to: string;
    subject?: string;
    body?: string;
}

// Builds a mailto: link that opens the visitor's own mail app with everything pre-filled.
// encodeURIComponent (not URLSearchParams) is used deliberately: mail clients expect
// spaces as %20 and line breaks as %0D%0A, and many show a literal "+" otherwise.
export function buildMailtoLink({ to, subject, body }: MailtoOptions): string {
    const params: string[] = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body.replace(/\r?\n/g, '\r\n'))}`);
    return `mailto:${to}${params.length ? `?${params.join('&')}` : ''}`;
}

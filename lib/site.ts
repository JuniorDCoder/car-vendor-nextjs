// Central brand configuration — change the business name/details here once.

// Inbox that receives website enquiries. Set NEXT_PUBLIC_CONTACT_EMAIL in Vercel
// (Project Settings → Environment Variables) and redeploy; otherwise the fallback is used.
// The variable must be referenced literally so Next.js can inline it for the browser.
const DEFAULT_CONTACT_EMAIL = 'premierautocenter@gmail.com';
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || DEFAULT_CONTACT_EMAIL;

export const siteConfig = {
    name: 'Premier Auto Centre',
    shortName: 'Premier Auto',
    tagline: 'Drive Your Dream, Today.',
    logo: '/logo.png',
    location: 'Durham',
    whatsappNumber: '447412800685',
    contactEmail,
};

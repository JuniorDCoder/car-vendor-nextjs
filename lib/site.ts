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
    // Hero background — swap for a photo of the client's own showroom (e.g. '/hero.jpg' in /public) any time.
    heroImage:
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2400&q=80',
    location: 'Durham',
    whatsappNumber: '447412800685',
    contactEmail,
};

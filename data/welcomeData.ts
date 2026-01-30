/**
 * Welcome Messages Data
 * Contains welcome messages from key conference organizers and stakeholders
 */

export interface WelcomeMessage {
    id: string;
    name: string;
    title: string;
    role: string;
    image: string;
    message: string;
}

export const welcomeMessages: ReadonlyArray<WelcomeMessage> = [
    {
        id: 'accpPresident',
        name: 'HAZEL FAYE R. DOCUYANAN, RPh, PhD',
        title: 'President, Asian Conference on Clinical Pharmacy 2025-2027 | Executive Vice President, Philippine Pharmacists Association',
        role: 'ACCP President',
        image: '/assets/img/all-images/team/hazel_docuyanan.jpg',
        message: `Welcome to the 2026 ACCP Conference, and welcome to Bangkok.
Our theme this year, "Borderless Pharmacy Practice: Collaboration for Sustainability and Cultural Integration," captures the very heart of what ACCP stands for—a professional community of advocates of clinical pharmacy that transcends borders to advance clinical pharmacy practice through shared knowledge, mutual respect, and collective innovation. Over the coming days, you will encounter new ideas, innovative practices, and inspiring stories that reflect not only advancements in clinical pharmacy, but also the rich cultural contexts that shape how care is delivered.

Thank you for being part of this journey. Let us move forward together—toward a truly borderless pharmacy practice. We wish you a productive, enriching, and memorable conference. Welcome to ACCP 2026.`
    },
    {
        id: 'host',
        name: 'Assoc. Prof. Dr. Wichai Santimaleeworagun',
        title: 'President, The College of Pharmacotherapy of Thailand',
        role: 'hostOrg',
        image: '/assets/img/all-images/team/wichai_santimaleeworagun.png',
        message: `Welcome to the 2026 Asian Conference on Clinical Pharmacy (ACCP 2026) in Bangkok, Thailand. Held under the theme "Borderless Pharmacy Practice: Collaboration for Sustainability and Cultural Integration," ACCP 2026 brings together science, collaboration, and culture in a truly international setting. The conference features a comprehensive scientific program in clinical pharmacy and pharmacotherapy.

Topics span diverse disease states, innovative practices, digital health, and pharmaceutical education. Participants will engage with high-quality research through poster and oral presentations. The meeting offers opportunities to connect with leading clinical pharmacy professionals worldwide. It also fosters academic and research collaborations shaping the future of pharmacy practice. ACCP 2026 serves as a global platform for learning, sharing, and professional networking. The experience is enriched by Bangkok's renowned warmth and hospitality. Attendees can enjoy Thailand's rich culture, iconic attractions, and world-famous cuisine. Join us at ACCP 2026 and be part of a borderless community advancing clinical pharmacy.`
    }
] as const;

/**
 * Helper function to get a welcome message by ID
 */
export const getWelcomeMessageById = (id: string): WelcomeMessage | undefined => {
    return welcomeMessages.find(message => message.id === id);
};

/**
 * Helper function to get all active welcome messages
 */
export const getActiveWelcomeMessages = (): ReadonlyArray<WelcomeMessage> => {
    return welcomeMessages;
};

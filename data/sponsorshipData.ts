export interface Sponsor {
    name: string;
    logo: string;
}

export interface SponsorCategory {
    id: 'universities' | 'pharmaceutical' | 'associations';
    titleKey: 'universitySponsors' | 'pharmaceuticalSponsors' | 'associationSponsors';
    sponsors: Sponsor[];
}

const SPONSORS_BASE = '/assets/img/sponsors';

function sponsorLogo(...pathSegments: string[]): string {
    return `${SPONSORS_BASE}/${pathSegments.map(encodeURIComponent).join('/')}`;
}

export const featuredSponsors: Sponsor[] = [
    {
        name: 'The Pharmacy Council of Thailand',
        logo: '/assets/img/sponsors/pharmacy-council.jpg',
    },
    {
        name: 'Royal College of Pharmacists of Thailand',
        logo: '/assets/img/sponsors/royal-college.jpg',
    },
    {
        name: 'College of Pharmacists of Thailand',
        logo: '/assets/img/sponsors/college-pharmacy.png',
    },
];

export const sponsorCategories: SponsorCategory[] = [
    {
        id: 'universities',
        titleKey: 'universitySponsors',
        sponsors: [
            {
                name: 'Faculty of Pharmaceutical Sciences, Prince of Songkla University',
                logo: sponsorLogo('logo_university', 'คณะเภสัชศาสตร์ มหาวิทยาลัยสงขลานครินทร์.jpg'),
            },
            {
                name: 'Faculty of Pharmaceutical Sciences, Siam University',
                logo: sponsorLogo('logo_university', 'คณะเภสัชศาสตร์ มหาวิทยาลัยสยาม.png'),
            },
            {
                name: 'Faculty of Pharmaceutical Sciences, Ubon Ratchathani University',
                logo: sponsorLogo('logo_university', 'คณะเภสัชศาสตร์ มหาวิทยาลัยอุบลราชธานี.png'),
            },
            {
                name: 'Faculty of Pharmacy, Silpakorn University',
                logo: sponsorLogo('logo_university', 'คณะเภสัชศาสตร์ ศิลปากร.png'),
            },
            {
                name: 'College of Pharmacy, Rangsit University',
                logo: sponsorLogo('logo_university', 'วิทยาลัยเภสัชศาสตร์ มหาวิทยาลัยรังสิต_0.png'),
            },
            {
                name: 'Faculty of Pharmaceutical Sciences, Chulalongkorn University',
                logo: sponsorLogo('logo_university', 'สำเนาของ Pharm Chula logo new ENG.png'),
            },
        ],
    },
    {
        id: 'pharmaceutical',
        titleKey: 'pharmaceuticalSponsors',
        sponsors: [
            {
                name: 'Abbott',
                logo: sponsorLogo('logo_pharmaceutical company', 'ABBOTT_FIXED_SIGNATURE_LOGO_RGB.png'),
            },
            {
                name: 'Able Medical',
                logo: sponsorLogo('logo_pharmaceutical company', 'Able Medical.jpg'),
            },
            {
                name: 'Siam Pharmaceutical',
                logo: sponsorLogo('logo_pharmaceutical company', 'Logo_siam_pharmaceutical.png'),
            },
            {
                name: 'Marubeni Pharmaceuticals',
                logo: sponsorLogo('logo_pharmaceutical company', 'Marubeni_Pharmaceuticals_logo_eng.jpg'),
            },
            {
                name: 'Novartis',
                logo: sponsorLogo('logo_pharmaceutical company', 'Novatis_Logo Warm Black RGB.jpeg'),
            },
            {
                name: 'Viatris',
                logo: sponsorLogo('logo_pharmaceutical company', 'OUS_Viatris_Logo_Horiz_CMYK.jpg'),
            },
            {
                name: 'Pfizer',
                logo: sponsorLogo('logo_pharmaceutical company', 'Pfizer_Logo (002).jpg'),
            },
            {
                name: 'Suntory',
                logo: sponsorLogo('logo_pharmaceutical company', 'Suntory_20250303_LOGO suntory.jpg'),
            },
            {
                name: 'Official Equipment Manufacturing Co., Ltd.',
                logo: sponsorLogo('logo_pharmaceutical company', 'บริษัท ออฟฟิเชียล อีควิปเม้นท์ แมนูแฟคเจอริ่ง จำกัด .png'),
            },
            {
                name: 'Innobic',
                logo: sponsorLogo('logo_pharmaceutical company', 'สำเนาของ Innobic_Cmyk_Innobic-Logo-Final_cen tagline-01.png'),
            },
            {
                name: 'Ultramedica Co., Ltd.',
                logo: sponsorLogo('logo_pharmaceutical company', 'อัลตร้าเมดิคา จำกัด_Vismax.jpg'),
            },
        ],
    },
    {
        id: 'associations',
        titleKey: 'associationSponsors',
        sponsors: [
            {
                name: 'APOPA',
                logo: sponsorLogo('Logo_association', 'APOPA_LOGO_V2.png'),
            },
            {
                name: 'Professor Kasem Pangsiriwong Foundation',
                logo: sponsorLogo('Logo_association', 'มูลนิธิอาจารย์เกษม ปังศรีวงศ์.png'),
            },
            {
                name: 'Hospital Pharmacy Association of Thailand',
                logo: sponsorLogo('Logo_association', 'สมาคมเภสัชกรรมโรงพยาบาล.png'),
            },
        ],
    },
];

export const sponsorLogos: Sponsor[] = [
    ...featuredSponsors,
    ...sponsorCategories.flatMap((category) => category.sponsors),
];

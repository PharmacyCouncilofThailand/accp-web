export interface PlenarySpeaker {
    id: number;
    name: string;
    image: string;
    positions: string[];
    sessions: {
        role: 'Speaker' | 'Moderator';
        title: string;
        day: string;
        date: string;
        time: string;
    }[];
}

export const plenarySpeakers: PlenarySpeaker[] = [
    {
        id: 1,
        name: 'Dr.HAZEL FAYE R. DOCUYANAN',
        image: '/assets/img/speaker/1.jpg',
        positions: [
            'President, Asian Conference on Clinical Pharmacy 2025-2027',
            'Executive Vice President, Philippine Pharmacists Association',
            'Founding President, Philippine Society of Pharmacist Vaccinators',
        ],
        sessions: [
            { role: 'Speaker', title: 'Opening Ceremony', day: 'Day 2', date: '10 July 2026', time: '8.30 - 10.00' },
            { role: 'Speaker', title: 'Plenary session 3', day: 'Day 3', date: '11 July 2026', time: '13.45 - 15.00' },
        ],
    },
    {
        id: 2,
        name: 'Assoc.Prof.Lita Chew',
        image: '/assets/img/speaker/2.jpg',
        positions: [
            'Group Chief Pharmacist, Singhealth',
            'Director, Allied Health & Pharmacy, National Cancer Centre Singapore',
            'Associate Professor, Department of Pharmacy and Pharmaceutical Science, National University of Singapore',
            'Associate Professor, Duke-NUS Global Health Institute',
        ],
        sessions: [
            { role: 'Speaker', title: 'Plenary session 1', day: 'Day 2', date: '10 July 2026', time: '10.10 - 11.30' },
            { role: 'Speaker', title: 'Plenary session 2', day: 'Day 3', date: '11 July 2026', time: '12.30 - 13.30' },
        ],
    },
    {
        id: 3,
        name: 'Professor Stuart T. Haines',
        image: '/assets/img/speaker/3.jpg',
        positions: [
            'Director of the Division of Pharmacy Professional Development at the University of Mississippi School of Pharmacy and Chief Education',
            'Editor-in-Chief of the Journal of the American College of Clinical Pharmacy (JACCP)',
        ],
        sessions: [
            { role: 'Speaker', title: 'Plenary session 1', day: 'Day 2', date: '10 July 2026', time: '10.10 - 11.30' },
        ],
    },
    {
        id: 4,
        name: 'Professor Alan Lau',
        image: '/assets/img/speaker/4.jpg',
        positions: [
            'Professor of Pharmacy Practice and Director of International Clinical Pharmacy Education at the University of Illinois Chicago (UIC) Retzky College of Pharmacy',
        ],
        sessions: [
            { role: 'Speaker', title: 'Plenary session 2', day: 'Day 3', date: '11 July 2026', time: '12.30 - 13.30' },
            { role: 'Speaker', title: 'Plenary session 3', day: 'Day 3', date: '11 July 2026', time: '13.45 - 15.00' },
        ],
    },
    {
        id: 5,
        name: 'Dr.Helen Zhang',
        image: '/assets/img/speaker/5.jpg',
        positions: [
            'Past Chair, Asian Conference on Clinical Pharmacy (ACCP)',
            'Director of Center of Clinical Research Office in Beijing United Family Hospital',
        ],
        sessions: [
            { role: 'Speaker', title: 'Session 6.1', day: 'Day 3', date: '11 July 2026', time: '10.10 - 11.40' },
            { role: 'Speaker', title: 'Plenary session 3', day: 'Day 3', date: '11 July 2026', time: '13.45 - 15.00' },
        ],
    },
    {
        id: 6,
        name: 'Assoc Prof. Nguyen Thi Thu Phuong',
        image: '/assets/img/speaker/6.jpg',
        positions: [
            'Director, Clinical Trial and Bioequivalence Center Hai Phong University of Medicine and Pharmacy, Vietnam',
            'Dean, Faculty of Pharmacy Hai Phong University of Medicine and Pharmacy, Vietnam',
            'Head, Pharmacy Department Hai Phong International Hospital, Vietnam',
        ],
        sessions: [
            { role: 'Speaker', title: 'Session 6.2', day: 'Day 3', date: '11 July 2026', time: '10.10 - 11.40' },
        ],
    },
    {
        id: 7,
        name: 'Dr.Tat Ming NG',
        image: '/assets/img/speaker/7.jpg',
        positions: [
            'Principle Pharmacist (specialist) Tan Tock Seng Hospital, NHG Health, Singapore',
        ],
        sessions: [
            { role: 'Speaker', title: 'Session 6.1', day: 'Day 3', date: '11 July 2026', time: '10.10 - 11.40' },
        ],
    },
    {
        id: 8,
        name: 'Professor Anne Lin',
        image: '/assets/img/speaker/8.jpg',
        positions: [
            "Chin Ling & Sallie Wang Endowed Dean and Professor at the College of Pharmacy & Health Sciences at St. John's University",
        ],
        sessions: [
            { role: 'Speaker', title: 'Plenary session 1', day: 'Day 2', date: '10 July 2026', time: '10.10 - 11.30' },
        ],
    },
    {
        id: 9,
        name: 'Professor Vivian Lee',
        image: '/assets/img/speaker/9.jpg',
        positions: [
            'Associate Professor, Center for Learning Enhancement And Research (CLEAR)',
        ],
        sessions: [
            { role: 'Moderator', title: 'Session 3', day: 'Day 2', date: '10 July 2026', time: '14.45 - 16.15' },
        ],
    },
    {
        id: 10,
        name: 'Professor Kim Benner',
        image: '/assets/img/speaker/10.jpg',
        positions: [
            "Professor at the Samford University McWhorter School of Pharmacy and a Pediatric Clinical Specialist at Children's of Alabama in Birmingham",
            'President-elect, American Society of Health-Systems Pharmacists',
        ],
        sessions: [
            { role: 'Speaker', title: 'Plenary session 1', day: 'Day 2', date: '10 July 2026', time: '10.10 - 11.30' },
            { role: 'Moderator', title: 'Session: Collaboration', day: 'Day 2', date: '10 July 2026', time: '14.45 - 16.15' },
        ],
    },
    {
        id: 11,
        name: 'Assoc. Prof. Surakit Nathisuwan',
        image: '/assets/img/speaker/11.jpg',
        positions: [
            'Dean of Faculty of Pharmacy, Mahidol University',
        ],
        sessions: [
            { role: 'Speaker', title: 'Plenary session 2', day: 'Day 3', date: '11 July 2026', time: '12.30 - 13.30' },
            { role: 'Speaker', title: 'Plenary session 3', day: 'Day 3', date: '11 July 2026', time: '13.45 - 15.00' },
        ],
    },
    {
        id: 12,
        name: 'Assoc. Prof. Preecha Montakantikul',
        image: '/assets/img/speaker/12.jpg',
        positions: [
            'Faculty of Pharmacy, Mahidol University, Thailand',
            'Vice Chair of the Committee on Pharmaceutical Education, Pharmacy Council of Thailand',
        ],
        sessions: [
            { role: 'Speaker', title: 'Session 3.1', day: 'Day 2', date: '10 July 2026', time: '14.45 - 16.15' },
        ],
    },
];

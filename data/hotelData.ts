export interface RoomType {
    name: string;
    price: string;
}

export interface Hotel {
    name: string;
    stars?: number;
    type: string;
    section: 'conference' | 'partner' | 'nearby';
    distance: string;
    priceRange: string;
    features: string[];
    image: string;
    bookingLink: string;
    special: boolean;
    phone?: string;
    roomTypes?: RoomType[];
    notes?: string[];
}

export const hotels: Hotel[] = [
    {
        name: "Centara Grand & Bangkok Convention Centre at CentralWorld",
        stars: 5,
        type: "Official Conference Hotel",
        section: "conference",
        distance: "0 min (venue)",
        priceRange: "THB 4,500 - 6,500/night",
        features: ["Direct access to venue", "Breakfast included", "Free WiFi", "Fitness center", "Sky bar"],
        image: "/assets/img/hotels-and-rates/partner-hotels/centara-grand.png",
        bookingLink: "#",
        special: true
    },
    {
        name: "Bangkok City Inn",
        stars: 3,
        type: "Partner Hotel",
        section: "partner",
        distance: "300 m",
        priceRange: "THB 1,200 - 1,300/night",
        features: ["Breakfast Buffet 280 THB", "Non-Smoking"],
        image: "/assets/img/hotels-and-rates/partner-hotels/bangkok-city-inn.jpg",
        bookingLink: "#",
        special: false,
        phone: "022535373",
        roomTypes: [
            { name: "Standard Room Twin Bed", price: "1,250.00" },
            { name: "Standard Room King Bed", price: "1,300.00" }
        ],
        notes: ["Buffet Breakfasts — Style: Buffet, 280.00 ฿"]
    },
    {
        name: "Sovereign Group Hotel",
        stars: 3,
        type: "Partner Hotel",
        section: "partner",
        distance: "370 m",
        priceRange: "THB 1,300 - 2,000/night",
        features: ["Breakfast not included", "Non-Smoking"],
        image: "/assets/img/hotels-and-rates/partner-hotels/sovereign-group-hotel.jpg",
        bookingLink: "#",
        special: false,
        phone: "0646504142",
        roomTypes: [
            { name: "Superior Queen Corner", price: "1,600.00" },
            { name: "Deluxe King Room", price: "2,000.00" }
        ],
        notes: ["No-Breakfast"]
    },
    {
        name: "Marwin Space Hotel",
        stars: 3,
        type: "Partner Hotel",
        section: "partner",
        distance: "470 m",
        priceRange: "THB 1,300 - 2,250/night",
        features: ["Breakfast not included", "Non-Smoking"],
        image: "/assets/img/hotels-and-rates/partner-hotels/marwin-space-hotel.jpg",
        bookingLink: "#",
        special: false,
        phone: "0954455982",
        roomTypes: [
            { name: "Superior Room", price: "1,350 - 1,550" },
            { name: "Deluxe Room", price: "1,550 - 1,750" }
        ],
        notes: ["No Breakfast", "Floor: 2-3"]
    },
    {
        name: "Golden House",
        stars: 3,
        type: "Partner Hotel",
        section: "partner",
        distance: "470 m",
        priceRange: "THB 1,300 - 1,800/night",
        features: ["Breakfast not included", "Non-Smoking"],
        image: "/assets/img/hotels-and-rates/partner-hotels/golden-house.jpg",
        bookingLink: "#",
        special: false,
        phone: "022529535",
        roomTypes: [
            { name: "Golden Grand Deluxe King", price: "1,319.00" },
            { name: "Golden Grand Deluxe Twin", price: "1,438.00" }
        ],
        notes: ["No Breakfast", "No Parking"]
    },
    {
        name: "Leela Orchid Hotel",
        stars: 3,
        type: "Partner Hotel",
        section: "partner",
        distance: "510 m",
        priceRange: "THB 1,300 - 1,500/night",
        features: ["Breakfast not included", "Non-Smoking"],
        image: "/assets/img/hotels-and-rates/partner-hotels/leela-orchid-hotel.jpg",
        bookingLink: "#",
        special: false,
        phone: "022549438",
        roomTypes: [
            { name: "Standard Double with Window", price: "1,395.00" },
            { name: "Deluxe Twin Room without Window", price: "1,409.00" }
        ],
        notes: ["No-Breakfast"]
    },
    {
        name: "Ascella Pratunam Hotel",
        stars: 3,
        type: "Partner Hotel",
        section: "partner",
        distance: "530 m",
        priceRange: "THB 1,300 - 1,600/night",
        features: ["Breakfast not included", "Non-Smoking"],
        image: "/assets/img/hotels-and-rates/partner-hotels/ascella-pratunam-hotel.jpg",
        bookingLink: "#",
        special: false,
        phone: "0893663615",
        roomTypes: [
            { name: "Deluxe Double Room", price: "1,301.00" },
            { name: "Deluxe Triple Room", price: "1,692.00" }
        ],
        notes: ["No-Breakfast"]
    },
    {
        name: "First House Bangkok Hotel",
        stars: 3,
        type: "Partner Hotel",
        section: "partner",
        distance: "600 m",
        priceRange: "THB 2,300 - 3,000/night",
        features: ["Breakfast not included"],
        image: "/assets/img/hotels-and-rates/partner-hotels/first-house-bangkok-hotel.jpg",
        bookingLink: "#",
        special: false,
        phone: "0612495999",
        roomTypes: [
            { name: "Superior Double No Window Room Only", price: "2,337.00" },
            { name: "Superior Double No Window Room with Breakfast", price: "2,983.00" }
        ],
        notes: ["No Parking"]
    },
    {
        name: "Siam Kempinski Hotel Bangkok",
        stars: 5,
        type: "Partner Hotel",
        section: "nearby",
        distance: "600 m",
        priceRange: "THB 9,600/night",
        features: ["Breakfast not included"],
        image: "/assets/img/hotels-and-rates/nearby-hotels/siam-kempinski-bangkok.jpg",
        bookingLink: "#",
        special: false
    },
    {
        name: "Intercontinental Bangkok",
        stars: 5,
        type: "Partner Hotel",
        section: "nearby",
        distance: "700 m",
        priceRange: "THB 9,777/night",
        features: ["Breakfast Included"],
        image: "/assets/img/hotels-and-rates/nearby-hotels/intercontinental-bangkok-exterior_1.jpg",
        bookingLink: "#",
        special: false
    },
    {
        name: "Arnoma Grand Bangkok",
        stars: 4,
        type: "Partner Hotel",
        section: "nearby",
        distance: "850 m",
        priceRange: "THB 3,302/night",
        features: ["Breakfast Included"],
        image: "/assets/img/hotels-and-rates/nearby-hotels/arnoma-grand-bangkok.jpg",
        bookingLink: "#",
        special: false
    },
    {
        name: "Holiday Inn Bangkok",
        stars: 4,
        type: "Partner Hotel",
        section: "nearby",
        distance: "900 m",
        priceRange: "THB 3,946/night",
        features: ["Breakfast Included"],
        image: "/assets/img/hotels-and-rates/nearby-hotels/holiday-inn-bangkok.jpg",
        bookingLink: "#",
        special: false
    },
    {
        name: "Grand Hyatt Erawan Bangkok",
        stars: 5,
        type: "Partner Hotel",
        section: "nearby",
        distance: "1.1 Km",
        priceRange: "THB 7,600/night",
        features: ["Breakfast Included"],
        image: "/assets/img/hotels-and-rates/nearby-hotels/grand-hyatt-erawan-bangkok.webp",
        bookingLink: "#",
        special: false
    },
    {
        name: "Novotel Bangkok on Siam Square",
        stars: 4,
        type: "Partner Hotel",
        section: "nearby",
        distance: "1.2 Km",
        priceRange: "THB 3,938/night",
        features: ["Breakfast Included"],
        image: "/assets/img/hotels-and-rates/nearby-hotels/novotel-bangkok-on-siam-square.jpg",
        bookingLink: "#",
        special: false
    },
    {
        name: "Grande Centre Point Ratchadamri Bangkok",
        stars: 5,
        type: "Partner Hotel",
        section: "nearby",
        distance: "1.4 Km",
        priceRange: "THB 4,692/night",
        features: ["Breakfast Included"],
        image: "/assets/img/hotels-and-rates/nearby-hotels/grande-centre-point-ratchadamri-bangkok.jpg",
        bookingLink: "#",
        special: false
    },
    {
        name: "Moxy Bangkok Ratchaprasong",
        stars: 4,
        type: "Partner Hotel",
        section: "nearby",
        distance: "1.4 Km",
        priceRange: "THB 5,885/night",
        features: ["Breakfast Included"],
        image: "/assets/img/hotels-and-rates/nearby-hotels/moxy-bangkok-ratchaprasong.jpg",
        bookingLink: "#",
        special: false
    },
    {
        name: "Aphrodite Inn Bangkok",
        stars: 3,
        type: "Partner Hotel",
        section: "nearby",
        distance: "1.5 Km",
        priceRange: "THB 2,480/night",
        features: ["Breakfast Included"],
        image: "/assets/img/hotels-and-rates/nearby-hotels/aphrodite-inn-bangkok.jpg",
        bookingLink: "#",
        special: false
    },
    {
        name: "Renaissance Bangkok Ratchaprasong Hotel",
        stars: 5,
        type: "Partner Hotel",
        section: "nearby",
        distance: "2.0 Km",
        priceRange: "THB 7,297/night",
        features: ["Breakfast Included"],
        image: "/assets/img/hotels-and-rates/nearby-hotels/renaissance-bangkok-ratchaprasong-hotel.jpg",
        bookingLink: "#",
        special: false
    }
]

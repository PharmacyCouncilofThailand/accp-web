import { memo } from 'react'

interface HotelProps {
    name: string;
    distance: string;
    features: string[];
    image?: string;
}

// Extract styles to constants to avoid recreating objects on each render
const HOTEL_IMAGE_STYLE = {
    backgroundColor: '#e0e0e0',
    borderRadius: '12px',
    height: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999'
} as const;

const ICON_STYLE = { fontSize: '48px' } as const;
const LOCATION_ICON_STYLE = { marginRight: '8px', color: '#FFBA00' } as const;
const CHECK_ICON_STYLE = { marginRight: '5px', color: '#10B981', fontSize: '10px' } as const;

const FEATURE_BADGE_STYLE = {
    backgroundColor: '#f0f0f0',
    padding: '5px 12px',
    borderRadius: '15px',
    fontSize: '12px',
    color: '#555'
} as const;

const CARD_STYLE = {
    padding: 0,
    overflow: 'hidden',
    border: '3px solid #FFBA00'
} as const;

const ROW_STYLE = { padding: '25px' } as const;
const CONTAINER_STYLE = { marginBottom: '30px' } as const;
const TITLE_STYLE = { marginBottom: '10px', color: '#1a237e' } as const;
const LOCATION_STYLE = { margin: '0 0 15px 0', color: '#666', fontSize: '14px' } as const;
const FEATURES_CONTAINER_STYLE = { display: 'flex', flexWrap: 'wrap', gap: '8px' } as const;

function HotelCard({ hotel }: { hotel: HotelProps }) {
    return (
        <div className="row" style={CONTAINER_STYLE} data-aos="fade-up" data-aos-duration={800}>
            <div className="col-12">
                <div className="pricing-boxarea" style={CARD_STYLE}>
                    <div className="row align-items-center" style={ROW_STYLE}>
                        <div className="col-md-3">
                            <div style={HOTEL_IMAGE_STYLE}>
                                {hotel.image ? (
                                    <img 
                                        src={hotel.image} 
                                        alt={hotel.name} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} 
                                    />
                                ) : (
                                    <i className="fa-solid fa-hotel" style={ICON_STYLE} />
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h4 style={TITLE_STYLE}>{hotel.name}</h4>
                            <p style={LOCATION_STYLE}>
                                <i className="fa-solid fa-location-dot" style={LOCATION_ICON_STYLE} />
                                {hotel.distance} from venue
                            </p>
                            <div style={FEATURES_CONTAINER_STYLE}>
                                {hotel.features.map((feature, fi) => (
                                    <span key={fi} style={FEATURE_BADGE_STYLE}>
                                        <i className="fa-solid fa-check" style={CHECK_ICON_STYLE} />
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Memoize component to prevent unnecessary re-renders
export default memo(HotelCard)

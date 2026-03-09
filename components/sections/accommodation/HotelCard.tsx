import { memo } from 'react'
import type { Hotel } from '@/data/hotelData'

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

const CARD_STYLE = {
    padding: 0,
    overflow: 'hidden',
    border: '3px solid #FFBA00'
} as const;

const ROW_STYLE = { padding: '25px' } as const;
const CONTAINER_STYLE = { marginBottom: '30px' } as const;
const TITLE_STYLE = { marginBottom: '10px', color: '#1a237e' } as const;
const LABEL_STYLE = { minWidth: '180px', fontSize: '15px', color: '#555' } as const;
const VALUE_STYLE = { fontWeight: 600, color: '#333' } as const;
const VALUE_PRICE_STYLE = { fontWeight: 600, color: '#1a237e' } as const;
const ROOM_TYPE_STYLE = {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '10px 14px',
    marginBottom: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
} as const;
const ROOM_NAME_STYLE = { color: '#555' } as const;
const ROOM_PRICE_STYLE = { fontWeight: 600, color: '#1a237e', whiteSpace: 'nowrap' as const } as const;
const PHONE_STYLE = { color: '#FFBA00', fontWeight: 600, textDecoration: 'none' } as const;
const NOTE_STYLE = { fontSize: '13px', color: '#777', marginBottom: '2px' } as const;
const BADGE_STYLE = {
    display: 'inline-block',
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 500,
    marginRight: '6px',
    marginBottom: '4px'
} as const;

function HotelCard({ hotel }: { hotel: Hotel }) {
    const isConference = hotel.section === 'conference';
    const hasRoomTypes = hotel.roomTypes && hotel.roomTypes.length > 0;

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
                        <div className="col-md-9">
                            <h4 style={TITLE_STYLE}>
                                {hotel.name}
                            </h4>

                            {!isConference && (
                                <div className="mt-3">
                                    {/* Distance */}
                                    <div className="d-flex align-items-center mb-2">
                                        <span style={LABEL_STYLE}>Distance to venue:</span>
                                        <span style={VALUE_STYLE}>{hotel.distance}</span>
                                    </div>

                                    {/* Room types - detailed view */}
                                    {hasRoomTypes ? (
                                        <div className="mb-3">
                                            <span style={{ ...LABEL_STYLE, display: 'block', marginBottom: '8px' }}>Room Types:</span>
                                            {hotel.roomTypes!.map((room, idx) => (
                                                <div key={idx} style={ROOM_TYPE_STYLE}>
                                                    <span style={ROOM_NAME_STYLE}>{room.name}</span>
                                                    <span style={ROOM_PRICE_STYLE}>{room.price} ฿/night</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="d-flex align-items-center mb-2">
                                            <span style={LABEL_STYLE}>Room per night (THB):</span>
                                            <span style={VALUE_PRICE_STYLE}>{hotel.priceRange?.replace('THB ', '').replace('/night', '')}</span>
                                        </div>
                                    )}

                                    {/* Breakfast */}
                                    <div className="d-flex align-items-center mb-2">
                                        <span style={LABEL_STYLE}>Breakfast:</span>
                                        <span style={VALUE_STYLE}>
                                            {hotel.notes?.find(n => n.toLowerCase().includes('breakfast'))
                                                || hotel.features.find(f => f.toLowerCase().includes('breakfast'))
                                                || 'Included'}
                                        </span>
                                    </div>

                                    {/* Non-Smoking badge */}
                                    {hotel.features.includes('Non-Smoking') && (
                                        <div className="mb-2">
                                            <span style={BADGE_STYLE}>🚭 Non-Smoking</span>
                                        </div>
                                    )}

                                    {/* Extra notes */}
                                    {hotel.notes?.filter(n => !n.toLowerCase().includes('breakfast')).map((note, idx) => (
                                        <div key={idx} style={NOTE_STYLE}>
                                            <i className="fa-solid fa-circle-info" style={{ marginRight: '6px', color: '#aaa' }} />
                                            {note}
                                        </div>
                                    ))}

                                    {/* Phone */}
                                    {hotel.phone && (
                                        <div className="d-flex align-items-center mt-2">
                                            <span style={LABEL_STYLE}>
                                                <i className="fa-solid fa-phone" style={{ marginRight: '6px', color: '#FFBA00' }} />
                                                TEL:
                                            </span>
                                            <a href={`tel:${hotel.phone}`} style={PHONE_STYLE}>{hotel.phone}</a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

// Memoize component to prevent unnecessary re-renders
export default memo(HotelCard)

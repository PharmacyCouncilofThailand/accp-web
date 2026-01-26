'use client'
import React from 'react'

interface PaymentMethodCardProps {
  id: string
  title: string
  description: string
  icon: string
  isSelected: boolean
  onSelect: (id: string) => void
  processingTime?: string
}

export default function PaymentMethodCard({
  id,
  title,
  description,
  icon,
  isSelected,
  onSelect,
  processingTime
}: PaymentMethodCardProps) {
  const isFontAwesome = icon.includes('fa-');

  return (
    <div
      onClick={() => onSelect(id)}
      className="payment-method-card-interactive" // Hook for potential global CSS or just distinct class
      style={{
        width: '100%',
        minHeight: '180px',
        height: '100%',
        padding: '24px 20px',
        border: isSelected ? '2px solid #00C853' : '1px solid #e0e0e0',
        borderRadius: '16px',
        cursor: 'pointer',
        backgroundColor: isSelected ? '#f5fcf8' : '#fff',
        textAlign: 'center',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        boxShadow: isSelected 
          ? '0 10px 25px -5px rgba(0, 200, 83, 0.15), 0 8px 10px -6px rgba(0, 200, 83, 0.1)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: isSelected ? 'translateY(-2px)' : 'none'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = '#b9e6ca';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = '#e0e0e0';
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
        }
      }}
    >
      {/* Selection Checkmark */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        border: isSelected ? 'none' : '2px solid #ddd',
        backgroundColor: isSelected ? '#00C853' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease'
      }}>
        {isSelected && <i className="fa-solid fa-check" style={{ color: '#fff', fontSize: '12px' }} />}
      </div>

      {/* Content Wrapper */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: '100%',
        marginBottom: '16px',
        marginTop: '8px'
      }}>
        {/* Icon */}
        <div style={{
          fontSize: '32px',
          marginBottom: '16px',
          color: isSelected ? '#00C853' : '#64748b',
          transition: 'color 0.2s ease',
          height: '40px',
          display: 'flex',
          alignItems: 'center'
        }}>
          {isFontAwesome ? <i className={icon} /> : icon}
        </div>

        {/* Title */}
        <h4 style={{
          margin: '0 0 8px 0',
          fontSize: '16px',
          fontWeight: '700',
          color: '#1a1a2e',
          letterSpacing: '-0.3px'
        }}>
          {title}
        </h4>

        {/* Description */}
        <p style={{
          color: '#64748b',
          fontSize: '13px',
          margin: 0,
          lineHeight: 1.5,
          maxWidth: '90%'
        }}>
          {description}
        </p>
      </div>

      {/* Processing Time Badge */}
      {processingTime && (
        <div style={{
          marginTop: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          padding: '6px 12px',
          backgroundColor: isSelected ? '#e8f5e9' : '#f1f5f9',
          borderRadius: '100px',
          fontSize: '11px',
          color: isSelected ? '#1b5e20' : '#475569',
          fontWeight: '600',
          letterSpacing: '0.3px'
        }}>
          <i className="fa-solid fa-clock" style={{ marginRight: '6px', fontSize: '10px' }} />
          {processingTime}
        </div>
      )}
    </div>
  )
}

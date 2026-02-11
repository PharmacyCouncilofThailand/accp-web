'use client'
import { useState, useEffect, useMemo } from 'react'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useCheckoutWizard } from '@/hooks/checkout/useCheckoutWizard'
import { workshopOptions } from '@/data/checkout'
import OrderSummary from '@/components/checkout/OrderSummary'
import { useTickets } from '@/context/TicketContext'
import StripeProvider from '@/components/providers/StripeProvider'
import StripePaymentForm from '@/components/checkout/StripePaymentForm'

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function Payment() {
	const t = useTranslations('payment');
	const tCheckout = useTranslations('checkout');
	const tCommon = useTranslations('common');
	const locale = useLocale();
	const { isAuthenticated, token, user } = useAuth();
	const router = useRouter();

	// Use checkout data from hook
	const { checkoutData, resetCheckout, isInitialized } = useCheckoutWizard();

	// Determine currency based on delegate type (role)
	const isThaiPayment = user?.delegateType?.startsWith('thai') ?? false;
	const currency: 'THB' | 'USD' = isThaiPayment ? 'THB' : 'USD';

	// Ticket data from context (cached, single fetch)
	const { packages: apiPackages, addOns: apiAddOns } = useTickets();

	// Calculate total amount from API data
	const currentPackage = apiPackages.find(p => p.id === checkoutData.selectedPackage);
	const packagePrice = isThaiPayment ? currentPackage?.priceTHB || 0 : currentPackage?.priceUSD || 0;
	const addOnsPrice = apiAddOns
		.filter(a => checkoutData.selectedAddOns.includes(a.id))
		.reduce((sum, a) => (isThaiPayment ? sum + a.priceTHB : sum + a.priceUSD), 0);
	const totalAmount = packagePrice + addOnsPrice;

	// Prepare OrderSummary props
	const orderPackageItem = {
		id: checkoutData.selectedPackage || 'professional',
		name: tCheckout(`packages.${checkoutData.selectedPackage || 'professional'}`),
		price: packagePrice
	};

	const orderAddOns = useMemo(() => {
		return checkoutData.selectedAddOns.map(addOnId => {
			const addon = apiAddOns.find(a => a.id === addOnId);
			if (!addon) return null;

			let details = '';
			if (addOnId === 'workshop' && checkoutData.selectedWorkshopTopic) {
				const option = workshopOptions.find(o => o.value === checkoutData.selectedWorkshopTopic);
				if (option) details = option.label;
			} else if (addOnId === 'gala' && checkoutData.dietaryRequirement) {
				if (checkoutData.dietaryRequirement === 'other' && checkoutData.dietaryOtherText) {
					details = checkoutData.dietaryOtherText;
				} else {
					details = tCheckout(`dietaryOptions.${checkoutData.dietaryRequirement}`);
				}
			}

			return {
				id: addOnId,
				name: tCheckout(`addOns.${addOnId}`),
				price: isThaiPayment ? addon.priceTHB : addon.priceUSD,
				details
			};
		}).filter((item): item is { id: string; name: string; price: number; details: string } => item !== null);
	}, [checkoutData.selectedAddOns, checkoutData.selectedWorkshopTopic, checkoutData.dietaryRequirement, checkoutData.dietaryOtherText, apiAddOns, isThaiPayment, tCheckout]);

	// Stripe PaymentIntent state
	const [clientSecret, setClientSecret] = useState<string | null>(null);
	const [orderId, setOrderId] = useState<number | null>(null);
	const [orderNumber, setOrderNumber] = useState<string>('');
	const [intentError, setIntentError] = useState<string | null>(null);
	const [isCreatingIntent, setIsCreatingIntent] = useState(false);
	const [feeAmount, setFeeAmount] = useState<number>(0);
	const [chargeTotal, setChargeTotal] = useState<number>(0);

	// Check authentication
	useEffect(() => {
		if (!isAuthenticated) {
			router.push(`/${locale}/login`);
		}
	}, [isAuthenticated, router, locale]);

	// Create PaymentIntent on mount
	useEffect(() => {
		if (!isInitialized || !token || !checkoutData.selectedPackage || clientSecret) return;

		const createIntent = async () => {
			setIsCreatingIntent(true);
			setIntentError(null);

			try {
				const res = await fetch(`${API_URL}/api/payments/create-intent`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`,
					},
					body: JSON.stringify({
						packageId: checkoutData.selectedPackage,
						addOnIds: checkoutData.selectedAddOns,
						currency,
						paymentMethod: checkoutData.paymentMethod,
					}),
				});

				const data = await res.json();

				if (!res.ok || !data.success) {
					setIntentError(data.error || 'Failed to initialize payment');
					return;
				}

				setClientSecret(data.data.clientSecret);
				setOrderId(data.data.orderId);
				setOrderNumber(data.data.orderNumber);
				setFeeAmount(data.data.fee || 0);
				setChargeTotal(data.data.total || totalAmount);
			} catch (err) {
				console.error('Failed to create payment intent:', err);
				setIntentError('Failed to connect to payment server');
			} finally {
				setIsCreatingIntent(false);
			}
		};

		createIntent();
	}, [isInitialized, token, checkoutData.selectedPackage, checkoutData.selectedAddOns, currency, clientSecret]);

	if (!isAuthenticated) {
		return null;
	}

	return (
		<Layout headerStyle={1} footerStyle={1}>
			<div>
				{/* Header */}
				<div className="inner-page-header" style={{ backgroundImage: 'url(/assets/img/bg/header-bg16.png)' }}>
					<div className="container">
						<div className="row">
							<div className="col-lg-9 m-auto">
								<div className="heading1 text-center">
									<h1>{t('pageTitle')}</h1>
									<div className="space20" />
									<Link href={`/${locale}`}>{tCommon('home')}</Link> <i className="fa-solid fa-angle-right" />{' '}
									<Link href={`/${locale}/checkout`}>{tCheckout('breadcrumb')}</Link> <i className="fa-solid fa-angle-right" />{' '}
									<span>{t('breadcrumb')}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Payment Section */}
				<div className="sp1">
					<div className="container">
						<div className="row">
							{/* Left Column - Stripe Payment */}
							<div className="col-lg-8">
								<div style={{ marginBottom: '20px' }}>
									<Link
										href={`/${locale}/checkout`}
										style={{
											display: 'inline-flex',
											alignItems: 'center',
											color: '#666',
											textDecoration: 'none',
											fontSize: '15px',
											fontWeight: '500',
											transition: 'color 0.2s'
										}}
										onMouseEnter={(e) => e.currentTarget.style.color = '#00C853'}
										onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
									>
										<i className="fa-solid fa-arrow-left" style={{ marginRight: '8px' }} />
										{t('backToCheckout')}
									</Link>
								</div>

								{/* Loading state */}
								{isCreatingIntent && (
									<div style={{
										padding: '60px 30px',
										border: '2px solid #e0e0e0',
										borderRadius: '12px',
										backgroundColor: '#fff',
										textAlign: 'center'
									}}>
										<i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '40px', color: '#00C853', marginBottom: '20px', display: 'block' }} />
										<p style={{ color: '#666', fontSize: '16px' }}>
											{locale === 'th' ? 'กำลังเตรียมระบบชำระเงิน...' : 'Preparing payment...'}
										</p>
									</div>
								)}

								{/* Error state */}
								{intentError && (
									<div style={{
										padding: '30px',
										border: '2px solid #ff6b6b',
										borderRadius: '12px',
										backgroundColor: '#fff0f0',
										textAlign: 'center'
									}}>
										<i className="fa-solid fa-circle-exclamation" style={{ fontSize: '40px', color: '#ff6b6b', marginBottom: '15px', display: 'block' }} />
										<p style={{ color: '#ff6b6b', fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>
											{intentError}
										</p>
										<button
											onClick={() => {
												setClientSecret(null);
												setIntentError(null);
											}}
											style={{
												padding: '10px 25px',
												backgroundColor: '#00C853',
												color: '#fff',
												border: 'none',
												borderRadius: '8px',
												cursor: 'pointer',
												fontWeight: '600'
											}}
										>
											{locale === 'th' ? 'ลองอีกครั้ง' : 'Try Again'}
										</button>
									</div>
								)}

								{/* Stripe Payment Form */}
								{clientSecret && orderId && (
									<div style={{
										padding: '30px',
										border: '2px solid #00C853',
										borderRadius: '12px',
										backgroundColor: '#fff'
									}}>
										<h4 style={{ marginBottom: '25px', fontSize: '18px', fontWeight: '600' }}>
											{locale === 'th' ? 'ชำระเงิน' : 'Payment'}
										</h4>

										{/* Fee Breakdown */}
										{feeAmount > 0 && (
											<div style={{
												padding: '16px',
												backgroundColor: '#f8f9fa',
												borderRadius: '10px',
												marginBottom: '20px',
												fontSize: '14px',
											}}>
												<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#333' }}>
													<span>{locale === 'th' ? 'ราคาสินค้า' : 'Subtotal'}</span>
													<span>{isThaiPayment ? '฿' : '$'}{totalAmount.toLocaleString()}{!isThaiPayment ? ' USD' : ''}</span>
												</div>
												<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#666' }}>
													<span>{locale === 'th' ? 'ค่าธรรมเนียมชำระเงิน' : 'Payment Processing Fee'}</span>
													<span>{isThaiPayment ? '฿' : '$'}{feeAmount.toLocaleString()}{!isThaiPayment ? ' USD' : ''}</span>
												</div>
												<div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #ddd', fontWeight: '700', color: '#1a1a2e' }}>
													<span>{locale === 'th' ? 'ยอดชำระทั้งหมด' : 'Total'}</span>
													<span style={{ color: '#00C853' }}>{isThaiPayment ? '฿' : '$'}{chargeTotal.toLocaleString()}{!isThaiPayment ? ' USD' : ''}</span>
												</div>
											</div>
										)}

										<StripeProvider clientSecret={clientSecret}>
											<StripePaymentForm
												amount={chargeTotal}
												currency={currency}
												orderId={orderId}
												orderNumber={orderNumber}
												preferredMethod={checkoutData.paymentMethod}
											/>
										</StripeProvider>
									</div>
								)}
							</div>

							{/* Right Column - Order Summary */}
							<div className="col-lg-4">
								<OrderSummary
									packageItem={orderPackageItem}
									addOns={orderAddOns}
									isThai={isThaiPayment}
								/>
							</div>

						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}

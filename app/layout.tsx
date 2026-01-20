import 'swiper/css';
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/vendor/aos.css"
import "../styles/vendor/bootstrap.min.css"
import "../styles/vendor/fontawesome.css"
import "../styles/vendor/magnific-popup.css"
import "../styles/vendor/mobile.css"
import "../styles/vendor/sidebar.css"
import "../styles/vendor/slick-slider.css"
import "../styles/vendor/nice-select.css"
import "../styles/vendor/odometer.css"
import "../styles/main.css"

import "../styles/theme-enhancements.css"
import "../styles/hero-image-fix.css"
import "../styles/header-menu-fix.css"

import type { Metadata } from "next"
import { Figtree, Space_Grotesk, Noto_Sans_Thai } from "next/font/google"
import { Toaster } from 'react-hot-toast'

const figtree = Figtree({
	weight: ['300', '400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
	variable: "--figtree",
	display: 'swap',
})
const grotesk = Space_Grotesk({
	weight: ['300', '400', '500', '600', '700'],
	subsets: ['latin'],
	variable: "--grotesk",
	display: 'swap',
})
const notoSansThai = Noto_Sans_Thai({
	weight: ['300', '400', '500', '600', '700'],
	subsets: ['thai'],
	variable: "--noto-sans-thai",
	display: 'swap',
})

export const metadata: Metadata = {
	title: "ACCP 2026 | The 25th Asian Conference on Clinical Pharmacy | Bangkok, Thailand",
	description: "Join us at ACCP 2026 in Bangkok, Thailand, 9-11 July 2026 at Centara Grand & Bangkok Convention Centre at CentralWorld. Submit abstracts, register, and explore program details.",
	keywords: ["accp", "clinical pharmacy", "conference", "asia", "2026", "Bangkok", "Thailand"],
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html>
			<body className={`${figtree.variable} ${grotesk.variable} ${notoSansThai.variable}`}>
				<Toaster 
					position="top-right"
					toastOptions={{
						duration: 4000,
						style: {
							background: '#1f2937',
							color: '#fff',
							padding: '12px 16px',
							borderRadius: '8px',
							fontSize: '14px',
						},
						success: {
							style: { background: '#059669' },
						},
						error: {
							style: { background: '#dc2626' },
						},
					}}
				/>
				{children}
			</body>
		</html>
	)
}


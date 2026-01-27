'use client'
import AOS from 'aos'
import { useEffect, useState, useMemo, useCallback } from "react"
import AddClassBody from '../elements/AddClassBody'
import BackToTop from '../elements/BackToTop'

import Footer1 from './footer/Footer1'
import Header1 from "./header/Header1"
import MobileMenu from './MobileMenu'

interface LayoutProps {
	headerStyle?: Number
	footerStyle?: Number
	children?: React.ReactNode
	breadcrumbTitle?: string
	headerBgWhite?: boolean
}


export default function Layout({ headerStyle, footerStyle, breadcrumbTitle, children, headerBgWhite }: LayoutProps) {
	const [scroll, setScroll] = useState<boolean>(false)
	// Mobile Menu
	const [isMobileMenu, setMobileMenu] = useState<boolean>(false)
	const handleMobileMenu = useCallback((): void => setMobileMenu(prev => !prev), [])
	const [isSearch, setSearch] = useState<boolean>(false)
	const handleSearch = useCallback((): void => setSearch(prev => !prev), [])

	useEffect(() => {
		// Initialize AOS only once
		AOS.init({
			once: true, // Animation happens only once
			duration: 800,
			easing: 'ease-in-out',
		})

		const handleScroll = (): void => {
			const scrollCheck: boolean = window.scrollY > 100
			if (scrollCheck !== scroll) {
				setScroll(scrollCheck)
			}
		}

		// Use passive listener for better scroll performance
		document.addEventListener("scroll", handleScroll, { passive: true })

		return () => {
			document.removeEventListener("scroll", handleScroll)
		}
	}, [scroll])


	return (
		<>
			<div id="top" />
			<AddClassBody />
			<Header1 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSearch={isSearch} handleSearch={handleSearch} headerBgWhite={headerBgWhite} />
			<MobileMenu isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} />

			{children}

			<Footer1 />


			<BackToTop target="#top" />
		</>
	)
}

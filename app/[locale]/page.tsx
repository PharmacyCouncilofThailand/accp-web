import dynamic from 'next/dynamic'
import Layout from "@/components/layout/Layout"
import HeroSection from '@/components/sections/home1/HeroSection';

// Dynamic imports for below-the-fold components to improve initial load
const WelcomeSection = dynamic(() => import('@/components/sections/home1/WelcomeSection'), {
    loading: () => <div style={{ minHeight: '600px' }} />,
})
const MemoriesSection = dynamic(() => import('@/components/sections/home1/MemoriesSection'), {
    loading: () => <div style={{ minHeight: '400px' }} />,
})
const MapSection = dynamic(() => import('@/components/sections/home1/MapSection'), {
    loading: () => <div style={{ minHeight: '500px' }} />,
})
const SponsorsList = dynamic(() => import('@/components/sections/sponsorship/SponsorsList'), {
    loading: () => <div style={{ minHeight: '300px' }} />,
})
const MemorialPopup = dynamic(() => import('@/components/elements/MemorialPopup'))

export default function Home() {
    return (
        <>
            <Layout headerStyle={1} footerStyle={1}>
                <HeroSection />
                <WelcomeSection />
                <MemoriesSection />
                <MapSection />
                <SponsorsList />
                <MemorialPopup />
            </Layout>
        </>
    )
}

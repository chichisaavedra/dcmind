import React, { useEffect } from 'react';
import LandingHero from '../LandingHero';
import TechMarquee from '../TechMarquee';
import ScrollMagicSection from '../ScrollMagicSection';
import BentoFeatures from './BentoFeatures';
import PricingSection from './PricingSection';
import CinematicCTA from './CinematicCTA';
import NoiseOverlay from './NoiseOverlay';

export default function LandingPage() {
    useEffect(() => {
        // Al montar, forzamos scroll top por si acaso
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-zinc-950 min-h-screen font-sans selection:bg-orange-500/30 selection:text-orange-200">
            <NoiseOverlay />
            <LandingHero />
            <TechMarquee />
            <ScrollMagicSection />
            <BentoFeatures />
            <PricingSection />
            <CinematicCTA />
        </div>
    );
}

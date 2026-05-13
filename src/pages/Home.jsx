import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import LiveStats from '../components/home/LiveStats';
import FeaturesSection from '../components/home/FeaturesSection';
import PricingSection from '../components/home/PricingSection';

const Home = () => {
    return (
        <div className="min-h-screen">
            <HeroSection />
            <LiveStats />
            <FeaturesSection />
            <PricingSection />
        </div>
    );
};

export default Home;

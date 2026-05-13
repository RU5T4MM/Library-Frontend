import { motion } from 'framer-motion';
import { FiWind, FiWifi, FiVideo, FiCoffee, FiBatteryCharging, FiBookOpen, FiShield, FiHeart } from 'react-icons/fi';

const features = [
    { id: 1, title: 'AC Reading Hall', desc: 'Fully air-conditioned halls for a comfortable study experience.', icon: <FiWind /> },
    { id: 2, title: 'High-Speed WiFi', desc: 'Seamless internet connectivity to access digital resources.', icon: <FiWifi /> },
    { id: 3, title: 'CCTV Security', desc: '24/7 CCTV surveillance for a safe and secure environment.', icon: <FiVideo /> },
    { id: 4, title: 'Peaceful Environment', desc: 'Pin-drop silence maintained for maximum concentration.', icon: <FiHeart /> },
    { id: 5, title: 'Charging Ports', desc: 'Individual charging ports at every desk.', icon: <FiBatteryCharging /> },
    { id: 6, title: 'Drinking Water', desc: 'RO purified hot & cold drinking water available.', icon: <FiCoffee /> },
    { id: 7, title: 'Digital Library', desc: 'Access to premium e-books, journals, and study materials.', icon: <FiBookOpen /> },
    { id: 8, title: 'Smart Seat Booking', desc: 'Book your preferred seat online from anywhere.', icon: <FiShield /> },
];

const FeaturesSection = () => {
    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden">
            {/* Decorative blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase text-sm"
                    >
                        Premium Facilities
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mt-2 text-4xl font-extrabold text-slate-900 dark:text-white"
                    >
                        Everything you need to <span className="premium-gradient-text">succeed</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass-card p-8 rounded-2xl group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700/50 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                {feature.title}
                            </h3>
                            
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;

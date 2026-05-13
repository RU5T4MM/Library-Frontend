import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const plans = [
    {
        id: 1,
        name: '1 Month Plan',
        price: '500',
        duration: 'per month',
        popular: false,
        features: [
            'Dedicated Seat',
            'Free High-Speed WiFi',
            'AC Facility',
            'Secure Access',
            'Premium Study Environment',
            'Student Support'
        ]
    },
    {
        id: 2,
        name: '3 Month Plan',
        price: '1200',
        duration: 'for 3 months',
        popular: true,
        features: [
            'Dedicated Seat',
            'Free High-Speed WiFi',
            'AC Facility',
            'Secure Access',
            'Premium Study Environment',
            'Student Support',
            'Save ₹300'
        ]
    }
];

const PricingSection = () => {
    return (
        <section className="py-24 bg-slate-100 dark:bg-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase text-sm"
                    >
                        Pricing Plans
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mt-2 text-4xl font-extrabold text-slate-900 dark:text-white"
                    >
                        Choose your <span className="premium-gradient-text">Membership</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className={`glass-card rounded-3xl p-8 relative ${
                                plan.popular 
                                ? 'border-2 border-indigo-500 shadow-indigo-500/20 transform md:-translate-y-4' 
                                : 'border border-slate-200 dark:border-slate-700 mt-0 md:mt-4'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
                                {plan.name}
                            </h3>
                            
                            <div className="text-center mt-6 mb-8">
                                <span className="text-5xl font-extrabold text-slate-900 dark:text-white">₹{plan.price}</span>
                                <span className="text-slate-500 dark:text-slate-400">/{plan.duration}</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center text-slate-700 dark:text-slate-300">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-3 text-indigo-600 dark:text-indigo-400">
                                            <FiCheck size={14} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link 
                                to="/dashboard" 
                                className={`block w-full text-center py-4 rounded-xl font-bold transition-all ${
                                    plan.popular
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'
                                }`}
                            >
                                Get Started
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;

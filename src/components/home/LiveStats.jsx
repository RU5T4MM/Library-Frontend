import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiUsers, FiCheckCircle, FiStar, FiActivity, FiMapPin } from 'react-icons/fi';
import api from '../../services/api';

const Counter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });

    useEffect(() => {
        if (!isInView) return;

        let startTime = null;
        const startValue = 0;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // easeOutQuart
            const easeProgress = 1 - Math.pow(1 - percentage, 4);
            
            setCount(Math.floor(startValue + (end - startValue) * easeProgress));

            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [end, duration, isInView]);

    return <span ref={ref}>{count}</span>;
};

const LiveStats = () => {
    const [availableSeats, setAvailableSeats] = useState(35);

    useEffect(() => {
        api.get('/seats').then(res => {
            const available = res.data.data.filter(s => s.status === 'available').length;
            setAvailableSeats(available);
        }).catch(() => {});
    }, []);

    const stats = [
        { id: 1, title: 'Total Students', value: 500, suffix: '+', icon: <FiUsers className="text-blue-500" /> },
        { id: 2, title: 'Available Seats', value: availableSeats, suffix: '', icon: <FiMapPin className="text-green-500" /> },
        { id: 3, title: 'Active Members', value: 200, suffix: '+', icon: <FiCheckCircle className="text-indigo-500" /> },
        { id: 4, title: 'Success Rate', value: 95, suffix: '%', icon: <FiStar className="text-yellow-500" /> },
        { id: 5, title: 'Daily Visitors', value: 150, suffix: '+', icon: <FiActivity className="text-purple-500" /> },
    ];
    return (
        <section className="py-16 bg-slate-100 dark:bg-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass-card p-6 rounded-2xl text-center hover:-translate-y-2 transition-transform duration-300"
                        >
                            <div className="flex justify-center mb-4 text-3xl">
                                {stat.icon}
                            </div>
                            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                                <Counter end={stat.value} />{stat.suffix}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                                {stat.title}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LiveStats;

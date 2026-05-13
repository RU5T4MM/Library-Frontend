import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-2xl font-bold text-white mb-4 premium-gradient-text inline-block">Infotech Library</h3>
                        <p className="text-sm mb-4 text-slate-400">
                            Smart Study Environment for Smart Students. A premium space for focused preparation.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-white transition-colors"><FiFacebook size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors"><FiTwitter size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors"><FiInstagram size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold text-white mb-4">Features</h4>
                        <ul className="space-y-2 text-sm">
                            <li>AC Reading Hall</li>
                            <li>High-Speed WiFi</li>
                            <li>Smart Seat Booking</li>
                            <li>24x7 Study Support</li>
                        </ul> 
                    </div>

                    <div>
                        <h4 className="text-lg font-bold text-white mb-4">Contact Info</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start">
                                <FiMapPin className="mt-1 mr-2 flex-shrink-0" />
                                <span>Jajwaliya Chauraha (Ambedkar chauk)<br />Near Honda Agency Pagra Vijayipur Road</span>
                            </li>
                            <li className="flex items-center">
                                <FiPhone className="mr-2 flex-shrink-0" />
                                <span>+91 7905823236</span>
                            </li>
                            <li className="flex items-center">
                                <FiMail className="mr-2 flex-shrink-0" />
                                <span>info@infotechlibrary.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Infotech Library. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white pt-10 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">ISBM School</h3>
                        <p className="text-gray-400">
                            Empowering students with knowledge and character. <br />
                            Excellence in education since 2000.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                            <li><Link to="/admissions" className="text-gray-400 hover:text-white">Admissions</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Contact Info</h3>
                        <p className="text-gray-400">
                            123 School Lane, Education City <br />
                            Phone: +91 98765 43210 <br />
                            Email: info@isbm.com
                        </p>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-400">
                    &copy; {new Date().getFullYear()} ISBM School. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Heart,
    Activity,
    Users,
    Calendar,
    FileText,
    Shield,
    Clock,
    Award,
    ArrowRight,
    CheckCircle
} from 'lucide-react';

const Welcome = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: Calendar,
            title: 'Easy Appointment Booking',
            description: 'Schedule appointments with top healthcare professionals in just a few clicks'
        },
        {
            icon: FileText,
            title: 'Digital Medical Records',
            description: 'Access your complete medical history anytime, anywhere securely'
        },
        {
            icon: Activity,
            title: 'Real-time Health Monitoring',
            description: 'Track your vital signs and health metrics with advanced analytics'
        },
        {
            icon: Shield,
            title: 'Secure & Private',
            description: 'Your health data is protected with enterprise-grade security'
        }
    ];

    const stats = [
        { number: '10K+', label: 'Active Patients' },
        { number: '500+', label: 'Expert Doctors' },
        { number: '50K+', label: 'Appointments' },
        { number: '99.9%', label: 'Satisfaction Rate' }
    ];

    const services = [
        { icon: Users, title: 'For Patients', description: 'Book appointments, access records, and manage your health journey' },
        { icon: Activity, title: 'For Doctors', description: 'Manage appointments, patient records, and prescriptions efficiently' },
        { icon: FileText, title: 'For Labs', description: 'Process test orders and deliver results seamlessly' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                                <Heart className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                IntelliHealth
                            </span>
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8 animate-fade-in">
                            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                                <Award className="h-4 w-4" />
                                <span>Trusted Healthcare Platform</span>
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Your Health,
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {' '}Our Priority
                                </span>
                            </h1>

                            <p className="text-xl text-gray-600 leading-relaxed">
                                Experience seamless healthcare management with IntelliHealth.
                                Connect with expert doctors, manage appointments, and access your
                                medical records all in one secure platform.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
                                >
                                    <span>Get Started</span>
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button
                                    onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                                    className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
                                >
                                    Learn More
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex items-center space-x-6 pt-4">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span className="text-sm text-gray-600">HIPAA Compliant</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span className="text-sm text-gray-600">24/7 Support</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span className="text-sm text-gray-600">Secure Platform</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Illustration */}
                        <div className="relative">
                            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                                <div className="bg-white rounded-2xl p-6 space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-blue-100 p-3 rounded-full">
                                            <Heart className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Health Score</p>
                                            <p className="text-2xl font-bold text-gray-900">98/100</p>
                                        </div>
                                    </div>

                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full w-[98%] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 pt-4">
                                        <div className="text-center">
                                            <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                            <p className="text-xs text-gray-500">Heart Rate</p>
                                            <p className="font-bold text-gray-900">72 bpm</p>
                                        </div>
                                        <div className="text-center">
                                            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                            <p className="text-xs text-gray-500">Sleep</p>
                                            <p className="font-bold text-gray-900">7.5 hrs</p>
                                        </div>
                                        <div className="text-center">
                                            <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                            <p className="text-xs text-gray-500">Next Visit</p>
                                            <p className="font-bold text-gray-900">2 days</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg animate-bounce-slow">
                                <div className="flex items-center space-x-2">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Appointment</p>
                                        <p className="text-sm font-bold text-gray-900">Confirmed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <p className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.number}</p>
                                <p className="text-blue-100 text-sm lg:text-base">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need for Better Healthcare
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Comprehensive features designed to make healthcare management simple and efficient
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
                            >
                                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                                    <feature.icon className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Built for Everyone in Healthcare
                        </h2>
                        <p className="text-xl text-gray-600">
                            Tailored solutions for patients, doctors, and healthcare professionals
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    <service.icon className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                                <p className="text-gray-600 mb-6">{service.description}</p>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-blue-600 font-semibold flex items-center space-x-2 hover:space-x-3 transition-all"
                                >
                                    <span>Get Started</span>
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Ready to Transform Your Healthcare Experience?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Join thousands of satisfied users who trust IntelliHealth for their healthcare needs
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                        >
                            Start Your Journey Today
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                                    <Heart className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-xl font-bold">IntelliHealth</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Your trusted partner in healthcare management
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Platform</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">For Patients</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">For Doctors</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">For Labs</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Company</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Legal</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">HIPAA Compliance</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
                        <p>&copy; 2026 IntelliHealth. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default Welcome;

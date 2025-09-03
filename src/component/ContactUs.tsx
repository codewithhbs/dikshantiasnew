'use client'
import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

interface FormData {
    firstName: string;
    email: string;
    phone?: string;
    message: string;
}

interface SettingsData {
    image: { url: string };
    name: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    googleMap: string;
    facebook: string;
    instagram: string;
    youtube: string;
    linkedin: string;
    twitter: string;
    telegram: string;
}

const ContactUs: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        email: '',
        phone: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [settings, setSettings] = useState<SettingsData | null>(null);

    // Fetch settings data dynamically
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/admin/settings");
                const data = await res.json();
                setSettings(data[0]); // because API returns an array
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };
        fetchSettings();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Form submitted:', formData);
        alert('Thank you for your message! We\'ll get back to you soon.');

        // Reset form
        setFormData({
            firstName: '',
            email: '',
            phone: '',
            message: ''
        });

        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-red-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

                    {/* Left Column - Contact Information */}
                    <div className="space-y-12">

                        {/* Contact Address Section */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                            <h2 className="text-3xl font-bold text-slate-800 mb-6">Our contact address</h2>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-4 group">
                                    <div className="bg-red-100 p-3 rounded-full group-hover:bg-red-200 transition-colors">
                                        <MapPin className="w-5 h-5 text-red-600" />
                                    </div>
                                    <span className="text-slate-700 font-medium">
                                        <span className='font-bold'>Main Office: </span> {settings?.address}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-4 group">
                                    <div className="bg-red-100 p-3 rounded-full group-hover:bg-red-200 transition-colors">
                                        <Mail className="w-5 h-5 text-red-600" />
                                    </div>
                                    <span className="text-slate-700 font-medium">
                                        <span className='font-bold'>Email us:</span> {settings?.email}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-4 group">
                                    <div className="bg-red-100 p-3 rounded-full group-hover:bg-red-200 transition-colors">
                                        <Phone className="w-5 h-5 text-red-600" />
                                    </div>
                                    <span className="text-slate-700 font-medium">
                                        <span className='font-bold'>Phone:</span> {settings?.phone}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Find Our Location Section */}
                        {/* <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                            <h2 className="text-3xl font-bold text-slate-800 mb-6">Find our location</h2>
                            <div className="relative bg-slate-200 rounded-xl overflow-hidden h-64 group">
                                {settings?.googleMap && (
                                    <iframe
                                        src={settings.googleMap}
                                        width="600"
                                        height="450"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                )}
                            </div>
                        </div> */}

                        <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                            <h2 className="text-3xl font-bold text-slate-800 mb-6">Find our location</h2>

                            {/* Map Container */}
                            <div className="relative bg-slate-200 rounded-xl overflow-hidden h-64 group">
                                {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-20"></div> */}
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6998.605832512177!2d77.210895!3d28.710492000000002!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfde300000001%3A0x28caa7bed77a7699!2sDikshant%20IAS%20-%20Best%20IAS%20Coaching%20in%20Delhi%20%7C%20Top%20UPSC%20Coaching%20Institute%20in%20Delhi%20%7C%20IAS%20coaching%20Classes!5e0!3m2!1sen!2sin!4v1754387802875!5m2!1sen!2sin"
                                    width="600"
                                    height="450"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />

                            </div>
                        </div>
                        </div>

                    {/* Right Column - Contact Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                        <h2 className="text-3xl font-bold text-slate-800 mb-8">Do you have any questions?</h2>
                        <p className="text-slate-600 mb-8 leading-relaxed -mt-5">
                            Have a question or just want to say hi? We&apos;d love to hear from you.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name and Email Row */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Your Name"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            <input
                                type="tel"
                                name="phone"
                                placeholder="Your Phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500"
                            />

                            <textarea
                                name="message"
                                placeholder="Your Message"
                                rows={6}
                                value={formData.message}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 resize-none"
                            />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-6 rounded-lg transition-all flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        Submit
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;

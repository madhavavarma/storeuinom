import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Fragment } from "react"
import Header from "@/components/base/Header"

export default function AboutUs() {
  return (
    <Fragment>
        <Header />

        <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">
      
            {/* Heading */}
            <motion.h1 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-4xl font-bold text-center text-green-700"
            >
                About Us
            </motion.h1>

            {/* Company Description */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }}
                className="text-center text-muted-foreground text-lg max-w-3xl mx-auto"
            >
                Welcome to <span className="font-semibold text-green-800">[Your Company Name]</span> — where passion meets purpose. 
                We are dedicated to delivering the best products and services to our customers, 
                combining innovation, quality, and care every step of the way.
            </motion.div>

            {/* Mission & Values */}
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-green-700 mb-2">Our Mission</h2>
                    <p className="text-muted-foreground">
                    To create meaningful impact through sustainable solutions, and empower our customers with exceptional value and trust.
                    </p>
                </CardContent>
                </Card>

                <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-green-700 mb-2">What We Value</h2>
                    <p className="text-muted-foreground">
                    Transparency, creativity, and integrity are the cornerstones of our work culture and the foundation of all we do.
                    </p>
                </CardContent>
                </Card>
            </motion.div>

            {/* Contact Section */}
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                <Card>
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold text-green-700 mb-2">Contact Information</h2>
                    <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <span className="text-muted-foreground">+91 98765 43210</span>
                    </div>
                    <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    <span className="text-muted-foreground">+91 98765 43210 (WhatsApp)</span>
                    </div>
                    <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-green-600" />
                    <span className="text-muted-foreground">contact@yourcompany.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <span className="text-muted-foreground">
                        123 Business Street, Tech City, India - 530001
                    </span>
                    </div>
                </CardContent>
                </Card>

                {/* Social Media */}
                <Card>
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold text-green-700 mb-2">Follow Us</h2>
                    <div className="flex flex-wrap gap-4">
                    <a href="https://facebook.com" target="_blank" className="flex items-center gap-2 text-blue-600 hover:underline">
                        <Facebook className="w-5 h-5" /> Facebook
                    </a>
                    <a href="https://twitter.com" target="_blank" className="flex items-center gap-2 text-sky-500 hover:underline">
                        <Twitter className="w-5 h-5" /> Twitter
                    </a>
                    <a href="https://instagram.com" target="_blank" className="flex items-center gap-2 text-pink-600 hover:underline">
                        <Instagram className="w-5 h-5" /> Instagram
                    </a>
                    <a href="https://linkedin.com" target="_blank" className="flex items-center gap-2 text-blue-800 hover:underline">
                        <Linkedin className="w-5 h-5" /> LinkedIn
                    </a>
                    </div>
                </CardContent>
                </Card>
            </motion.div>
        </div>

    {/* Footer removed for centralized layout */}
    </Fragment>
   
  )
}

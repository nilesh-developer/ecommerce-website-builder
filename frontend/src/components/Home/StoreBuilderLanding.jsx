import React, { useState, useEffect } from 'react';
import { ChevronDown, Star, ArrowRight, Menu, X, Play, Shield, Zap, Globe, Store, CreditCard, Smartphone, Users, TrendingUp, Check } from 'lucide-react';
import HeaderLanding from './HeaderLanding';
import {Link} from "react-router-dom"

const StoreBuilderLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Zap className="text-white" size={32} />,
      title: "Launch in Seconds",
      description: "Create your professional online store instantly with our intuitive builder"
    },
    {
      icon: <Globe className="text-white" size={32} />,
      title: "Free Subdomain + Custom Domain",
      description: "Get yourstore.ourplatform.com free, or connect your own domain"
    },
    {
      icon: <CreditCard className="text-white" size={32} />,
      title: "Built-in Payment Gateway",
      description: "Accept payments instantly with our integrated payment system"
    },
    {
      icon: <Shield className="text-white" size={32} />,
      title: "No Subscription Fees",
      description: "Only 5% on successful online payments. No hidden costs or monthly fees"
    },
    {
      icon: <Smartphone className="text-white" size={32} />,
      title: "Social Media Ready",
      description: "Perfect for creators and influencers to monetize their audience"
    },
    {
      icon: <TrendingUp className="text-white" size={32} />,
      title: "Weekly Payouts",
      description: "Get paid weekly directly to your bank account"
    }
  ];

  const testimonials = [
    {
      name: "Alex Rivera",
      role: "Content Creator",
      content: "Launched my merch store in under 2 minutes! Already making sales through my Instagram.",
      rating: 5
    },
    {
      name: "Maria Santos",
      role: "Small Business Owner",
      content: "No monthly fees and instant payments. This platform changed my business completely.",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "Influencer",
      content: "My followers love the seamless shopping experience. Sales have tripled!",
      rating: 5
    }
  ];

  const pricingFeatures = [
    "Instant store setup",
    "Free subdomain",
    "Custom domain support",
    "Built-in payment gateway",
    "Mobile-responsive design",
    "Social media integration",
    "Weekly payouts",
    "24/7 support"
  ];

  return (
    <div className="min-h-screen bg-white text-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-white to-orange-500/5"></div>
        <div className="absolute inset-0" style={{
          background: `radial-gradient(circle at ${50 + Math.sin(scrollY * 0.001) * 20}% ${50 + Math.cos(scrollY * 0.001) * 20}%, rgba(255, 181, 0, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-32 pb-12">
        <div className="max-w-5xl mx-auto text-center z-10">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-full text-sm border border-orange-400/30 backdrop-blur-sm text-orange-700 font-semibold">🚀 Launch your store in seconds, not hours</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-black via-orange-600 to-black bg-clip-text text-transparent">Build Your</span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent animate-gradient">Online Store</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">Perfect for creators, influencers & small businesses. No subscription fees. Get your free subdomain and start selling in seconds.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {/* <Link to="/signup" className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-400 hover:to-orange-500 transition-all transform hover:scale-105 shadow-md flex items-center justify-center"><button >Create Store Now<ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" /></button></Link>
            <Link to="https://youtu.be/JJ-WRmY9iJc?si=PMrf930XP3E9XgYv" className="group flex items-center justify-center px-8 py-4 rounded-full text-lg font-semibold border border-orange-500/40 hover:border-orange-400 backdrop-blur-sm hover:bg-orange-500/5 transition-all text-black"><Play className="mr-2 group-hover:scale-110 transition-transform" size={20} /> Watch Demo</Link> */}
            <a href="/signup" className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-400 hover:to-orange-500 transition-all transform hover:scale-105 shadow-md flex items-center justify-center"><button >Create Store Now<ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" /></button></a>
            <a href="https://youtu.be/JJ-WRmY9iJc?si=PMrf930XP3E9XgYv" className="group flex items-center justify-center px-8 py-4 rounded-full text-lg font-semibold border border-orange-500/40 hover:border-orange-400 backdrop-blur-sm hover:bg-orange-500/5 transition-all text-black"><Play className="mr-2 group-hover:scale-110 transition-transform" size={20} /> Watch Demo</a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-gray-600">
            <div className="flex items-center"><Check className="text-orange-500 mr-2" size={16} />No Setup Fees</div>
            <div className="flex items-center"><Check className="text-orange-500 mr-2" size={16} />Free Subdomain</div>
            <div className="flex items-center"><Check className="text-orange-500 mr-2" size={16} />Built-in Payments</div>
            <div className="flex items-center"><Check className="text-orange-500 mr-2" size={16} />Weekly Payouts</div>
          </div>
        </div>
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-gradient-to-r from-orange-400/20 to-orange-600/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-orange-500/60" size={24} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6"><span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">Everything You Need</span></h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Built specifically for creators, influencers, and small businesses who want to start selling online</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative bg-gradient-to-b from-orange-100/40 to-white/80 backdrop-blur-sm rounded-3xl p-8 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-500 transform hover:scale-105 shadow-md">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-black">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6"><span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">How It Works</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl group-hover:scale-110 transition-transform">1</div>
              <h3 className="text-2xl font-bold mb-4 text-black">Sign Up & Create</h3>
              <p className="text-gray-700">Register in seconds and use our drag-and-drop builder to create your store</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl group-hover:scale-110 transition-transform">2</div>
              <h3 className="text-2xl font-bold mb-4 text-black">Add Products & Share</h3>
              <p className="text-gray-700">Upload your products and share your store link on social media</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl group-hover:scale-110 transition-transform">3</div>
              <h3 className="text-2xl font-bold mb-4 text-black">Get Paid Weekly</h3>
              <p className="text-gray-700">Receive payments every week minus our 5% fee on successful transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6"><span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">Simple Pricing</span></h2>
            <p className="text-xl text-gray-600">No monthly fees. No hidden costs. Just 5% on successful online payments.</p>
          </div>
          <div className="bg-gradient-to-b from-orange-100/40 to-white/80 backdrop-blur-sm rounded-3xl p-8 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-500 shadow-md">
            <div className="text-center mb-8">
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-full text-sm border border-orange-400/30 backdrop-blur-sm mb-4 text-orange-700 font-semibold">Most Popular</div>
              <h3 className="text-3xl font-bold mb-2 text-black">Pay As You Grow</h3>
              <div className="flex items-center justify-center mb-4">
                <span className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">5%</span>
                <span className="text-gray-600 ml-2">per successful transaction</span>
              </div>
              <p className="text-gray-700">Everything you need to start selling online</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {pricingFeatures.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="text-orange-500 mr-3 flex-shrink-0" size={16} />
                  <span className="text-gray-800">{feature}</span>
                </div>
              ))}
            </div>
            {/* <Link to="/signup" ><button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-400 hover:to-orange-500 transition-all transform hover:scale-105 shadow-md">Start Building Your Store</button></Link> */}
            <a href="/signup" ><button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-400 hover:to-orange-500 transition-all transform hover:scale-105 shadow-md">Start Building Your Store</button></a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6"><span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">Success Stories</span></h2>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-orange-100/40 to-white/80 backdrop-blur-sm border border-orange-500/20 p-8 shadow-md">
            <div className="flex transition-transform duration-500" style={{transform: `translateX(-${currentSlide * 100}%)`}}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 text-center px-2">
                  <div className="flex justify-center mb-4">{[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="text-orange-500 fill-current" size={20} />))}</div>
                  <p className="text-xl italic mb-6 text-gray-700">"{testimonial.content}"</p>
                  <div>
                    <p className="font-bold text-lg text-black">{testimonial.name}</p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6"><span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent animate-gradient">Ready to Start Selling?</span></h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">Join thousands of creators and small businesses who are already making money with their online stores</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <Link to="/signup" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-400 hover:to-orange-500 transition-all transform hover:scale-105 shadow-md"><button>Create Your Store Now</button></Link>
            <Link to="/contact-us" className="px-8 py-4 rounded-full text-lg font-semibold border border-orange-500/40 hover:border-orange-400 backdrop-blur-sm hover:bg-orange-500/5 transition-all text-black">Talk to Sales</Link> */}
            <a href="/signup" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-400 hover:to-orange-500 transition-all transform hover:scale-105 shadow-md"><button>Create Your Store Now</button></a>
            <a href="/contact-us" className="px-8 py-4 rounded-full text-lg font-semibold border border-orange-500/40 hover:border-orange-400 backdrop-blur-sm hover:bg-orange-500/5 transition-all text-black">Talk to Sales</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="py-12 px-4 sm:px-6 border-t border-orange-500/20 relative z-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-4">StoreBuilder</div>
            <p className="text-gray-600 mb-6">Empowering creators to build their online empire</p>
            <div className="flex justify-center space-x-6 text-gray-600">
              <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer> */}
      
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        .animate-gradient {
          background: linear-gradient(-45deg, #fb923c, #f97316, #fdba74, #ea580c);
          background-size: 400% 400%;
          animation: gradient 3s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
};

export default StoreBuilderLanding;
import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from "react";

export default function Plans() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const pricingPlans = [
    {
      name: "The Essential",
      price: "₹1,50,000",
      description: "Perfect for intimate weddings and pre-wedding events. Ideal for couples who want quality coverage without the full-day commitment.",
      features: [
        "6 Hours of Coverage",
        "1 Professional Photographer",
        "High-Res Online Gallery",
        "200+ Edited Photos",
        "Print Release",
        "Online Delivery within 2 weeks"
      ],
      isPopular: false,
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=60"
    },
    {
      name: "The Premium",
      price: "₹2,50,000",
      description: "Our most booked package for traditional wedding days. Complete coverage from preparation to reception.",
      features: [
        "10 Hours of Coverage",
        "2 Professional Photographers",
        "Complimentary Engagement Shoot",
        "High-Res Online Gallery",
        "500+ Edited Photos",
        "Custom USB Drive",
        "Premium Photo Box"
      ],
      isPopular: true,
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=60"
    },
    {
      name: "The Signature",
      price: "₹4,00,000",
      description: "The ultimate storytelling experience for grand celebrations. Every moment captured in cinematic detail.",
      features: [
        "Full Day Coverage (Unlimited)",
        "2 Photographers & 1 Videographer",
        "Cinematic Highlight Film",
        "Premium Heirloom Leather Album",
        "800+ Edited Photos",
        "Drone Footage (Weather Permitting)",
        "Same Day Edit Option"
      ],
      isPopular: false,
      image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&auto=format&fit=crop&q=60"
    }
  ];

  const addOns = [
    {
      title: "Additional Hours",
      price: "₹15,000",
      desc: "Per hour extension",
      image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&auto=format&fit=crop&q=60"
    },
    {
      title: "Second Shooter",
      price: "₹25,000",
      desc: "Additional photographer",
      image: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=400&auto=format&fit=crop&q=60"
    },
    {
      title: "Premium Album",
      price: "₹35,000",
      desc: "Leather bound, 40 pages",
      image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&auto=format&fit=crop&q=60"
    },
    {
      title: "Engagement Session",
      price: "₹20,000",
      desc: "2 hour outdoor shoot",
      image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&auto=format&fit=crop&q=60"
    }
  ];

  const testimonials = [
    {
      name: "Priya & Rahul",
      text: "The Premium package was perfect for our three-day celebration. Every ritual captured beautifully.",
      plan: "The Premium",
      image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&auto=format&fit=crop&q=60"
    },
    {
      name: "Ananya & Vikram",
      text: "Worth every penny. The Signature package gave us memories we will treasure forever.",
      plan: "The Signature",
      image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&auto=format&fit=crop&q=60"
    }
  ];

  const faqs = [
    {
      q: "How far in advance should we book?",
      a: "We recommend booking 6-12 months in advance, especially for peak wedding season (October-February)."
    },
    {
      q: "What is your payment structure?",
      a: "50% retainer to secure your date, remaining 50% due one week before the wedding."
    },
    {
      q: "Do you travel outside Mumbai?",
      a: "Yes, we shoot destination weddings across India and internationally. Travel fees apply."
    },
    {
      q: "How long until we receive our photos?",
      a: "Standard delivery is 4-6 weeks. Rush editing available for an additional fee."
    }
  ];

  return (
    <div className="overflow-x-hidden bg-white">
      {/* Hero Section with 3D Depth */}
      <div 
        ref={heroRef}
        className="relative min-h-[60vh] flex items-center justify-center text-center px-4 overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-brand/5 blur-3xl"
              style={{
                width: `${400 + i * 150}px`,
                height: `${400 + i * 150}px`,
                left: `${15 + i * 15}%`,
                top: `${10 + i * 12}%`,
                animation: `float ${6 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
                transform: `translate3d(${mousePosition.x * (i + 1)}px, ${mousePosition.y * (i + 1)}px, 0)`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div 
            className="mb-6 transform-gpu"
            style={{
              transform: `translateZ(50px) rotateX(${mousePosition.y * 0.3}deg)`,
              transition: "transform 0.2s ease-out",
            }}
          >
            <span className="inline-block text-brand font-black uppercase tracking-[0.4em] text-sm mb-6 border-b-2 border-brand pb-2">
              Transparent Pricing
            </span>
          </div>
          
          <h1 
            className="text-6xl md:text-8xl lg:text-9xl font-serif text-brand-dark mb-8 leading-none transform-gpu"
            style={{
              transform: `translateZ(100px) rotateX(${mousePosition.y * 0.2}deg) rotateY(${mousePosition.x * 0.2}deg)`,
              transition: "transform 0.2s ease-out",
              textShadow: "0 30px 60px rgba(0,0,0,0.1)",
            }}
          >
            Investment <span className="text-brand italic">Plans</span>
          </h1>
          
          <p 
            className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light transform-gpu"
            style={{
              transform: `translateZ(75px)`,
              textShadow: "0 4px 10px rgba(255,255,255,0.8)",
            }}
          >
            Transparent pricing for timeless memories. Choose the collection that perfectly aligns with the vision for your special day. No hidden costs, just exceptional value.
          </p>
        </div>
      </div>

      {/* Pricing Cards Grid - 3D Hover Effects */}
      <div className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center perspective-1000">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative transform-gpu transition-all duration-700 ${plan.isPopular ? 'md:-translate-y-8 z-10' : 'z-0'}`}
              style={{
                transform: hoveredPlan === index ? `translateZ(50px) rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg) scale(1.02)` : '',
              }}
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              <div 
                className={`relative bg-white overflow-hidden shadow-2xl transition-all duration-500 ${plan.isPopular ? 'border-2 border-brand' : 'border border-brand/20'} ${hoveredPlan === index ? 'shadow-brand/20' : ''}`}
              >
                {/* Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={plan.image} 
                    alt={plan.name}
                    className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent" />
                  <div className="absolute bottom-4 left-6 text-white">
                    <span className="text-xs uppercase tracking-[0.3em] font-bold opacity-80">Package</span>
                    <h3 className="text-3xl font-serif">{plan.name}</h3>
                  </div>
                </div>

                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute top-4 right-4 bg-brand text-white px-4 py-2 text-xs uppercase tracking-widest font-black shadow-lg transform rotate-3">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  <div className="text-center border-b border-brand/20 pb-8 mb-8">
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">{plan.description}</p>
                    <div className="text-5xl font-serif text-brand-dark font-bold">
                      {plan.price}
                    </div>
                    <p className="text-xs text-brand font-black uppercase tracking-[0.3em] mt-3">Starting at</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-700 text-sm group">
                        <svg className="w-5 h-5 text-brand mr-3 flex-shrink-0 transform group-hover:scale-125 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="group-hover:text-brand-dark transition-colors duration-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link 
                    to="/contact" 
                    className={`group relative block w-full py-4 text-center uppercase tracking-[0.2em] text-sm font-bold overflow-hidden transition-all duration-500 ${plan.isPopular ? 'bg-brand-dark text-white hover:shadow-xl' : 'bg-brand-light text-brand-dark border-2 border-brand/20 hover:border-brand-dark'}`}
                  >
                    <span className="relative z-10 group-hover:tracking-[0.3em] transition-all duration-500">Inquire Now</span>
                    {!plan.isPopular && (
                      <div className="absolute inset-0 bg-brand-dark transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    )}
                    {!plan.isPopular && (
                      <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 z-20">
                        Inquire Now
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add-Ons Section */}
      <section className="py-32 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-serif text-brand-dark mb-6">
              Customize Your <span className="text-brand italic">Experience</span>
            </h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              Enhance any package with these premium add-ons
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => (
              <div
                key={index}
                className="group relative bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 transform-gpu cursor-pointer"
                style={{
                  transform: `rotateX(${mousePosition.y * 0.05}deg) rotateY(${mousePosition.x * 0.05}deg)`,
                  transition: "transform 0.3s ease-out, box-shadow 0.3s, translate 0.3s",
                }}
              >
                <div className="h-40 overflow-hidden">
                  <img 
                    src={addon.image} 
                    alt={addon.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-6 relative">
                  <div className="absolute top-0 right-0 bg-brand text-white px-3 py-1 text-sm font-bold transform translate-y-[-50%] shadow-lg">
                    {addon.price}
                  </div>
                  <h3 className="text-xl font-serif text-brand-dark mb-2 group-hover:text-brand transition-colors duration-300">
                    {addon.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{addon.desc}</p>
                  <div className="mt-4 w-12 h-1 bg-brand/20 group-hover:w-full group-hover:bg-brand transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Parallax Cards */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-serif text-brand-dark text-center mb-20">
          Couple <span className="text-brand italic">Stories</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative flex flex-col md:flex-row gap-8 items-center bg-white p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 transform-gpu"
              style={{
                transform: `translateY(${Math.sin(scrollY * 0.01 + index) * 10}px)`,
              }}
            >
              <div className="w-full md:w-1/3 h-48 md:h-full overflow-hidden rounded-sm">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="w-full md:w-2/3">
                <div className="text-4xl text-brand/20 font-serif mb-4">"</div>
                <p className="text-xl text-gray-700 mb-6 leading-relaxed font-light">
                  {testimonial.text}
                </p>
                <div className="border-t border-brand/20 pt-4">
                  <p className="font-serif text-brand-dark text-lg">{testimonial.name}</p>
                  <p className="text-brand text-xs uppercase tracking-widest font-bold">{testimonial.plan}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-brand-dark text-brand-light relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-6xl font-serif text-center mb-16">
            Frequently Asked <span className="text-brand italic">Questions</span>
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 p-8 hover:bg-white/10 transition-all duration-500 cursor-pointer"
                style={{
                  transform: `translateX(${Math.sin(scrollY * 0.01 + index) * 5}px)`,
                }}
              >
                <h3 className="text-xl font-serif text-brand mb-3 group-hover:translate-x-2 transition-transform duration-300">
                  {faq.q}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-32 px-4 max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-serif text-brand-dark text-center mb-20">
          Plan <span className="text-brand italic">Comparison</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-brand">
                <th className="text-left py-6 px-4 font-serif text-2xl text-brand-dark">Features</th>
                <th className="text-center py-6 px-4 font-serif text-xl text-brand-dark">Essential</th>
                <th className="text-center py-6 px-4 font-serif text-xl text-brand bg-brand/5">Premium</th>
                <th className="text-center py-6 px-4 font-serif text-xl text-brand-dark">Signature</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Coverage Hours", "6 Hours", "10 Hours", "Unlimited"],
                ["Photographers", "1", "2", "2 + 1 Videographer"],
                ["Edited Photos", "200+", "500+", "800+"],
                ["Engagement Shoot", "—", "Included", "Included"],
                ["Cinematic Film", "—", "—", "Included"],
                ["Album", "—", "—", "Premium Leather"],
                ["Drone Footage", "—", "—", "Included"],
                ["Delivery Time", "2 weeks", "4 weeks", "4 weeks"],
              ].map((row, index) => (
                <tr 
                  key={index} 
                  className="border-b border-brand/10 hover:bg-gray-50 transition-colors duration-300"
                >
                  <td className="py-5 px-4 text-gray-700 font-medium">{row[0]}</td>
                  <td className="py-5 px-4 text-center text-gray-600">{row[1]}</td>
                  <td className="py-5 px-4 text-center text-brand-dark font-bold bg-brand/5">{row[2]}</td>
                  <td className="py-5 px-4 text-center text-gray-600">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Custom Quote Section - Dramatic CTA */}
      <div className="py-40 px-4 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-brand"
          style={{
            transform: `skewY(-3deg) translateY(${scrollY * 0.1}px)`,
            transformOrigin: "top left",
          }}
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 
            className="text-5xl md:text-7xl font-serif text-white mb-8 transform-gpu"
            style={{
              transform: `translateZ(100px) rotateX(${mousePosition.y * 0.2}deg)`,
              textShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            Looking for something <span className="italic">entirely unique?</span>
          </h2>
          
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            We also offer fully customized destination wedding packages. From Udaipur palaces to Kerala backwaters, we travel with you.
          </p>

          <Link 
            to="/contact" 
            className="group inline-flex items-center gap-4 bg-white text-brand-dark px-12 py-5 uppercase tracking-[0.3em] text-sm font-black overflow-hidden shadow-2xl hover:shadow-black/20 transition-all duration-500 hover:-translate-y-2 hover:scale-105"
          >
            <span className="relative z-10">Request a Custom Quote</span>
            <span className="transform group-hover:translate-x-2 transition-transform duration-300 text-xl">→</span>
          </Link>
        </div>
      </div>

      {/* Trust Badges */}
      <section className="py-20 bg-white border-t border-brand/10">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-12 opacity-60">
          {[
            "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=60"
          ].map((src, index) => (
            <div 
              key={index}
              className="w-32 h-16 grayscale hover:grayscale-0 transition-all duration-500 opacity-50 hover:opacity-100"
            >
              <img src={src} alt="Partner" className="w-full h-full object-contain" />
            </div>
          ))}
        </div>
      </section>

      {/* Footer Badge */}
      <div className="py-20 text-center bg-white">
        <div className="inline-block transform hover:scale-110 transition-transform duration-500">
          <p className="text-xs uppercase tracking-[0.5em] text-brand-dark font-black border-2 border-brand-dark/20 px-8 py-4">
            Est. 2026 • Premium Wedding Collective
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
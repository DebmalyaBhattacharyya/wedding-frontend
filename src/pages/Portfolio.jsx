import { useState, useEffect, useRef } from 'react';
import { Link } from '@tanstack/react-router';

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('All Works');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);
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

  const filters = ['All Works', 'Weddings', 'Pre-Weddings', 'Editorials', 'Receptions', 'Destination'];

  const portfolioImages = [
    { id: 1, category: "Weddings", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop", aspect: "aspect-[4/3]", title: "The Royal Affair", location: "Mumbai" },
    { id: 2, category: "Weddings", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop", aspect: "aspect-[3/4]", title: "Sacred Vows", location: "Delhi" },
    { id: 3, category: "Editorials", url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&auto=format&fit=crop", aspect: "aspect-[4/5]", title: "Vogue Bride", location: "Studio" },
    { id: 4, category: "Pre-Weddings", url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop", aspect: "aspect-square", title: "Golden Hour Love", location: "Goa" },
    { id: 5, category: "Weddings", url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop", aspect: "aspect-[3/4]", title: "Floral Dreams", location: "Jaipur" },
    { id: 6, category: "Editorials", url: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop", aspect: "aspect-[4/3]", title: "High Fashion", location: "Bangalore" },
    { id: 7, category: "Pre-Weddings", url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop", aspect: "aspect-[4/5]", title: "Beach Romance", location: "Kerala" },
    { id: 8, category: "Weddings", url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop", aspect: "aspect-square", title: "Midnight Magic", location: "Udaipur" },
    { id: 9, category: "Pre-Weddings", url: "https://images.unsplash.com/photo-1546824987-a006cda62df8?q=80&w=800&auto=format&fit=crop", aspect: "aspect-[3/4]", title: "Urban Love", location: "Pune" },
    { id: 10, category: "Editorials", url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop", aspect: "aspect-[4/3]", title: "Runway Bride", location: "Hyderabad" },
    { id: 11, category: "Weddings", url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop", aspect: "aspect-[3/4]", title: "Garden Ceremony", location: "Chennai" },
    { id: 12, category: "Pre-Weddings", url: "https://images.unsplash.com/photo-1606490225159-8ebcbce3544d?q=80&w=800&auto=format&fit=crop", aspect: "aspect-square", title: "Desert Romance", location: "Jaisalmer" },
    { id: 13, category: "Receptions", url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop", aspect: "aspect-[4/3]", title: "Grand Celebration", location: "Mumbai" },
    { id: 14, category: "Receptions", url: "https://images.unsplash.com/photo-1478146896981-b80c463ab360?q=80&w=800&auto=format&fit=crop", aspect: "aspect-[3/4]", title: "First Dance", location: "Delhi" },
    { id: 15, category: "Destination", url: "https://images.unsplash.com/photo-1544592744-5c587efac1c6?q=80&w=800&auto=format&fit=crop", aspect: "aspect-[4/5]", title: "Tuscan Dreams", location: "Italy" },
    { id: 16, category: "Destination", url: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=800&auto=format&fit=crop", aspect: "aspect-square", title: "Beach I Do", location: "Bali" },
    { id: 17, category: "Weddings", url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=800&auto=format&fit=crop", aspect: "aspect-[3/4]", title: "Traditional Elegance", location: "Kolkata" },
    { id: 18, category: "Editorials", url: "https://images.unsplash.com/photo-1550005809-91ad75fb315f?q=80&w=800&auto=format&fit=crop", aspect: "aspect-[4/3]", title: "Avant Garde", location: "Studio" },
  ];

  const featuredStories = [
    {
      title: "The Palace Wedding",
      couple: "Aditi & Rohan",
      date: "December 2025",
      image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1200&auto=format&fit=crop",
      desc: "A three-day celebration at the City Palace, Jaipur"
    },
    {
      title: "Beachside Romance",
      couple: "Sarah & Michael",
      date: "November 2025",
      image: "https://images.unsplash.com/photo-1544592744-5c587efac1c6?q=80&w=1200&auto=format&fit=crop",
      desc: "Intimate ceremony on the shores of Goa"
    },
    {
      title: "Urban Chic",
      couple: "Priya & Arjun",
      date: "October 2025",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop",
      desc: "Modern celebration in the heart of Mumbai"
    }
  ];

  const testimonials = [
    {
      text: "They captured moments we didn't even know happened. Every photo tells a story.",
      author: "Meera & Karan",
      role: "Wedding Clients",
      image: "https://images.unsplash.com/photo-1621621667797-e06afc217fb0?q=80&w=400&auto=format&fit=crop"
    },
    {
      text: "The attention to detail is unmatched. Our album is absolutely stunning.",
      author: "Lisa & David",
      role: "Destination Wedding",
      image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=400&auto=format&fit=crop"
    }
  ];

  const filteredImages = activeFilter === 'All Works' 
    ? portfolioImages 
    : portfolioImages.filter(img => img.category === activeFilter);

  return (
    <div className="overflow-x-hidden bg-white">
      {/* Hero Banner with 3D Depth */}
      <div 
        ref={heroRef}
        className="relative h-[80vh] flex items-center justify-center text-center px-4 overflow-hidden"
      >
        {/* Background Image with Parallax */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            transform: `translateY(${scrollY * 0.5}px) scale(1.1)`,
          }}
        >
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 blur-3xl"
              style={{
                width: `${300 + i * 100}px`,
                height: `${300 + i * 100}px`,
                left: `${10 + i * 15}%`,
                top: `${20 + i * 10}%`,
                animation: `float ${5 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
                transform: `translate3d(${mousePosition.x * (i + 1)}px, ${mousePosition.y * (i + 1)}px, 0)`,
              }}
            />
          ))}
        </div>

        <div className="relative z-20 max-w-5xl mx-auto">
          <span className="inline-block text-white font-black uppercase tracking-[0.5em] text-sm mb-8 border-b-2 border-white pb-2 animate-pulse">
            Our Work
          </span>
          
          <h1 
            className="text-6xl md:text-8xl lg:text-9xl font-serif text-white mb-8 leading-none transform-gpu"
            style={{
              transform: `translateZ(100px) rotateX(${mousePosition.y * 0.2}deg) rotateY(${mousePosition.x * 0.2}deg)`,
              transition: "transform 0.2s ease-out",
              textShadow: "0 30px 60px rgba(0,0,0,0.5)",
            }}
          >
            Featured <span className="text-white italic border-b-4 border-white/30">Portfolio</span>
          </h1>
          
          <p 
            className="text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed font-light transform-gpu drop-shadow-lg"
            style={{
              transform: `translateZ(75px)`,
            }}
          >
            A curated collection of our favorite moments. Every photograph is a unique love story, captured with elegance and authenticity.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Statistics Bar - FIXED: Better contrast with dark background */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: "500+", label: "Weddings" },
            { num: "50+", label: "Cities" },
            { num: "12", label: "Countries" },
            { num: "15+", label: "Awards" },
          ].map((stat, index) => (
            <div 
              key={index}
              className="group"
              style={{
                transform: `translateY(${Math.sin(scrollY * 0.01 + index) * 10}px)`,
              }}
            >
              <div className="text-5xl md:text-6xl font-serif font-bold mb-2 text-white group-hover:text-gray-300 transition-colors duration-500">
                {stat.num}
              </div>
              <div className="text-gray-400 uppercase tracking-[0.3em] text-xs font-bold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Filter Section - FIXED: Better contrast on white background */}
      <div className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">
            Browse by <span className="text-slate-600 italic">Category</span>
          </h2>
        </div>

        {/* Functional Filters - FIXED: Clear active state */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16 text-sm uppercase tracking-[0.2em] font-bold">
          {filters.map((filter) => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`relative px-6 py-3 transition-all duration-500 overflow-hidden group ${
                activeFilter === filter 
                  ? 'text-slate-900 bg-slate-100' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="relative z-10">{filter}</span>
              {activeFilter === filter && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-slate-900" />
              )}
            </button>
          ))}
        </div>

        {/* Masonry Grid with 3D Hover - FIXED: Better overlay contrast */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 perspective-1000">
          {filteredImages.length > 0 ? (
            filteredImages.map((img, index) => (
              <div 
                key={img.id} 
                className="w-full overflow-hidden break-inside-avoid group cursor-pointer bg-white shadow-lg hover:shadow-2xl transition-all duration-700 transform-gpu"
                style={{
                  transform: hoveredImage === img.id ? `translateZ(30px) rotateX(${mousePosition.y * 0.05}deg) rotateY(${mousePosition.x * 0.05}deg) scale(1.02)` : '',
                  opacity: Math.min(1, (scrollY - (index * 50)) / 500 + 0.5),
                  transition: "transform 0.3s ease-out, box-shadow 0.3s, opacity 0.5s",
                }}
                onMouseEnter={() => setHoveredImage(img.id)}
                onMouseLeave={() => setHoveredImage(null)}
                onClick={() => setSelectedImage(img)}
              >
                <div className={`w-full overflow-hidden ${img.aspect} relative`}>
                  <img 
                    src={img.url} 
                    alt={img.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <span className="text-white text-xs uppercase tracking-[0.3em] font-bold mb-2">{img.category}</span>
                    <h3 className="text-white font-serif text-2xl mb-1 drop-shadow-lg">{img.title}</h3>
                    <p className="text-gray-300 text-sm">{img.location}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-slate-600 py-10">No images found for this category.</p>
          )}
        </div>
      </div>

      {/* Featured Stories Section - FIXED: Better text contrast on images */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-serif text-slate-900 mb-6">
              Featured <span className="text-slate-600 italic">Stories</span>
            </h2>
            <p className="text-slate-600 text-xl max-w-2xl mx-auto">
              In-depth looks at our most memorable celebrations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredStories.map((story, index) => (
              <div
                key={index}
                className="group relative h-[600px] overflow-hidden cursor-pointer shadow-2xl"
                style={{
                  transform: `translateY(${scrollY * 0.05 * (index + 1)}px)`,
                }}
              >
                <img 
                  src={story.image} 
                  alt={story.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-white text-xs uppercase tracking-[0.3em] font-bold mb-2 block">{story.date}</span>
                  <h3 className="text-3xl font-serif text-white mb-2 drop-shadow-lg">{story.title}</h3>
                  <p className="text-white font-bold mb-3">{story.couple}</p>
                  <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {story.desc}
                  </p>
                  <div className="mt-4 w-12 h-1 bg-white group-hover:w-full transition-all duration-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Behind the Scenes Banner - FIXED: Better contrast */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.3}px) scale(1.2)`,
          }}
        >
          <img 
            src="https://images.unsplash.com/photo-1554048612-387768052bf7?q=80&w=2000&auto=format&fit=crop"
            alt="Behind the scenes"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/80" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-6 drop-shadow-lg">
            Behind the <span className="text-gray-300 italic">Lens</span>
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Every great shot requires patience, timing, and a deep understanding of human emotion. Our team brings decades of combined experience to your special day.
          </p>
          <div className="flex justify-center gap-8 text-white">
            <div className="text-center">
              <div className="text-3xl font-serif text-white mb-1">12</div>
              <div className="text-xs uppercase tracking-widest text-gray-300">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif text-white mb-1">8k</div>
              <div className="text-xs uppercase tracking-widest text-gray-300">Equipment Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif text-white mb-1">24h</div>
              <div className="text-xs uppercase tracking-widest text-gray-300">Turnaround</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - FIXED: Better card contrast */}
      <section className="py-32 px-4 max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-serif text-slate-900 text-center mb-20">
          Client <span className="text-slate-600 italic">Love</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-white p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border border-slate-100"
              style={{
                transform: `rotateX(${mousePosition.y * 0.05}deg) rotateY(${mousePosition.x * 0.05}deg)`,
              }}
            >
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-6xl text-slate-200 font-serif mb-6">"</div>
              <p className="text-xl text-slate-700 mb-6 leading-relaxed font-light">
                {testimonial.text}
              </p>
              <div className="border-t border-slate-200 pt-4">
                <p className="font-serif text-slate-900 text-lg">{testimonial.author}</p>
                <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram Feed Simulation - FIXED: Better contrast */}
      <section className="py-20 bg-slate-900">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-serif text-white mb-2">Follow Our Journey</h3>
          <p className="text-gray-400 uppercase tracking-[0.3em] text-xs font-bold">@weddingcollective</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-1">
          {[
            "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&auto=format&fit=crop&q=60"
          ].map((url, index) => (
            <div key={index} className="aspect-square overflow-hidden group cursor-pointer">
              <img 
                src={url} 
                alt="Instagram"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action - FIXED: Better contrast on brand color */}
      <div className="py-32 px-4 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-slate-900"
          style={{
            transform: `skewY(-3deg) translateY(${scrollY * 0.1}px)`,
            transformOrigin: "top left",
          }}
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 
            className="text-5xl md:text-6xl font-serif text-white mb-8 transform-gpu drop-shadow-lg"
            style={{
              transform: `translateZ(100px) rotateX(${mousePosition.y * 0.2}deg)`,
            }}
          >
            Ready to create your <span className="text-gray-300 italic">story?</span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Let us capture the magic of your wedding day. Limited dates available for 2026.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/vendors" 
              className="group bg-white text-slate-900 px-12 py-5 uppercase tracking-[0.3em] text-sm font-black hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105"
            >
              Browse Vendors
            </Link>
            <Link 
              to="/book" 
              className="group border-2 border-white text-white px-12 py-5 uppercase tracking-[0.3em] text-sm font-black hover:bg-white hover:text-slate-900 transition-all duration-500 hover:-translate-y-2 hover:scale-105"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </div>

      {/* Image Modal - FIXED: Better text contrast */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-5xl w-full transform-gpu"
            style={{
              transform: `rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)`,
            }}
          >
            <img 
              src={selectedImage.url} 
              alt={selectedImage.title}
              className="w-full h-auto max-h-[80vh] object-contain shadow-2xl"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8">
              <h3 className="text-3xl font-serif text-white mb-2 drop-shadow-lg">{selectedImage.title}</h3>
              <p className="text-gray-300 uppercase tracking-widest text-sm font-bold">{selectedImage.category} • {selectedImage.location}</p>
            </div>
            <button 
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Footer Badge - FIXED: Better contrast */}
      <div className="py-20 text-center bg-white">
        <div className="inline-block transform hover:scale-110 transition-transform duration-500">
          <p className="text-xs uppercase tracking-[0.5em] text-slate-900 font-black border-2 border-slate-900 px-8 py-4">
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
        @keyframes expand {
          from { width: 0; }
          to { width: 100%; }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .animate-expand {
          animation: expand 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, Star } from "lucide-react";
import CNavbar from "../../components/customer/CNavbar.jsx";
import Footer from "../../components/common/Footer.jsx";
import { places } from "../../data/places.js";

const CHome = () => {
  const navigate = useNavigate();

  const handlePlaceClick = (place) => {
    navigate(`/customer/resorts?location=${place}`);
  };

  return (
    <section className="min-h-screen bg-[#0A2647] text-white font-outfit">
      {/* Navbar */}
      <CNavbar />

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-10 md:py-25 bg-white mt-0">
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#0A2647]">
            Discover Your{" "}
            <span className="text-[#F5C518] drop-shadow-md">Perfect Stay</span>
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Experience the finest resorts with stunning views, luxurious rooms, and world-class facilities.
          </p>
          <button
            onClick={() => navigate("/customer/resorts")}
            className="mt-4 px-8 py-3 bg-[#0A2647] hover:bg-[#d4aa10] text-white font-semibold rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Explore Resorts <ArrowRight size={20} />
          </button>
        </div>

        <div className="mt-12 md:mt-0 md:w-1/2 flex justify-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-[6px] border-white">
            <video
              src="/videos/HeroVideo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-[900px] h-[500px] md:w-[900px] md:h-[480px] object-cover rounded-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-3xl"></div>
          </div>
        </div>
      </div>

      {/* Popular Destinations Section */}
      <section className="py-14 bg-white text-gray-800 overflow-hidden">
        <h2 className="text-3xl font-bold text-center mb-10 text-[#0A2647]">Popular Destinations</h2>
        <div className="scroll-container flex space-x-6 px-6 animate-scroll">
          {places.concat(places).map((p, i) => (
            <div
              key={i}
              onClick={() => handlePlaceClick(p.name)}
              className="min-w-[240px] h-[180px] bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer transition-all duration-500 border border-gray-100 group"
            >
              <div className="relative w-full h-full">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
        <style>
          {`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll {
              display: flex;
              animation: scroll 30s linear infinite;
              width: max-content;
            }
            .scroll-container:hover {
              animation-play-state: paused;
            }
          `}
        </style>
      </section>


      <Footer />
    </section>
  );
};

export default CHome;

import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
function Footer() {
  return (
    <footer className="bg-[#0A2647] text-gray-300 mt-12 pt-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-[#F5C518] font-bold text-lg mb-3">
              BookMyStay
            </h3>
            <p className="text-sm">
              Your trusted platform for booking the best resorts and hotels. We
              make your stay comfortable, memorable, and hassle-free.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#F5C518] font-bold text-lg mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/customer/resorts" className="hover:text-white">
                  Resorts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  About Us
                </a>
              </li>
              
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-[#F5C518] font-bold text-lg mb-3">
              Contact Us
            </h3>
            <ul className="space-y-2 text-sm">
              <li>📍 123 Resort Street, Bangalore, India</li>
              <li>📧 support@bookmystay.com</li>
              <li>📞 +91 98765 43210</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-[#F5C518] font-bold text-lg mb-3">Follow Us</h3>
            <div className="flex space-x-4 text-xl">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#F5C518] mt-8 pt-4 text-center text-sm">
          © 2025{" "}
          <span className="text-[#F5C518] font-semibold">BookMyStay</span> — All
          rights reserved.
        </div>
      </div>
      <br />
    </footer>
  );
}

export default Footer;

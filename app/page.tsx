"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import CountUp from "react-countup";
import { useEffect, useRef } from "react";
import { 
  siGoogle,
  siAndroid,
  siAmazon, 
  siApple, 
  siMeta, 
  siNetflix, 
  siIntel,
  siSalesforce,
  siAccenture,
  siSap,
  siInfosys,
  siCognizant,
  siWipro,
  siTcs,
  siCisco,
  siDell
} from "simple-icons";
import Link from "next/link";

export default function Home() {
  const logosRef = useRef<HTMLDivElement>(null);
  const duplicateLogosRef = useRef<HTMLDivElement>(null);
  const isResetting = useRef(false);

  useEffect(() => {
    const scrollLogos = () => {
      if (logosRef.current && duplicateLogosRef.current && !isResetting.current) {
        // Get the width of a single set of logos
        const scrollWidth = duplicateLogosRef.current.offsetWidth;
        
        // Increment scroll position
        logosRef.current.scrollLeft += 1;
        
        // When we've scrolled through the first set of logos
        if (logosRef.current.scrollLeft >= scrollWidth) {
          // Prevent scroll events during reset
          isResetting.current = true;
          
          // Remove smooth scrolling temporarily to avoid visual jump
          logosRef.current.style.scrollBehavior = 'auto';
          
          // Reset to the beginning
          logosRef.current.scrollLeft = 0;
          
          // Restore smooth scrolling after a short delay
          setTimeout(() => {
            if (logosRef.current) {
              logosRef.current.style.scrollBehavior = 'smooth';
            }
            isResetting.current = false;
          }, 10);
        }
      }
    };

    const interval = setInterval(scrollLogos, 30);
    return () => clearInterval(interval);
  }, []);

  // Convert Simple Icons SVG strings to data URLs
  const svgToDataURL = (svg: string, color: string): string => {
    // Inject the color into the SVG
    const coloredSvg = svg.replace('<svg', `<svg fill="${color}"`);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(coloredSvg)}`;
  };

  // Create logo data objects with SVG and color information
  const logos = [
    { icon: siGoogle, color: "#4285F4", name: "Google" },
    { icon: siAndroid, color: "#3DDC84", name: "Android" },
    { icon: siAmazon, color: "#FF9900", name: "Amazon" },
    { icon: siApple, color: "#000000", name: "Apple" },
    { icon: siMeta, color: "#0668E1", name: "Meta" },
    { icon: siNetflix, color: "#E50914", name: "Netflix" },
    { icon: siIntel, color: "#0071C5", name: "Intel" },
    { icon: siSalesforce, color: "#00A1E0", name: "Salesforce" },
    { icon: siAccenture, color: "#A100FF", name: "Accenture" },
    { icon: siSap, color: "#0FAAFF", name: "SAP" },
    { icon: siInfosys, color: "#007CC3", name: "Infosys" },
    { icon: siCognizant, color: "#1A4CA1", name: "Cognizant" },
    { icon: siWipro, color: "#341C53", name: "Wipro" },
    { icon: siTcs, color: "#000000", name: "TCS" },
    { icon: siCisco, color: "#1BA0D7", name: "Cisco" },
    { icon: siDell, color: "#007DB8", name: "Dell" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="w-full border-b py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-primary">Joffers</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </nav>
          <div>
            <Button className="rounded-full" variant="outline" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button className="rounded-full ml-2" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">AI-Powered Recruitment</p>
            <h1 className="text-5xl font-bold leading-tight">
              Find Top Talent,<br />
              Effortlessly with AI.
            </h1>
            <p className="text-xl text-slate-600">
              Joffers connects companies with top student talent. 
              Streamline your recruiting process and find the perfect candidates.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Button size="lg" className="rounded-full">Start Hiring Now</Button>
              <Button size="lg" variant="outline" className="rounded-full">Schedule Demo</Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative h-[400px] w-full">
              <div className="absolute inset-0 bg-blue-100 rounded-lg opacity-50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-lg font-medium text-slate-500">Hero Image Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-14 border-t border-gray-200">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-between items-center text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="w-full md:w-1/4 p-4 md:p-6">
              <div className="text-4xl font-bold">
                <CountUp end={4000000} separator="." duration={5} />
              </div>
              <div className="text-gray-600 mt-1">Users</div>
            </div>
            <div className="w-full md:w-1/4 p-4 md:p-6">
              <div className="text-4xl font-bold">
                <CountUp end={600} duration={4.5} />
              </div>
              <div className="text-gray-600 mt-1">Companies</div>
            </div>
            <div className="w-full md:w-1/4 p-4 md:p-6">
              <div className="text-4xl font-bold">#1</div>
              <div className="text-gray-600 mt-1">Student Job Board</div>
            </div>
            <div className="w-full md:w-1/4 p-4 md:p-6">
              <div className="text-4xl font-bold">
                <CountUp end={43700} separator="." duration={5.5} />
              </div>
              <div className="text-gray-600 mt-1">Jobs Placed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Logos Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <h3 className="text-center text-lg font-medium text-gray-500 mb-10">Trusted by leading tech and consulting companies worldwide</h3>
          
          <div className="relative overflow-hidden">
            <div 
              ref={logosRef}
              className="flex items-center overflow-x-auto hide-scrollbar whitespace-nowrap px-8"
              style={{ scrollBehavior: 'smooth' }}
            >
              {/* First set of logos */}
              <div ref={duplicateLogosRef} className="flex items-center">
                {logos.map((logo, index) => (
                  <div key={`first-${index}`} className="flex items-center justify-center mx-4 h-20">
                    <div className="w-24 h-16 relative flex items-center justify-center">
                      <img 
                        src={svgToDataURL(logo.icon.svg, logo.color)}
                        alt={logo.name} 
                        width={80} 
                        height={40} 
                        className="object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Duplicate logos for seamless scroll */}
              <div className="flex items-center">
                {logos.map((logo, index) => (
                  <div key={`second-${index}`} className="flex items-center justify-center mx-4 h-20">
                    <div className="w-24 h-16 relative flex items-center justify-center">
                      <img 
                        src={svgToDataURL(logo.icon.svg, logo.color)}
                        alt={logo.name} 
                        width={80} 
                        height={40} 
                        className="object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient fades on sides to indicate scrolling */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Companies Choose Joffers</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our platform offers powerful features to help you find the best student talent.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Candidate Matching</h3>
              <p className="text-slate-600">
                Our AI-powered matching system helps you find candidates that align with your company culture and requirements.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 0 1 0 1.953l-7.108 4.062A1.125 1.125 0 0 1 3 16.81V8.688ZM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 0 1 0 1.953l-7.108 4.062a1.125 1.125 0 0 1-1.683-.977V8.688Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Streamlined Interviewing</h3>
              <p className="text-slate-600">
                Manage the entire interview process in one place, from scheduling to feedback collection.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics & Insights</h3>
              <p className="text-slate-600">
                Get data-driven insights into your recruiting process and make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Recruiting Process?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join hundreds of companies that have improved their hiring with Joffers.
          </p>
          <Button size="lg" className="rounded-full bg-white text-blue-600 hover:bg-gray-100">
            Get Started for Free
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Joffers</h3>
              <p className="text-slate-400">
                Connecting companies with top student talent.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Twitter</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>© {new Date().getFullYear()} Joffers. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

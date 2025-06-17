import React from 'react'
import { Link, NavLink } from "react-router-dom"
import {Youtube} from "lucide-react"

export default function Footer() {
    return (
        // <footer className="px-4 divide-y bg-orange-50 text-gray-800">
        //     <div className='flex justify-center items-center p-8'>
        //         <div>
        //             <div className='flex justify-center items-center'>
        //             <img className='h-16' src="/eazzy.png" alt="logo" />
        //             </div>
        //             <div className='mt-10'>
        //                 <Link to="about-us"><p className='text-center text-lg font-bold'>About Us</p></Link>
        //                 <Link to="pricing"><p className='text-center text-lg font-bold mt-2'>Pricing</p></Link>
        //                 <Link to="terms-and-conditions"><p className='text-center text-lg font-bold mt-2'>Terms & Conditions</p></Link>
        //                 <Link to="refund-policy"><p className='text-center text-lg font-bold mt-2'>Refund & Cancellation Policy</p></Link>
        //                 <Link to="privacy-policy"><p className='text-center text-lg font-bold mt-2'>Privacy Policy</p></Link>
        //                 <Link to="shipping-policy"><p className='text-center text-lg font-bold mt-2'>Shipping Policy</p></Link>
        //                 <Link to="cookie-policy"><p className='text-center text-lg font-bold mt-2'>Cookie Policy</p></Link>
        //                 <Link to="contact-us"><p className='text-center text-lg font-bold mt-2'>Contact Us</p></Link>

        //             </div>
        //         </div>
        //     </div>
        //     <div className="py-6 text-sm text-center text-gray-700">©2024 Company Co. All rights reserved.</div>
        // </footer>


        <footer className="bg-gray-900 text-gray-300 py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Eazzy</h3>
              <ul className="space-y-2">
                <li><a href="about-us" className="hover:text-white transition-colors duration-200">About Us</a></li>
                {/* <li><a href="pricing" className="hover:text-white transition-colors duration-200">Pricing</a></li> */}
                <li><a href="contact-us" className="hover:text-white transition-colors duration-200">Contact Us</a></li>
                <li><a href="terms-and-conditions" className="hover:text-white transition-colors duration-200">Terms & Conditions</a></li>
              </ul>
            </div>
            {/* <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Roadmap</a></li>
              </ul>
            </div> */}
            {/* <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Guides</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">API Reference</a></li>
              </ul>
            </div> */}
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="privacy-policy" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="shipping-policy" className="hover:text-white transition-colors duration-200">Shipping Policy</a></li>
                <li><a href="cookie-policy" className="hover:text-white transition-colors duration-200">Cookie Policy</a></li>
                <li><a href="refund-policy" className="hover:text-white transition-colors duration-200">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <p>© 2025 Eazzy. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="https://www.youtube.com/@eazzystore/" className="text-gray-400 hover:text-white">
                <span className="sr-only">Youtube</span>
                <Youtube className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/eazzystore2025/" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              {/* <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a> */}
            </div>
          </div>
        </div>
      </footer>
    );
}

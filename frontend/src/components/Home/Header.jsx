import { Fragment, useState } from 'react'
import {
    Dialog,
    DialogPanel,
    PopoverGroup,
} from '@headlessui/react'
import {
    Bars3Icon,
    ChevronDownIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../store/auth'

function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [open, setOpen] = useState(false);
    const { token } = useAuth()

    return (
        <header className="bg-white shadow-sm">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link to="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Eazzy</span>
                        <img className="h-12 w-auto" src="/eazzy.png" alt="" />
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-orange-700"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                    <NavLink to="/" className={({ isActive }) => `text-sm font-semibold leading-6 ${isActive ? "text-orange-600" : " text-zinc-900"}`}>
                        Home
                    </NavLink>
                    {/* <NavLink to="pricing" className={({ isActive }) => `text-sm font-semibold leading-6 ${isActive ? "text-orange-600" : " text-zinc-900"}`}>
                        Pricing
                    </NavLink> */}
                    <NavLink to="terms-and-conditions" className={({ isActive }) => `text-sm font-semibold leading-6 ${isActive ? "text-orange-600" : " text-zinc-900"}`}>
                        Terms & Conditions
                    </NavLink>
                    {/* <div data-theme="light" className="dropdown relative">
                        <div tabIndex={0} role="button" className="text-sm font-semibold leading-6 text-zinc-900 flex items-center">Policies <ChevronDownIcon className='h-5 w-5' /></div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                            <li><NavLink to="privacy-policy" className={({ isActive }) => `text-sm font-semibold leading-6 ${isActive ? "text-orange-600" : " text-zinc-900"}`}>
                                Privacy Policy
                            </NavLink></li>
                            <li><NavLink to="refund-policy" className={({ isActive }) => `text-sm font-semibold leading-6 ${isActive ? "text-orange-600" : " text-zinc-900"}`}>
                                Refund Policy
                            </NavLink></li>
                            <li><NavLink to="shipping-policy" className={({ isActive }) => `text-sm font-semibold leading-6 ${isActive ? "text-orange-600" : " text-zinc-900"}`}>
                                Shipping Policy
                            </NavLink></li>
                            <li><NavLink to="cookie-policy" className={({ isActive }) => `text-sm font-semibold leading-6 ${isActive ? "text-orange-600" : " text-zinc-900"}`}>
                                Cookie Policy
                            </NavLink></li>
                        </ul>
                    </div> */}
                    <div className="relative inline-block text-left">
                        <button
                            onClick={() => setOpen(!open)}
                            className="inline-flex items-center text-sm font-semibold leading-6 text-zinc-900"
                        >
                            Policies
                            <ChevronDownIcon className="h-5 w-5 ml-1" />
                        </button>

                        {open && (
                            <ul className="absolute mt-2 right-0 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2 space-y-1">
                                <li>
                                    <NavLink
                                        to="/privacy-policy"
                                        className={({ isActive }) =>
                                            `block px-4 py-2 text-sm font-semibold rounded-md hover:bg-zinc-100 ${isActive ? 'text-orange-600' : 'text-zinc-900'
                                            }`
                                        }
                                    >
                                        Privacy Policy
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/refund-policy"
                                        className={({ isActive }) =>
                                            `block px-4 py-2 text-sm font-semibold rounded-md hover:bg-zinc-100 ${isActive ? 'text-orange-600' : 'text-zinc-900'
                                            }`
                                        }
                                    >
                                        Refund Policy
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/shipping-policy"
                                        className={({ isActive }) =>
                                            `block px-4 py-2 text-sm font-semibold rounded-md hover:bg-zinc-100 ${isActive ? 'text-orange-600' : 'text-zinc-900'
                                            }`
                                        }
                                    >
                                        Shipping Policy
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/cookie-policy"
                                        className={({ isActive }) =>
                                            `block px-4 py-2 text-sm font-semibold rounded-md hover:bg-zinc-100 ${isActive ? 'text-orange-600' : 'text-zinc-900'
                                            }`
                                        }
                                    >
                                        Cookie Policy
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </div>
                    <NavLink to="contact-us" className={({ isActive }) => `text-sm font-semibold leading-6 ${isActive ? "text-orange-600" : " text-zinc-900"}`}>
                        Contact Us
                    </NavLink>
                    <NavLink to="about-us" className={({ isActive }) => `text-sm font-semibold leading-6 ${isActive ? "text-orange-600" : " text-zinc-900"}`}>
                        About Us
                    </NavLink>
                </PopoverGroup>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    {token ?
                        <Link to="/seller/dashboard" className="text-sm font-semibold leading-6 text-zinc-900">
                            Account <span aria-hidden="true">&rarr;</span>
                        </Link>
                        :
                        <Link to="signup" className="text-sm font-semibold leading-6 text-orange-600">
                            Sign Up <span aria-hidden="true">&rarr;</span>
                        </Link>
                    }
                </div>
            </nav>
            <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="fixed inset-0 z-10" />
                <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-orange-900/10">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                className="h-10 w-auto"
                                src="/eazzy.png"
                                alt=""
                            />
                        </Link>
                        <button
                            type="button"
                            className="-m-2.5 rounded-md p-2.5 text-orange-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-orange-500/10">
                            <div className="space-y-2 py-6">
                                {/* <Link
                                    to="pricing"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-orange-50"
                                >
                                    <button onClick={() => setMobileMenuOpen(false)}>Pricing</button>
                                </Link> */}
                                <Link
                                    to="terms-and-conditions"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-orange-50"
                                >
                                    <button onClick={() => setMobileMenuOpen(false)}>Terms & Conditions</button>
                                </Link>
                                <Link
                                    to="shipping-policy"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-orange-50"
                                >
                                    <button onClick={() => setMobileMenuOpen(false)}>Shipping Policy</button>
                                </Link>
                                <Link
                                    to="refund-policy"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-orange-50"
                                >
                                    <button onClick={() => setMobileMenuOpen(false)}>Refund Policy</button>
                                </Link>
                                <Link
                                    to="cookie-policy"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-orange-50"
                                >
                                    <button onClick={() => setMobileMenuOpen(false)}>Cookie Policy</button>
                                </Link>
                                <Link
                                    to="contact-us"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-orange-50"
                                >
                                    <button onClick={() => setMobileMenuOpen(false)}>Contact Us</button>
                                </Link>
                                <Link
                                    to="about-us"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-orange-50"
                                >
                                    <button onClick={() => setMobileMenuOpen(false)}>About Us</button>
                                </Link>
                            </div>
                            <div className="py-6">
                                {token ?
                                    <Link
                                        to="/seller/dashboard"
                                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-orange-50"
                                    >
                                        <button onClick={() => setMobileMenuOpen(false)}>
                                            Account
                                        </button>
                                    </Link>
                                    : <>
                                        <Link
                                            to="login"
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-orange-600 hover:bg-orange-50"
                                        >
                                            <button onClick={() => setMobileMenuOpen(false)}>Log in</button>
                                        </Link>
                                        <Link
                                            to="signup"
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base bg-orange-600 font-semibold leading-7 text-orange-50"
                                        >
                                            <button onClick={() => setMobileMenuOpen(false)}>Sign Up</button>
                                        </Link>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}

export default Header;
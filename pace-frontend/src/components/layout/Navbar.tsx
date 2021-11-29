import React from 'react';
import { Disclosure } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import paceLogo from '../../assets/svg/pace-logo.svg';
import { Link } from 'react-router-dom';
import DynamicHeroIcon from '../common/DynamicHeroIcon';
import ProfileButton from '../common/ProfileButton';
import { AuthRoutes } from '../../routes/routes.types';

const navigation = [{ name: 'Projects', href: AuthRoutes.Dashboard, current: true }];

const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ');
};

const Navbar: React.FC = ({}) => {
    return (
        <Disclosure as="nav" className="bg-white fixed w-screen z-50 shadow-md">
            {({ open }) => (
                <>
                    <div className="max-w-screen-2xl mx-auto px-2 sm:px-6 lg:px-8">
                        <div className="relative flex items-center justify-between h-16">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button*/}
                                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                                <Link to={AuthRoutes.Dashboard}>
                                    <div className="flex-shrink-0 flex items-center">
                                        <img className="mx-auto h-5 w-auto" src={paceLogo} alt="Pace Logo" />
                                    </div>
                                </Link>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <button
                                    type="button"
                                    className="p-1 rounded-full hover:bg-blue-100 p-1.5 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                                >
                                    <span className="sr-only">View notifications</span>
                                    <DynamicHeroIcon
                                        icon="BellIcon"
                                        className="h-6 w-6 hover:text-blue-500 text-gray-300 "
                                    />
                                </button>

                                <ProfileButton />
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navigation.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className={classNames(
                                        item.current
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'block px-3 py-2 rounded-md text-base font-medium',
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
};

export default Navbar;

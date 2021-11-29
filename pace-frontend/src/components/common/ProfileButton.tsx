import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { classNames } from '../../utils/formatting';
import * as authThunks from '../../store/auth/auth.thunk';
import { useDispatch, useSelector } from 'react-redux';
import { AuthThunkDispatcher } from '../../store/auth/auth.types';
import { userSelector } from '../../store/auth/auth.selectors';
import ProfilePicture from './ProfilePicture';
import { Link } from 'react-router-dom';
import { AuthRoutes } from '../../routes/routes.types';

const ProfileButton: React.FC = ({}) => {
    const thunkDispatch = useDispatch<AuthThunkDispatcher>();
    const handleLogOut = async () => {
        await thunkDispatch(authThunks.logout());
    };
    const user = useSelector(userSelector);
    if (!user) return null;
    return (
        <>
            {/* Profile dropdown */}
            <Menu as="div" className="ml-3 relative">
                <div>
                    <Menu.Button className="flex rounded-full hover:bg-blue-100 rounded-lg hover:bg-blue-100 p-1">
                        <ProfilePicture avatarColor={user.avatarColor} name={user.name} photoUrl={user.photoUrl} />
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                            {({ active }) => (
                                <Link to={AuthRoutes.UserSettings}>
                                    <button
                                        className={classNames(
                                            active ? 'bg-blue-100 text-blue-500' : '',
                                            'block m-0 w-full text-left px-4 py-2 text-sm text-gray-700',
                                        )}
                                    >
                                        Profile settings
                                    </button>
                                </Link>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={handleLogOut}
                                    className={classNames(
                                        active ? 'bg-red-100 text-red-600 ' : '',
                                        'block w-full text-left px-4 py-2 text-sm text-red-600 w-100',
                                    )}
                                >
                                    Sign out
                                </button>
                            )}
                        </Menu.Item>
                    </Menu.Items>
                </Transition>
            </Menu>
        </>
    );
};

export default ProfileButton;

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';

const Nav = () => {
  const { data: session } = useSession();
  // todo : fix the typing
  const [providers, setProviders] = useState<ProviderMap | null>(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  return (
    <nav className='flex-between w-full mb-16 pt-3'>
      {/* Logo */}
      <Link href='/' className='flex gap-2 flex-center'>
        <Image
          src='/assets/images/logo.svg'
          alt='Wilt logo'
          width={30}
          height={30}
          className='object-contain'
        />
        <p className='logo_text'>WILT</p>
      </Link>

      {/* Desktop navigation */}
      <div className='sm:flex hidden'>
        {session?.user ? (
          <div className='flex gap-3 md:gap-5'>
            <Link href='/create-hint' className='black_btn'>
              Create Post
            </Link>
            <button type='button' onClick={signOut} className='outline_btn'>
              {' '}
              Sign Out{' '}
            </button>
            <Link href='/profile'>
              <Image
                src={
                  session?.user?.image
                    ? session.user.image
                    : '/assets/images/raccoon.png'
                }
                width={37}
                height={37}
                className='rounded-full'
                alt='profil image'
              />
            </Link>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map(provider => (
                <button
                  type='button'
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className='black_btn'>
                  {' '}
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>

      {/* Desktop navigation */}
      <div className='sm:hidden flex relative'>
        {session?.user ? (
          <div className='flex'>
            <Image
              src={session?.user.image}
              width={37}
              height={37}
              className='rounded-full'
              alt='profil image'
              onClick={() => setToggleDropdown(prev => !prev)}
            />
            {toggleDropdown && (
              <div className='dropdown'>
                <Link
                  href='/profile'
                  className='dropdown_link'
                  onClick={() => setToggleDropdown(false)}>
                  My Profile
                </Link>
                <Link
                  href='/create-hint'
                  className='dropdown_link'
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}>
                  Create a tips
                </Link>
                <button
                  type='button'
                  onClick={() => setToggleDropdown(false)}
                  className='my-5 w-full black_btn'>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map(provider => (
                <button
                  type='button'
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className='black_btn'>
                  {' '}
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;

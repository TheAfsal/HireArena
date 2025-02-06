import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const aboutLinks = [
  { name: 'Companies', href: '/companies' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Terms', href: '/terms' },
  { name: 'Advice', href: '/advice' },
  { name: 'Privacy Policy', href: '/privacy' },
];

const resourceLinks = [
  { name: 'Help Docs', href: '/help' },
  { name: 'Guide', href: '/guide' },
  { name: 'Updates', href: '/updates' },
  { name: 'Contact Us', href: '/contact' },
];

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full" />
            <span className="text-xl font-bold">HireArena</span>
          </div>
          <p className="text-gray-400">
            Great platform for the job seeker that passionate about startups.
            Find your dream job easier.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">About</h3>
          <ul className="space-y-3">
            {aboutLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Resources</h3>
          <ul className="space-y-3">
            {resourceLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Get job notifications</h3>
          <p className="text-gray-400 mb-4">
            The latest job news, articles, sent to your inbox weekly.
          </p>
          <form className="space-y-2">
            <Input
              type="email"
              placeholder="Email Address"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
            />
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

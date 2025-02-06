import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

function Hero() {
  return (
    <div className="w-full bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-semibold">
                HireArena
              </Link>
              <div className="hidden md:flex gap-6">
                <a href="/jobs" className="text-gray-600 hover:text-gray-900">
                  Find Jobs
                </a>
                <a
                  href="/companies"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Browse Companies
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost">Login</Button>
              <Button className="bg-[#6366F1] hover:bg-[#5558DD]">
                Sign Up
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Discover
            <br />
            more than
            <br />
            <span className="text-[#6366F1]">5000+ Jobs</span>
          </h1>
          <div className="relative">
            <div className="absolute bottom-0 left-0 w-48 h-3 bg-[#6366F1]/20 -z-10 translate-y-1" />
          </div>
          <p className="text-gray-600 mt-6 mb-8">
            Great platform for the job seeker that searching for new career
            heights and passionate about startups.
          </p>

          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input placeholder="Job title or keyword" className="pl-10" />
              </div>
              <div className="md:w-48">
                <Select>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <SelectValue placeholder="Select location" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="florence">Florence, Italy</SelectItem>
                    <SelectItem value="rome">Rome, Italy</SelectItem>
                    <SelectItem value="milan">Milan, Italy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-[#6366F1] hover:bg-[#5558DD]">
                Search my job
              </Button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Popular: UI Designer, UX Researcher, Android, Admin
          </div>
        </div>

        <div className="mt-24">
          <p className="text-sm text-gray-500 mb-8">Companies we helped grow</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
            {/* <Image
              src="https://cdn.photographylife.com/wp-content/uploads/2014/09/Nikon-D750-Image-Samples-2.jpg"
              alt="Vodafone"
              width={120}
              height={40}
              className="grayscale"
            />
            <Image
              src="https://cdn.photographylife.com/wp-content/uploads/2014/09/Nikon-D750-Image-Samples-2.jpg"
              alt="Intel"
              width={120}
              height={40}
              className="grayscale"
            />
            <Image
              src="https://cdn.photographylife.com/wp-content/uploads/2014/09/Nikon-D750-Image-Samples-2.jpg"
              alt="Tesla"
              width={120}
              height={40}
              className="grayscale"
            />
            <Image
              src="https://cdn.photographylife.com/wp-content/uploads/2014/09/Nikon-D750-Image-Samples-2.jpg"
              alt="AMD"
              width={120}
              height={40}
              className="grayscale"
            />
            <Image
              src="https://cdn.photographylife.com/wp-content/uploads/2014/09/Nikon-D750-Image-Samples-2.jpg"
              alt="Talkit"
              width={120}
              height={40}
              className="grayscale"
            /> */}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Hero;

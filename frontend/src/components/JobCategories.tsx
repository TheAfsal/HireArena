import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Category {
  name: string;
  jobs: number;
  icon: string;
  href: string;
}

const categories: Category[] = [
  {
    name: 'Design', jobs: 235, icon: '✕', href: '/jobs/design',
  },
  {
    name: 'Sales', jobs: 756, icon: '◷', href: '/jobs/sales',
  },
  {
    name: 'Marketing', jobs: 140, icon: '📢', href: '/jobs/marketing',
  },
  {
    name: 'Finance', jobs: 326, icon: '💰', href: '/jobs/finance',
  },
  {
    name: 'Technology', jobs: 436, icon: '💻', href: '/jobs/technology',
  },
  {
    name: 'Engineering', jobs: 542, icon: '</>', href: '/jobs/engineering',
  },
  {
    name: 'Business', jobs: 211, icon: '💼', href: '/jobs/business',
  },
  {
    name: 'Human Resource', jobs: 346, icon: '👥', href: '/jobs/hr',
  },
];

function JobCategories() {
  return (

    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">
          Explore by
          {' '}
          <span className="text-blue-600">category</span>
        </h2>
        <Link
          href="/jobs"
          className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          Show all jobs
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="p-6 border rounded-lg hover:border-blue-600 transition-colors group"
          >
            <div className="text-2xl mb-3">{category.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
            <p className="text-gray-600 flex items-center gap-1">
              {category.jobs}
              {' '}
              jobs available

              {category.jobs}
              {' '}
              jobs available

              {category.jobs}
              {' '}
              jobs available
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-16 bg-blue-600 rounded-2xl p-8 text-white flex flex-col lg:flex-row items-center justify-between">
        <div className="mb-8 lg:mb-0">
          <h2 className="text-4xl font-bold mb-4">
            Start posting
            <br />
            jobs today
          </h2>
          <p className="mb-6">Start posting jobs for only $10.</p>
          <button type="button" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Sign Up For Free
          </button>
        </div>
        <div className="w-full lg:w-1/2">
          {/* <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-14%20113254-t0rTPgEb70QESlb4OGnZofU53Yupce.png"
            alt="Job posting dashboard"
            className="rounded-lg shadow-lg w-full"
          /> */}
        </div>
      </div>
    </div>
  );
}

export default JobCategories;

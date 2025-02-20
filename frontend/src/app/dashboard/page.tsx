import React from 'react';
import Hero from './components/Hero';
import JobCategories from './components/JobCategories';
import FeaturedJobs from './components/FeaturedJobs';
import Footer from './components/Footer';
import LatestJobs from './components/LatestJobs';

const page = () => (
  <div>
    <Hero />
    <JobCategories />
    <FeaturedJobs />
    <LatestJobs />
    <Footer />
  </div>
);

export default page;

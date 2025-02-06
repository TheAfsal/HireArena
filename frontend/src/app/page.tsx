import FeaturedJobs from "@/components/FeaturedJobs";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import JobCategories from "@/components/JobCategories";
import LatestJobs from "@/components/LatestJobs";
import React from "react";
const page = () => {
  return (
    <>
      <Hero />
      <JobCategories />
      <FeaturedJobs />
      <LatestJobs />
      <Footer />
      <Footer />
    </>
  );
};

export default page;

import FeaturedJobs from "@/components/FeaturedJobs";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import JobCategories from "@/components/JobCategories";
import LatestJobs from "@/components/LatestJobs";
import React from "react";

const page = () => {
  return (
    <div className="bg-background h-screen">
      <Hero />
      {/* <JobCategories /> */}
      {/* <FeaturedJobs /> */}
      {/* <LatestJobs /> */}
      <Footer />
    </div>
  );
};

export default page;

import React from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NavigationBar from "./NavigationBar";
import Image from "next/image";
import { Button } from "./ui/button";

function Hero() {
  return (
    <>
      <NavigationBar />
      <div className="w-full">
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-secondary">
              Discover
              <br />
              more than 
              <br />
              <span className="text-[#26a4ff]">5000+ Jobs</span>
            </h1>
            <div className="relative">
              <div className="absolute bottom-0 left-0 w-48 h-3 bg-[#6366F1]/20 -z-10 translate-y-1" />
            </div>
            <p className="text-text-content mt-6 mb-8">
              Great platform for the job seeker that searching for new career
              heights and passionate about startups.
            </p>
            {/* <div className="bg-white rounded-sm shadow-lg p-4 text-black">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative items-center">
                  <Search className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
                  <Input placeholder="Job title or keyword" className="pl-10" />
                </div>
                <div className="md:w-48">
                  <Select>
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 " />
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
                <Button className="bg-primary text-white hover:bg-[#5558DD]">
                  Search my job
                </Button>
              </div>
            </div> */}

            <div className="mt-4 text-sm text-text-content">
              Popular: UI Designer, UX Researcher, Android, Admin
            </div>
          </div>

          <div className="mt-24">
            <p className="text-sm text-text-content mb-8">
              Companies we helped grow
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
              <Image
                src="/vodafone.png"
                alt="Vodafone"
                width={120}
                height={40}
                className="grayscale"
              />
              <Image
                src="/intel.png"
                alt="Intel"
                width={120}
                height={40}
                className="grayscale"
              />
              <Image
                src="/tesla.png"
                alt="Tesla"
                width={120}
                height={40}
                className="grayscale"
              />
              <Image
                src="/amd.png"
                alt="AMD"
                width={120}
                height={40}
                className="grayscale"
              />
              <Image
                src="/talkit.png"
                alt="Talkit"
                width={120}
                height={40}
                className="grayscale"
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Hero;

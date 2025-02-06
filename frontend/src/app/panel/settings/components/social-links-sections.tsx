"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import React, { useState } from "react";

const SocialLinksSections = () => {
  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    twitter: "",
    facebook: "",
    linkedin: "",
    youtube: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(socialLinks);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSocialLinks({
      ...socialLinks,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <TabsContent value="social">
      <div className="mx-auto p-6">
        <div className="w-full space-y-6 flex">
          <div className="w-3/12">
            <h2 className="text-xl font-semibold text-gray-900">
              Basic Information
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Add elsewhere links to your company profile. You can add only
              username without full https links.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4 mx-10">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="instagram"
                  className="text-sm font-medium text-gray-700 block mb-1"
                >
                  Instagram
                </label>
                <Input
                  id="instagram"
                  name="instagram"
                  placeholder="https://www.instagram.com/nomad/"
                  value={socialLinks.instagram}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="twitter"
                  className="text-sm font-medium text-gray-700 block mb-1"
                >
                  Twitter
                </label>
                <Input
                  id="twitter"
                  name="twitter"
                  placeholder="https://twitter.com/nomad/"
                  value={socialLinks.twitter}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="facebook"
                  className="text-sm font-medium text-gray-700 block mb-1"
                >
                  Facebook
                </label>
                <Input
                  id="facebook"
                  name="facebook"
                  placeholder="https://web.facebook.com/nomad/"
                  value={socialLinks.facebook}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="linkedin"
                  className="text-sm font-medium text-gray-700 block mb-1"
                >
                  LinkedIn
                </label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  placeholder="Enter your LinkedIn address"
                  value={socialLinks.linkedin}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="youtube"
                  className="text-sm font-medium text-gray-700 block mb-1"
                >
                  Youtube
                </label>
                <Input
                  id="youtube"
                  name="youtube"
                  placeholder="Enter your youtube address"
                  value={socialLinks.youtube}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </TabsContent>
  );
};

export default SocialLinksSections;

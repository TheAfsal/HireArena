"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import {
  List,
  ImageIcon,
  Bold,
  Italic,
  AlignLeft,
  Link2,
  Upload,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const OverviewSection = () => {
  const [locations, setLocations] = useState(["England", "Japan", "Australia"]);
  const [techStack, setTechStack] = useState(["HTML 5", "CSS 3", "Javascript"]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // const onSubmit = async (data: ProfileFormValues) => {
  //   const formData = new FormData();
  //   formData.append("fullName", data.fullName);
  //   formData.append("phone", data.phone);
  //   formData.append("email", data.email);
  //   formData.append("dob", data.dob.toISOString());
  //   formData.append("gender", data.gender);
  //   formData.append("image", userProfileData!.image);
  //   formData.append("profileImage", file!);

  //   try {
  //     const response = await updateJobSeekerProfile(formData);
  //     console.log(response);
  //     toast.success("Profile updated successfully");
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Failed to update profile");
  //   }
  // };

  return (
    <TabsContent value="overview">
      <div className="mx-auto p-6">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Basic Information
            </h2>
            <p className="text-sm text-gray-500">
              This is company information that you can update anytime.
            </p>
          </div>

          <Separator />

          <div className="flex">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">
                Company Logo
              </h3>
              <p className="w-10/12 text-sm text-gray-500 mb-4">
                This image will be shown publicly as company logo.
              </p>
            </div>

            <div className="w-full flex justify-evenly">
              <Image
                src="/invitationBanner.jpg"
                alt="Company logo"
                width={180}
                height={180}
                className="rounded-xl"
              />

              <div
                className="w-96 border-2 border-dashed border-[#4640de] rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleImageDrop}
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-[#4640de]" />
                <p className="text-sm font-medium mb-1 text-[#4640de]">
                  Click to replace
                  <span className="text-xs text-muted-foreground text-gray-500">
                    {" "}
                    or drag and drop
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  SVG, PNG, JPG or GIF (max. 400 x 400px)
                </p>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Company Details
              </h3>
              <p className="w-7/12 text-sm text-gray-500 mb-6">
                Introduce your company core info quickly to users by fill up
                company details
              </p>
            </div>

            <div className="space-y-4 w-full mr-10">
              <div>
                <label className="text-sm text-gray-700">Company Name</label>
                <Input placeholder="Nomad" className="mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-700">Website</label>
                <Input placeholder="https://www.nomad.com" className="mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-700">Location</label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md mt-1">
                  {locations.map((location) => (
                    <Badge key={location} variant="secondary" className="gap-1">
                      {location}
                      <button
                        className="ml-1"
                        onClick={() =>
                          setLocations(locations.filter((l) => l !== location))
                        }
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700">Employee</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="1 - 50" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-50">1 - 50</SelectItem>
                      <SelectItem value="51-200">51 - 200</SelectItem>
                      <SelectItem value="201-500">201 - 500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-700">Industry</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Technology" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-700">Day</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="31" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-700">Month</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="July" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map((month) => (
                        <SelectItem key={month} value={month.toLowerCase()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-700">Year</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="2021" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 50 }, (_, i) => (
                        <SelectItem
                          key={2024 - i}
                          value={(2024 - i).toString()}
                        >
                          {2024 - i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700">Tech Stack</label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md mt-1">
                  {techStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="gap-1">
                      {tech}
                      <button
                        className="ml-1"
                        onClick={() =>
                          setTechStack(techStack.filter((t) => t !== tech))
                        }
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              About Company
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Brief description for your company. URLs are hyperlinked.
            </p>

            <div className="space-y-4">
              <div className="flex gap-2 border-b pb-2">
                <Button variant="ghost" size="sm">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Link2 className="h-4 w-4" />
                </Button>
              </div>

              <Textarea
                placeholder="Nomad is part of the Information Technology industry. We believe travellers want to experience real life and meet local people. Nomad has 30 total employees across all of its locations and generates $1.50 million in sales."
                className="min-h-[100px]"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Maximum 500 characters</span>
                <span>0 / 500</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default OverviewSection;

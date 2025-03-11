"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { List, Bold, Italic, AlignLeft, Link2, Upload } from "lucide-react";
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
import type { Category } from "@/app/admin/manage/components/job-category";
import { fetchJobCategory } from "@/app/api/skills";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { fetchCompanyProfile, updateCompanyProfile } from "@/app/api/profile";
import { toast } from "@/hooks/use-toast";

const OverviewSection = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [jobCategories, setJobCategories] = useState<Category[]>([]);
  const [selectedJobCategories, setSelectedJobCategories] = useState<string[]>(
    []
  );
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    location: "",
    employee: "",
    industry: "",
    foundingDay: "",
    foundingMonth: "",
    foundingYear: "",
    aboutCompany: "",
    jobCategories: [],
    file: null,
    status: null,
    reject_reason: null,
  });

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

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetchCompanyProfile();
        console.log(response);
        setFormData(response);
        setPhoto(response.logo);
      } catch (err) {
        console.log((err as Error).message);
      }
    };

    getProfile();
  }, []);

  useEffect(() => {
    const getJobCategory = async () => {
      try {
        const response = await fetchJobCategory();
        console.log(response);
        setJobCategories(response);
      } catch (err) {
        console.log((err as Error).message);
      }
    };

    getJobCategory();
  }, []);

  const handleJobCategoryChange = (selected: string) => {
    if (!selectedJobCategories.includes(selected)) {
      setSelectedJobCategories([...selectedJobCategories, selected]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data:", {
      ...formData,
      jobCategories: selectedJobCategories,
      file: file,
    });

    try {
      let response = await updateCompanyProfile({
        ...formData,
        //@ts-ignore
        jobCategories: selectedJobCategories.map((selectedCategory) => {
          const match = jobCategories.find(
            (job) => job.name === selectedCategory
          );
          return match ? match.id : null;
        }),
        file: file,
      });

      toast({
        title: "Success",
        description: "Profile send for verification",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update company profile",
        variant: "destructive",
      });
    }
  };

  return (
    <TabsContent value="overview">
      <div className="mx-auto p-6">
        <div className="space-y-8">
          <div className="flex justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Basic Information
              </h2>
              <p className="text-sm text-gray-500">
                This is company information that you can update anytime.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded border p-3">
              Verification Status:
              <span style={{ marginLeft: "10px" }}>
                {formData.status === "Approved" ? (
                  <span style={{ color: "green", fontSize: "20px" }}>✔️</span>
                ) : formData.status === "Rejected" ? (
                  <span style={{ color: "red", fontSize: "20px" }}>
                    ❌ ({formData.reject_reason})
                  </span>
                ) : formData.status === "Pending" ? (
                  <span style={{ color: "orange", fontSize: "20px" }}>⏳</span>
                ) : null}
              </span>
              <span>{formData.status}</span>
            </div>
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
              {photo ? (
                <div className="w-28 h-28 rounded-full overflow-hidden">
                  <img
                    src={photo}
                    alt="Profile"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <Avatar className="w-28 h-28">
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              )}

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

          <form onSubmit={handleSubmit} className="space-y-8">
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
                  <label
                    htmlFor="companyName"
                    className="text-sm text-gray-700"
                  >
                    Company Name
                  </label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Nomad"
                    className="mt-1"
                    value={formData.companyName}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="website" className="text-sm text-gray-700">
                    Website
                  </label>
                  <Input
                    id="website"
                    name="website"
                    placeholder="https://www.nomad.com"
                    className="mt-1"
                    value={formData.website}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="location" className="text-sm text-gray-700">
                    Location
                  </label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Los Santos"
                    className="mt-1"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="employee" className="text-sm text-gray-700">
                      Employee
                    </label>
                    <Select
                      name="employee"
                      onValueChange={(value) =>
                        handleInputChange({
                          target: { name: "employee", value },
                        } as React.ChangeEvent<HTMLSelectElement>)
                      }
                    >
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
                    <label htmlFor="industry" className="text-sm text-gray-700">
                      Industry
                    </label>
                    <Select
                      name="industry"
                      onValueChange={(value) =>
                        handleInputChange({
                          target: { name: "industry", value },
                        } as React.ChangeEvent<HTMLSelectElement>)
                      }
                    >
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
                    <label
                      htmlFor="foundingDay"
                      className="text-sm text-gray-700"
                    >
                      Day
                    </label>
                    <Select
                      name="foundingDay"
                      onValueChange={(value) =>
                        handleInputChange({
                          target: { name: "foundingDay", value },
                        } as React.ChangeEvent<HTMLSelectElement>)
                      }
                    >
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
                    <label
                      htmlFor="foundingMonth"
                      className="text-sm text-gray-700"
                    >
                      Month
                    </label>
                    <Select
                      name="foundingMonth"
                      onValueChange={(value) =>
                        handleInputChange({
                          target: { name: "foundingMonth", value },
                        } as React.ChangeEvent<HTMLSelectElement>)
                      }
                    >
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
                    <label
                      htmlFor="foundingYear"
                      className="text-sm text-gray-700"
                    >
                      Year
                    </label>
                    <Select
                      name="foundingYear"
                      onValueChange={(value) =>
                        handleInputChange({
                          target: { name: "foundingYear", value },
                        } as React.ChangeEvent<HTMLSelectElement>)
                      }
                    >
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
                  <label className="text-sm text-gray-700">
                    Job Categories
                  </label>
                  <Select onValueChange={handleJobCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Job Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedJobCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md mt-1">
                    {selectedJobCategories.map((category, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {category}
                        <button
                          type="button"
                          className="ml-1"
                          onClick={() =>
                            setSelectedJobCategories(
                              selectedJobCategories.filter(
                                (c) => c !== category
                              )
                            )
                          }
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
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
                  <Button type="button" variant="ghost" size="sm">
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm">
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm">
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm">
                    <Link2 className="h-4 w-4" />
                  </Button>
                </div>

                <Textarea
                  name="aboutCompany"
                  placeholder="Nomad is part of the Information Technology industry. We believe travellers want to experience real life and meet local people. Nomad has 30 total employees across all of its locations and generates $1.50 million in sales."
                  className="min-h-[100px]"
                  value={formData.aboutCompany}
                  onChange={handleInputChange}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Maximum 500 characters</span>
                  <span>0 / 500</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                type="submit"
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

export default OverviewSection;

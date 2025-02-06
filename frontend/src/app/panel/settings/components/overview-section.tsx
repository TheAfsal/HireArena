"use client"

import React, { useState } from 'react'
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

                <div className="flex gap-4">
                  <Image
                    src="/invitationBanner.jpg"
                    alt="Company logo"
                    width={180}
                    height={180}
                    className="rounded-lg"
                  />

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center w-[200px] h-[100px]">
                    <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                    <div className="text-center">
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        Click to replace
                      </span>
                      <span className="text-gray-500 text-sm">
                        {" "}
                        or drag and drop
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        SVG, PNG, JPG or GIF (max. 400 x 400px)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex">
                <div >
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
                    <label className="text-sm text-gray-700">
                      Company Name
                    </label>
                    <Input placeholder="Nomad" className="mt-1" />
                  </div>

                  <div>
                    <label className="text-sm text-gray-700">Website</label>
                    <Input
                      placeholder="https://www.nomad.com"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-700">Location</label>
                    <div className="flex flex-wrap gap-2 p-2 border rounded-md mt-1">
                      {locations.map((location) => (
                        <Badge
                          key={location}
                          variant="secondary"
                          className="gap-1"
                        >
                          {location}
                          <button
                            className="ml-1"
                            onClick={() =>
                              setLocations(
                                locations.filter((l) => l !== location)
                              )
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
  )
}

export default OverviewSection

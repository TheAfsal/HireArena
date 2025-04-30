"use client";

import type React from "react";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  Upload,
  FileText,
  Briefcase,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { updateJobSeekerProfile } from "@/app/api/profile";
import { toast } from "sonner";
import { isValid } from "date-fns";
import Link from "next/link";

const profileFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  dob: z.date({
    required_error: "Date of birth is required",
  }),
  gender: z.string({
    required_error: "Please select a gender",
  }),
  headline: z
    .string()
    .min(5, "Professional headline must be at least 5 characters")
    .max(100, "Professional headline cannot exceed 100 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  summary: z
    .string()
    .max(500, "Summary cannot exceed 500 characters")
    .optional(),
  yearsOfExperience: z.string(),
  currentJobTitle: z.string().optional(),
  currentCompany: z.string().optional(),
  highestEducation: z.string(),
  university: z.string().optional(),
  skills: z.array(z.string()).optional(),
  jobPreferences: z.object({
    remoteOnly: z.boolean().default(false),
    relocationWilling: z.boolean().default(false),
    immediateStart: z.boolean().default(false),
    preferredJobTypes: z.array(z.string()).optional(),
  }),
  languages: z.array(z.string()).optional(),
  portfolioUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  githubUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UserProfileData {
  fullName: string;
  phone: string;
  email: string;
  dob: Date;
  gender: string;
  image: string;
  headline?: string;
  location?: string;
  summary?: string;
  yearsOfExperience?: string;
  currentJobTitle?: string;
  currentCompany?: string;
  highestEducation?: string;
  university?: string;
  skills?: string[];
  jobPreferences?: {
    remoteOnly: boolean;
    relocationWilling: boolean;
    immediateStart: boolean;
    preferredJobTypes?: string[];
  };
  languages?: string[];
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  resume?: string;
}

type MyProfileProps = {
  userProfileData: UserProfileData | null;
};

export default function MyProfile({ userProfileData }: MyProfileProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(
    userProfileData?.resume ? userProfileData?.resume : null
  );
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(userProfileData?.skills || []);
  const [languages, setLanguages] = useState<string[]>(
    userProfileData?.languages || []
  );
  const [languageInput, setLanguageInput] = useState("");

  const formValues: ProfileFormValues = {
    fullName: userProfileData?.fullName || "",
    email: userProfileData?.email || "",
    phone: userProfileData?.phone || "",
    dob: new Date(userProfileData?.dob?.toString() || ""),
    gender: userProfileData?.gender || "",
    headline: userProfileData?.headline || "",
    location: userProfileData?.location || "",
    summary: userProfileData?.summary || "",
    yearsOfExperience: userProfileData?.yearsOfExperience || "",
    currentJobTitle: userProfileData?.currentJobTitle || "",
    currentCompany: userProfileData?.currentCompany || "",
    highestEducation: userProfileData?.highestEducation || "",
    university: userProfileData?.university || "",
    skills: userProfileData?.skills || [],
    jobPreferences: {
      remoteOnly: userProfileData?.jobPreferences?.remoteOnly || false,
      relocationWilling:
        userProfileData?.jobPreferences?.relocationWilling || false,
      immediateStart: userProfileData?.jobPreferences?.immediateStart || false,
      preferredJobTypes:
        userProfileData?.jobPreferences?.preferredJobTypes || [],
    },
    languages: userProfileData?.languages || [],
    portfolioUrl: userProfileData?.portfolioUrl || "",
    linkedinUrl: userProfileData?.linkedinUrl || "",
    githubUrl: userProfileData?.githubUrl || "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: formValues,
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

  const handleResumeDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile &&
      (droppedFile.type === "application/pdf" ||
        droppedFile.type === "application/msword" ||
        droppedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setResume(droppedFile);
      setResumeFileName(droppedFile.name);
    } else {
      toast.error("Please upload a PDF or Word document");
    }
  };

  const handleResumeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (
      selectedFile &&
      (selectedFile.type === "application/pdf" ||
        selectedFile.type === "application/msword" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setResume(selectedFile);
      setResumeFileName(selectedFile.name);
    } else {
      toast.error("Please upload a PDF or Word document");
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      const newSkills = [...skills, skillInput.trim()];
      setSkills(newSkills);
      form.setValue("skills", newSkills);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(newSkills);
    form.setValue("skills", newSkills);
  };

  const addLanguage = () => {
    if (languageInput.trim() && !languages.includes(languageInput.trim())) {
      const newLanguages = [...languages, languageInput.trim()];
      setLanguages(newLanguages);
      form.setValue("languages", newLanguages);
      setLanguageInput("");
    }
  };

  const removeLanguage = (languageToRemove: string) => {
    const newLanguages = languages.filter(
      (language) => language !== languageToRemove
    );
    setLanguages(newLanguages);
    form.setValue("languages", newLanguages);
  };

  const onSubmit = async (data: ProfileFormValues) => {
    const formData = new FormData();

    // Basic information
    formData.append("fullName", data.fullName);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("dob", data.dob.toISOString());
    formData.append("gender", data.gender);
    formData.append("image", userProfileData!.image);

    // Professional information
    formData.append("headline", data.headline || "");
    formData.append("location", data.location || "");
    formData.append("summary", data.summary || "");
    formData.append("yearsOfExperience", data.yearsOfExperience || "");
    formData.append("currentJobTitle", data.currentJobTitle || "");
    formData.append("currentCompany", data.currentCompany || "");
    formData.append("highestEducation", data.highestEducation || "");
    formData.append("university", data.university || "");

    // Skills and languages
    formData.append("skills", JSON.stringify(data.skills || []));
    formData.append("languages", JSON.stringify(data.languages || []));

    // Job preferences
    formData.append("jobPreferences", JSON.stringify(data.jobPreferences));

    // URLs
    formData.append("portfolioUrl", data.portfolioUrl || "");
    formData.append("linkedinUrl", data.linkedinUrl || "");
    formData.append("githubUrl", data.githubUrl || "");

    // Files
    if (file) {
      formData.append("profileImage", file);
    }

    if (resume) {
      formData.append("resume", resume);
    }

    try {
      const response = await updateJobSeekerProfile(formData);
      console.log(response);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Candidate Profile</h2>
        <p className="text-sm text-muted-foreground">
          Complete your profile to increase your chances of getting interviews.
        </p>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Photo Section */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-3/12">
              <h3 className="font-medium mb-2">Profile Photo</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This image will be shown to recruiters and helps them recognize
                you.
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6 w-full">
              {photo ? (
                <div className="w-28 h-28 rounded-full overflow-hidden">
                  <Image
                    src={photo || "/placeholder.svg"}
                    alt="Profile"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <Avatar className="w-28 h-28">
                  {userProfileData?.image ? (
                    <div className="w-28 h-28 rounded-full overflow-hidden">
                      <img
                        src={userProfileData?.image || "/placeholder.svg"}
                        alt="Profile"
                        width={500}
                        height={500}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <AvatarFallback>
                      {userProfileData?.fullName?.[0] || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
              )}
              <div
                className="w-full md:w-96 border-2 border-dashed border-[#4640de] rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
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

          {/* Resume Upload Section */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-3/12">
              <h3 className="font-medium mb-2">Resume / CV</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your latest resume to share with potential employers.
              </p>
            </div>
            {/* <p className="flex  text-sm font-medium mb-1 text-[#4640de]">
              <span className="text-xs text-muted-foreground text-gray-500">
                {" "}
                click here to view
              </span>
              <p>
                {resumeFileName ? (
                  <Link href={resumeFileName}>Current Resume</Link>
                ) : (
                  "Upload your resume"
                )}
              </p>
            </p> */}
            <div className="w-full md:w-9/12">
              <div
                className="w-full border-2 border-dashed border-[#4640de] rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleResumeDrop}
                onClick={() =>
                  document.getElementById("resume-upload")?.click()
                }
              >
                <FileText className="w-8 h-8 mx-auto mb-2 text-[#4640de]" />
                <p className="text-sm font-medium mb-1 text-[#4640de]">
                  {resumeFileName ? <Link href={resumeFileName}>{resumeFileName}</Link> : "Upload your resume"}
                  <span className="text-xs text-muted-foreground text-gray-500">
                    {" "}
                    or drag and drop
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  PDF or Word documents only (max. 5MB)
                </p>
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={handleResumeSelect}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Basic Information Section */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-3/12">
              <h3 className="font-medium mb-2">Basic Information</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your personal details that employers will see.
              </p>
            </div>
            <div className="w-full md:w-9/12 space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value && isValid(new Date(field.value)) ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">
                            Prefer not to say
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-8"
                          placeholder="City, Country"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Professional Information Section */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-3/12">
              <h3 className="font-medium mb-2">Professional Information</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Highlight your professional experience and expertise.
              </p>
            </div>
            <div className="w-full md:w-9/12 space-y-6">
              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Headline</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Senior Software Engineer | React Expert | 5 Years Experience"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief headline that describes your professional identity
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly describe your professional background, key skills, and career goals..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Maximum 500 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="yearsOfExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0-1">Less than 1 year</SelectItem>
                          <SelectItem value="1-3">1-3 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="5-10">5-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="highestEducation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Highest Education</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="high-school">
                            High School
                          </SelectItem>
                          <SelectItem value="associate">
                            Associate Degree
                          </SelectItem>
                          <SelectItem value="bachelor">
                            Bachelor's Degree
                          </SelectItem>
                          <SelectItem value="master">
                            Master's Degree
                          </SelectItem>
                          <SelectItem value="doctorate">Doctorate</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="university"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University/Institution</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <GraduationCap className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-8"
                          placeholder="e.g. Stanford University"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="currentJobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Job Title</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Briefcase className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-8"
                            placeholder="e.g. Software Engineer"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentCompany"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Company</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Google" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Skills Section */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-3/12">
              <h3 className="font-medium mb-2">Skills & Expertise</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add skills that are relevant to the positions you're seeking.
              </p>
            </div>
            <div className="w-full md:w-9/12 space-y-6">
              <div>
                <FormLabel>Skills</FormLabel>
                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                  {skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1.5"
                    >
                      {skill}
                      <button
                        type="button"
                        className="ml-2 text-muted-foreground hover:text-foreground"
                        onClick={() => removeSkill(skill)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill (e.g. React, Project Management)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <Button type="button" onClick={addSkill}>
                    Add
                  </Button>
                </div>
              </div>

              <div>
                <FormLabel>Languages</FormLabel>
                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                  {languages.map((language, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="px-3 py-1.5"
                    >
                      {language}
                      <button
                        type="button"
                        className="ml-2 text-muted-foreground hover:text-foreground"
                        onClick={() => removeLanguage(language)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={languageInput}
                    onChange={(e) => setLanguageInput(e.target.value)}
                    placeholder="Add a language (e.g. English, Spanish)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addLanguage();
                      }
                    }}
                  />
                  <Button type="button" onClick={addLanguage}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Job Preferences Section */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-3/12">
              <h3 className="font-medium mb-2">Job Preferences</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Let employers know about your availability and preferences.
              </p>
            </div>
            <div className="w-full md:w-9/12 space-y-6">
              <div className="space-y-4">
                <FormLabel>Preferences</FormLabel>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="jobPreferences.remoteOnly"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Remote Only</FormLabel>
                          <FormDescription>
                            I'm only interested in remote positions
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jobPreferences.relocationWilling"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Open to Relocation</FormLabel>
                          <FormDescription>
                            I'm willing to relocate for the right opportunity
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jobPreferences.immediateStart"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Available Immediately</FormLabel>
                          <FormDescription>
                            I can start a new position immediately
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Online Presence Section */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-3/12">
              <h3 className="font-medium mb-2">Online Presence</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Share your professional profiles and portfolio.
              </p>
            </div>
            <div className="w-full md:w-9/12 space-y-6">
              <FormField
                control={form.control}
                name="linkedinUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Profile</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://linkedin.com/in/yourprofile"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Profile</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://github.com/yourusername"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="portfolioUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio Website</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://yourportfolio.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" size="lg">
              Save Profile
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

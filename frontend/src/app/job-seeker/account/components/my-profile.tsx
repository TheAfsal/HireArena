"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateJobSeekerProfile } from "@/app/api/profile";
import { toast } from "sonner";

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
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UserProfileData {
  fullName: string;
  phone: string;
  email: string;
  dob: Date;
  gender: string;
  image: string;
}

type MyProfileProps = {
  userProfileData: UserProfileData | null;
};

export default function MyProfile({ userProfileData }: MyProfileProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  console.log(userProfileData);

  function parseDate(dateString: string): Date {
    if (!dateString) return new Date();

    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  }

  const formValues: ProfileFormValues = {
    fullName: userProfileData?.fullName || "",
    email: userProfileData?.email || "",
    phone: userProfileData?.phone || "",
    dob: new Date(userProfileData?.dob.toString()!),
    gender: userProfileData?.gender || "",
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

  const onSubmit = async (data: ProfileFormValues) => {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("dob", data.dob.toISOString());
    formData.append("gender", data.gender);
    formData.append("image", userProfileData!.image);
    formData.append("profileImage", file!);

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
        <h2 className="text-lg font-semibold">Basic Information</h2>
        <p className="text-sm text-muted-foreground">
          This is your personal information that you can update anytime.
        </p>
      </div>

      <Separator />

      <div className="flex">
        <div className="w-3/12">
          <h3 className="font-medium mb-2">Profile Photo</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This image will be shown publicly as your profile picture, it will
            help recruiters recognize you!
          </p>
        </div>
        <div className="flex items-center justify-center gap-16 w-full">
          {photo ? (
            <div className="w-28 h-28 rounded-full overflow-hidden">
              <Image
                src={photo}
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
                    src={userProfileData?.image}
                    alt="Profile"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <AvatarFallback>{userProfileData?.fullName[0]}</AvatarFallback>
              )}
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                          {field.value ? (
                            format(field.value, "PPP")
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
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit">Save Profile</Button>
        </form>
      </Form>
    </div>
  );
}

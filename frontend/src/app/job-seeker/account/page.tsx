"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyProfile from "./components/my-profile";
import LoginDetails from "./components/login-details";
import { fetchJobSeekerProfile } from "@/app/api/profile";

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [userProfileData, setUserProfileData] = useState<any | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetchJobSeekerProfile();
        console.log(response);
        setUserProfileData(response);
      } catch (error) {
        console.error("Error fetching profile data", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="p-10">
      <Tabs
        defaultValue="profile"
        className="space-y-6"
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="profile" className="flex-1">
            My Profile
          </TabsTrigger>
          <TabsTrigger value="login" className="flex-1">
            Login Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          {userProfileData ? (
            <MyProfile userProfileData={userProfileData} />
          ) : (
            <p>Loading...</p>
          )}
        </TabsContent>

        <TabsContent value="login">
          <LoginDetails />
        </TabsContent>
      </Tabs>
    </div>
  );
}

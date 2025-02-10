"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyProfile from "./components/my-profile";
import LoginDetails from "./components/login-details";

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState("profile");

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
          <MyProfile />
        </TabsContent>

        <TabsContent value="login">
          <LoginDetails />
        </TabsContent>
      </Tabs>
    </div>
  );
}

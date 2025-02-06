
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewSection from "./components/overview-section";
import SocialLinksSections from "./components/social-links-sections";
import TeamSection from "./components/team-section";

export default function TeamSettings() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <OverviewSection />

        <SocialLinksSections />

        <TeamSection />
      </Tabs>
    </div>
  );
}

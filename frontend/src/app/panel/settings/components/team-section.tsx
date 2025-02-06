import { TabsContent } from "@/components/ui/tabs";
import React from "react";
import InviteDialog from "./invitation-dialog";
import { Button } from "@/components/ui/button";
import { Instagram, LayoutGrid, Linkedin, List, X } from "lucide-react";
import Image from "next/image";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  instagram?: string;
  linkedin?: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Célestin Gardinier",
    role: "CEO & Co-Founder",
    image: "/invitationBanner.jpg",
    instagram: "#",
    linkedin: "#",
  },
  {
    id: 2,
    name: "Reynaud Colbert",
    role: "Co-Founder",
    image: "/invitationBanner.jpg",
    instagram: "#",
    linkedin: "#",
  },
  {
    id: 3,
    name: "Arienne Lyon",
    role: "Managing Director",
    image: "/invitationBanner.jpg",
    instagram: "#",
    linkedin: "#",
  },
  {
    id: 4,
    name: "Bernard Alexander",
    role: "Managing Director",
    image: "/invitationBanner.jpg",
    instagram: "#",
    linkedin: "#",
  },
  {
    id: 5,
    name: "Christine Jhonson",
    role: "Managing Director",
    image: "/invitationBanner.jpg",
    instagram: "#",
    linkedin: "#",
  },
  {
    id: 6,
    name: "Aaron Morgan",
    role: "Managing Director",
    image: "/invitationBanner.jpg",
    instagram: "#",
    linkedin: "#",
  },
];
const TeamSection = () => {
  return (
    <TabsContent value="team">
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">
          Basic Information
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Add team members of your company
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">50 Members</h3>
        <div className="flex justify-center items-center gap-2">
          <InviteDialog />
          <div className="flex gap-1 border rounded-lg p-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {teamMembers.map((member) => (
          <div key={member.id} className="border rounded-lg p-4 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 hover:bg-slate-100"
            >
              <X className="w-4 h-4 text-slate-500" />
            </Button>
            <div className="flex flex-col items-center text-center">
              <div className="relative w-20 h-20 mb-4">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">
                {member.name}
              </h4>
              <p className="text-sm text-slate-500 mb-4">{member.role}</p>
              <div className="flex gap-2">
                {member.instagram && (
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Instagram className="w-4 h-4 text-slate-500" />
                  </Button>
                )}
                {member.linkedin && (
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Linkedin className="w-4 h-4 text-slate-500" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          Save Changes
        </Button>
      </div>
    </TabsContent>
  );
};

export default TeamSection;

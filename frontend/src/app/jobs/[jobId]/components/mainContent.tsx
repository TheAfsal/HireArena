import React from "react";
import { JobDetails } from "../page";
import { Separator } from "@radix-ui/react-select";
import { Badge } from "@/components/ui/badge";

const MainContent = ({ jobDetails }: { jobDetails: JobDetails }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* Description */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {jobDetails?.jobDescription}
          </p>
        </section>

        <Separator />

        {/* Responsibilities */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Responsibilities</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {jobDetails?.responsibilities}
          </p>
        </section>

        <Separator />

        {/* Qualifications */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Qualifications</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {jobDetails?.qualifications}
          </p>
        </section>

        {jobDetails?.niceToHave && (
          <>
            <Separator />
            <section>
              <h2 className="text-xl font-semibold mb-4">Nice to Have</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {jobDetails.niceToHave}
              </p>
            </section>
          </>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Categories */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold mb-4">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {jobDetails?.categories.map((category) => (
              <Badge key={category.name} variant="secondary">
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Required Skills */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold mb-4">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {jobDetails?.requiredSkills.map((skill) => (
              <Badge key={skill.name} variant="outline">
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Benefits */}
        {jobDetails?.benefits && jobDetails.benefits.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4">Benefits</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {jobDetails?.benefits.map((benefit, index) => (
                <li key={index}>{benefit.title}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Test Options */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold mb-4">Test Options</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            {jobDetails?.testOptions["Aptitude Test"] && <li>Aptitude Test</li>}
            {jobDetails?.testOptions["Machine Task"] && <li>Machine Task</li>}
            {jobDetails?.testOptions["Coding Challenge"] && (
              <li>Coding Challenge</li>
            )}
            {jobDetails?.testOptions["Technical Interview"] && (
              <li>Technical Interview</li>
            )}
            {jobDetails?.testOptions["Behavioral Interview"] && (
              <li>Behavioral Interview</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainContent;

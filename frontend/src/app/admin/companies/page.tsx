"use client";

import { useEffect, useState } from "react";
import { fetchCompanies } from "@/app/api/company";
import { toast } from "@/hooks/use-toast";
import {
  approveCompanyVerification,
  rejectCompanyVerification,
} from "@/app/api/admin";
import { DataTable } from "../components/data-table";

const columns = [
  { key: "companyName", label: "Name" },
  { key: "location", label: "Location" },
  { key: "industry", label: "Industry" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getCompanies = async () => {
      setIsLoading(true);
      try {
        const response = await fetchCompanies();
        console.log(response);
        setCompanies(response);
      } catch (err) {
        console.log((err as Error).message);
        toast({
          title: "Error",
          description: "Failed to fetch companies",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    getCompanies();
  }, []);

  const handleBlockUnblock = (companyName: string) => {
    console.log(companyName);

    setCompanies((prevCompanies) =>
      prevCompanies.map((company) =>
        company.companyName === companyName
          ? {
              ...company,
              status: company.status === "Blocked" ? "Active" : "Blocked",
            }
          : company
      )
    );
  };

  const handleApproveVerification = async (companyId: string) => {
    setIsLoading(true);
    try {
      await approveCompanyVerification(companyId);

      setCompanies((prevCompanies) =>
        prevCompanies.map((company) =>
          company.id === companyId ? { ...company, status: "Active" } : company
        )
      );

      toast({
        title: "Success",
        description: "Company verification approved",
      });
    } catch (error) {
      console.error("Failed to approve verification:", error);
      toast({
        title: "Error",
        description: "Failed to approve company verification",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectVerification = async (
    companyId: string,
    reason: string
  ) => {
    setIsLoading(true);
    try {
      await rejectCompanyVerification(companyId, reason);

      setCompanies((prevCompanies) =>
        prevCompanies.map((company) =>
          company.id === companyId
            ? { ...company, status: "Rejected" }
            : company
        )
      );

      toast({
        title: "Success",
        description: "Company verification rejected",
      });
    } catch (error) {
      console.error("Failed to reject verification:", error);
      toast({
        title: "Error",
        description: "Failed to reject company verification",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DataTable
      title="Companies"
      data={companies}
      columns={columns}
      searchPlaceholder="Search companies"
      onBlockUnblock={handleBlockUnblock}
      onApproveVerification={handleApproveVerification}
      onRejectVerification={handleRejectVerification}
    />
  );
}

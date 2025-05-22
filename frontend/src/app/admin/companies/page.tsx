"use client";

import { useEffect, useState, useCallback } from "react";
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
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // Increased from 1 to 10 for better UX
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getCompanies = async () => {
      setIsLoading(true);
      try {
        const response = await fetchCompanies(page, pageSize, searchTerm);
        setCompanies(response.companies);
        setTotal(response.total);
      } catch (err) {
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
  }, [page, searchTerm]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(1);
  }, []);

  const handleBlockUnblock = useCallback((companyName: string) => {
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
  }, []);

  const handleApproveVerification = useCallback(async (companyId: string) => {
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
  }, []);

  const handleRejectVerification = useCallback(
    async (companyId: string, reason: string) => {
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
    },
    []
  );

  return (
    <DataTable
      title="Companies"
      data={companies}
      columns={columns}
      searchPlaceholder="Search companies by name..."
      onBlockUnblock={handleBlockUnblock}
      onApproveVerification={handleApproveVerification}
      onRejectVerification={handleRejectVerification}
      page={page}
      pageSize={pageSize}
      total={total}
      onPageChange={setPage}
      onSearch={() => {}} 
      onSearchButtonClick={handleSearch}
      searchInput={searchInput}
      setSearchInput={setSearchInput}
      isLoading={isLoading}
    />
  );
}
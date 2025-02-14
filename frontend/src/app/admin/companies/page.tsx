"use client";
import { useEffect, useState } from "react";
import { DataTable } from "../components/data-table";
import { fetchCompanies } from "@/app/api/company";

const columns = [
  { key: "companyName", label: "Name" },
  { key: "location", label: "Location" },
  { key: "industry", label: "Industry" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const response = await fetchCompanies();
        console.log(response);
        setCompanies(response);
      } catch (err) {
        console.log((err as Error).message);
      }
    };

    getCompanies();
  }, []);

  const handleBlockUnblock = (companyName: string) => {
    console.log(companyName);
    
    setCompanies((prevCompanies) =>
      prevCompanies.map((company) =>
        company.name === companyName
          ? { ...company, status: company.status === "Blocked" ? "Active" : "Blocked" }
          : company
      )
    );
  };

  return (
    <DataTable
      title="Companies"
      data={companies}
      columns={columns}
      searchPlaceholder="Search companies"
      onBlockUnblock={handleBlockUnblock} 
    />
  );
}

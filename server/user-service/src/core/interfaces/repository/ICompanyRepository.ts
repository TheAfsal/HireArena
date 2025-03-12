import { ICompany } from "@shared/user.types";


export interface ICompanyRepository {
  findById(id: string): Promise<ICompany | null>;
  findMedialLinksById(id: string): Promise<Pick<ICompany, "Youtube" | "LinkedIn" | "Facebook" | "Twitter" | "Instagram"> | null>;
  findByName(companyName: string): Promise<ICompany | null>;
  create(companyData: { companyName: string; status: string }): Promise<ICompany>;
  update(id: string, updateData: Partial<Pick<ICompany, "companyName" | "status" | "reject_reason">>): Promise<ICompany>;
  delete(id: string): Promise<ICompany>;
  updateCompanyProfile(data: Partial<ICompany> & { companyId: string }): Promise<ICompany>;
  updateMediaLinks(companyId: string, data: Partial<Pick<ICompany, "Youtube" | "LinkedIn" | "Facebook" | "Twitter" | "Instagram">>): Promise<ICompany>;
  findMany(): Promise<ICompany[]>;
  findByIds(companyIds: string[]): Promise<ICompany[]>;
}

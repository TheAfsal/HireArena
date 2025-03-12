export interface ICompanyRepository {
  findById(id: string): Promise<any | null>;
  findMedialLinksById(id: string): Promise<any | null>;
  findByName(companyName: string): Promise<any | null>;
  create(companyData: { companyName: string; status: string }): Promise<any>;
  update(
    id: string,
    updateData: Partial<{ companyName: string }>
  ): Promise<any>;
  delete(id: string): Promise<any>;
  updateCompanyProfile(data: any): Promise<any>;
  updateMediaLinks(companyId: string, data: any): Promise<any>;
  findMany(): Promise<any[]>;
  findByIds(companyIds: string[]): Promise<any[]>;
}

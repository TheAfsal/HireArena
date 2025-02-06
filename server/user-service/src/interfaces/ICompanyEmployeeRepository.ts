export interface ICompanyEmployeeRepository {
    addEmployee(userId: string, companyId: string, role: string): Promise<void>;
  }
  
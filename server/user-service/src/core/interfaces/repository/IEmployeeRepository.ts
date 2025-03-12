export interface IEmployeeRepository {
  findByEmail(email: string): Promise<any | null>;
  create(employeeData: {
    name: string;
    email: string;
    password: string;
  }): Promise<any>;
  findById(id: string): Promise<any | null>;
  update(
    id: string,
    updateData: Partial<{ name: string; email: string; password: string }>
  ): Promise<any>;
  delete(id: string): Promise<any>;
  findEmployeeAndCompany(id: string): Promise<any | null>;
}

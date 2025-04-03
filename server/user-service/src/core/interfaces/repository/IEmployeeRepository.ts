import { CompanyRole } from "@prisma/client";
import { ICompany, IEmployee } from "@shared/types/user.types";

export interface IEmployeeCreateInput {
  name: string;
  email: string;
  password: string;
  companyAssociations?: {
    create: {
      companyId: string;
      role: CompanyRole;
    };
  };
}

export interface IEmployeeRepository {
  findByEmail(email: string): Promise<IEmployee | null>;
  create(employeeData: IEmployeeCreateInput): Promise<IEmployee>;
  findById(id: string): Promise<IEmployee | null>;
  update(
    id: string,
    updateData: Partial<{ name: string; email: string; password: string }>
  ): Promise<IEmployee>;
  delete(id: string): Promise<IEmployee>;
  findEmployeeAndCompany(
    id: string
  ): Promise<
    (IEmployee & { companyAssociations: { company: ICompany }[] }) | null
  >;
}

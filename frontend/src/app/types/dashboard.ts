export type Employee = {
  employeeId: string;
  employeeProfile: string;
  employeeEmail: string;
  employeeName: string;
  employeeRole: string;
  employeeStatus: string;
  employeeSalary: number;
  employeeJobType: string;
  employeeResident: string;
  employeeAge: number;
  bonuses: number;
};

export type EmployeeStatusType = {
  Active: number;
  "Invite Sent": number;
  "Payroll Only": number;
};

export type EmploymentType = {
  Contract: number;
  FullTime: number;
  Intern: number;
  PartTime: number;
};

export type Nationality = {
  Foreigner: number;
  Others: number;
  PR: number;
  Singaporean: number;
};

export type EmployeeData = {
  OrganizationName: string;
  EmployeeStatus: EmployeeStatusType;
  EmploymentType: EmploymentType;
  Nationality: Nationality;
};

export type EmployeeSalaryDetails = {
  bonuses: number;
  employeeContribution: number;
  employerContribution: number;
  totalContribution: number;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  salary: number;
  grossSalary: number;
  netSalary: number;
};

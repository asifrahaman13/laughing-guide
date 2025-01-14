import { Employee } from "@/app/types/dashboard";

const MANAGE = [
  {
    icon: "/images/dashboard/employee.svg",
    title: "Employees",
    link: "employees",
  },
  {
    icon: "/images/dashboard/payrolls.svg",
    title: "Payrolls",
    link: "payrolls",
  },
  {
    icon: "/images/dashboard/leaves.svg",
    title: "Leaves",
    link: "leaves",
  },
  {
    icon: "/images/dashboard/claims.svg",
    title: "Claims",
    link: "claims",
  },
];

const employees: Employee[] = [
  {
    id: 1,
    profile: "https://via.placeholder.com/40",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Software Engineer",
    status: "Active",
  },
  {
    id: 2,
    profile: "https://via.placeholder.com/40",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Product Manager",
    status: "Inactive",
  },
  {
    id: 3,
    profile: "https://via.placeholder.com/40",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Designer",
    status: "Active",
  },
];

export { MANAGE, employees };

import React from 'react';

const EmployeeStatus = ({ status, imgSrc, bgColor, textColor }) => (
  <td className="p-3 flex items-center">
    <div className={`text-center flex py-2 items-center px-4 ${bgColor} rounded-2xl ${textColor}`}>
      <div>
        <img src={imgSrc} alt="" />
      </div>
      {status}
    </div>
  </td>
);

const EmployeeTable = ({ employees }) => {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                {employee?.employeeStatus === "Payroll Only" && (
                  <EmployeeStatus
                    status={employee.employeeStatus}
                    imgSrc="/images/status/payroll.svg"
                    bgColor="bg-light-gray"
                    textColor="text-status-gray"
                  />
                )}

                {employee?.employeeStatus === "Invite Sent" && (
                  <EmployeeStatus
                    status={employee.employeeStatus}
                    imgSrc="/images/status/invite.svg"
                    bgColor="bg-purple-200"
                    textColor="text-light-purple"
                  />
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;
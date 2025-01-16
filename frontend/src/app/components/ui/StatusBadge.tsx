/* eslint-disable @next/next/no-img-element */
type StatusProps = {
  status: string;
};

const StatusBadge: React.FC<StatusProps> = ({ status }) => {
  const statusStyles: Record<
    string,
    { bg: string; text: string; icon: string }
  > = {
    Active: {
      bg: "bg-green-200",
      text: "text-lime-green",
      icon: "/images/status/active.svg",
    },
    "Payroll Only": {
      bg: "bg-light-gray",
      text: "text-status-gray",
      icon: "/images/status/payroll.svg",
    },
    "Invite Sent": {
      bg: "bg-purple-200",
      text: "text-light-purple",
      icon: "/images/status/invite.svg",
    },
  };

  const { bg, text, icon } = statusStyles[status] || {
    bg: "bg-gray-200",
    text: "text-gray-500",
    icon: "",
  };

  return (
    <div
      className={`text-center flex py-2 items-center px-4 ${bg} rounded-2xl ${text}`}
    >
      {icon && <img src={icon} alt={status} className="mr-2" />}
      {status}
    </div>
  );
};

export default StatusBadge;

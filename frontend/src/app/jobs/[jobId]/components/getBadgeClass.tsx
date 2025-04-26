const getBadgeClass = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-200 text-yellow-800";
    case "INTERVIEW":
      return "bg-blue-200 text-blue-800";
    case "HIRED":
      return "bg-green-200 text-green-800";
    case "REJECTED":
      return "bg-red-200 text-red-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export default getBadgeClass;

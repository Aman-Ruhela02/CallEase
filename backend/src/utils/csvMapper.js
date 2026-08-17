const normalizeHeader = (header) => {
  return header
    ?.toString()
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
};

export const mapCSVRow = (row) => {
  const normalizedRow = {};

  Object.entries(row).forEach(([key, value]) => {
    normalizedRow[normalizeHeader(key)] = value?.toString().trim();
  });

  return {
    name:
      normalizedRow.name ||
      normalizedRow.fullname ||
      normalizedRow.username ||
      null,

    phone:
      normalizedRow.phone ||
      normalizedRow.phonenumber ||
      normalizedRow.mobile ||
      normalizedRow.mobilenumber ||
      normalizedRow.contact ||
      normalizedRow.contactnumber ||
      null,

    location:
      normalizedRow.location ||
      normalizedRow.city ||
      normalizedRow.address ||
      null,
  };
};
const normalizeHeader = (header) => {
  return String(header ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
};

const normalizeValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
};

const NAME_HEADERS = [
  "name",
  "fullname",
  "customername",
  "contactname",
  "personname",
  "customer",
  "person",
  "username",
];

const PHONE_HEADERS = [
  "phone",
  "phonenumber",
  "phoneno",
  "number",
  "mobile",
  "mobilenumber",
  "mobileno",
  "contact",
  "contactnumber",
  "contactno",
  "telephone",
  "telephonenumber",
  "tel",
  "whatsapp",
  "whatsappnumber",
];

const LOCATION_HEADERS = [
  "location",
  "city",
  "address",
  "area",
  "place",
  "state",
  "district",
  "region",
  "town",
  "village",
];

const findValue = (normalizedRow, headers) => {
  for (const header of headers) {
    const value = normalizedRow[header];

    if (value !== undefined && value !== null) {
      const cleaned = normalizeValue(value);

      if (cleaned) {
        return cleaned;
      }
    }
  }

  return null;
};

export const mapCSVRow = (row) => {
  const normalizedRow = {};

  Object.entries(row).forEach(([key, value]) => {
    normalizedRow[normalizeHeader(key)] = normalizeValue(value);
  });

  return {
    name: findValue(normalizedRow, NAME_HEADERS),

    phone: findValue(normalizedRow, PHONE_HEADERS),

    location: findValue(normalizedRow, LOCATION_HEADERS),
  };
};

export { normalizeHeader };

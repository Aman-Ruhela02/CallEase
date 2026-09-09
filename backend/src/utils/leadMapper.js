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

    if (value !== undefined && value !== null && normalizeValue(value)) {
      return normalizeValue(value);
    }
  }

  return null;
};

export const mapLeadRow = (row) => {
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

export const normalizePhone = (phone) => {
  if (!phone) return null;

  let value = String(phone)
    .trim()
    .replace(/\.0+$/, "")
    .replace(/[^\d+]/g, "");

  // Remove India country code
  if (value.startsWith("+91")) {
    value = value.substring(3);
  }

  if (value.startsWith("91") && value.length === 12) {
    value = value.substring(2);
  }

  if (value.startsWith("0") && value.length === 11) {
    value = value.substring(1);
  }

  return value;
};

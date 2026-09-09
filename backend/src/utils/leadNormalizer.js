// utils/leadNormalizer.js

const normalizeKey = (key) => {
  return String(key || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
};

const FIELD_ALIASES = {
  name: [
    "name",
    "full name",
    "fullname",
    "customer name",
    "customer",
    "client name",
    "client",
    "person name",
    "contact name",
    "lead name",
    "username",
  ],

  phone: [
    "phone",
    "phone number",
    "phonenumber",
    "mobile",
    "mobile number",
    "mobilenumber",
    "number",
    "contact",
    "contact number",
    "contactnumber",
    "contact no",
    "contact no.",
    "phone no",
    "phone no.",
    "mobile no",
    "mobile no.",
    "telephone",
    "telephone number",
    "tel",
  ],

  location: [
    "location",
    "city",
    "town",
    "place",
    "address",
    "area",
    "district",
    "state",
    "region",
    "locality",
    "residence",
    "residential address",
    "customer location",
  ],
};

const findField = (row, aliases) => {
  const entries = Object.entries(row);

  for (const [key, value] of entries) {
    const normalizedKey = normalizeKey(key);

    if (aliases.some((alias) => normalizeKey(alias) === normalizedKey)) {
      return value;
    }
  }

  return "";
};

export const normalizePhone = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  let phone = String(value).trim();

  // Remove Excel numeric formatting like 9876543210.0
  phone = phone.replace(/\.0$/, "");

  // Keep only digits and +
  phone = phone.replace(/[^\d+]/g, "");

  // Convert +91XXXXXXXXXX / 91XXXXXXXXXX to XXXXXXXXXX
  if (phone.startsWith("+91")) {
    phone = phone.slice(3);
  } else if (phone.startsWith("91") && phone.length === 12) {
    phone = phone.slice(2);
  }

  return phone;
};

export const normalizeLeadRow = (row) => {
  const name = findField(row, FIELD_ALIASES.name);
  const phone = findField(row, FIELD_ALIASES.phone);
  const location = findField(row, FIELD_ALIASES.location);

  return {
    name: String(name || "").trim() || null,
    phone: normalizePhone(phone),
    location: String(location || "").trim() || null,
  };
};

export const normalizeLeadRows = (rows) => {
  return rows.map(normalizeLeadRow);
};

export const getSupportedHeaders = () => {
  return {
    name: FIELD_ALIASES.name,
    phone: FIELD_ALIASES.phone,
    location: FIELD_ALIASES.location,
  };
};

const phoneRegex = /^\d{10}$/;

const headerWords = [
  "name",
  "names",
  "location",
  "locations",
  "city",
  "cities",
  "phone",
  "phone number",
  "number",
  "mobile",
  "mobile number",
];

const isHeader = (line) => {
  return headerWords.includes(
    line.toLowerCase().trim()
  );
};

const isPhone = (line) => {
  return phoneRegex.test(
    line.replace(/\s+/g, "").trim()
  );
};

const cleanLines = (text) => {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !isHeader(line));
};

const isLikelyLocation = (line) => {
  if (!line) return false;

  const value = line.toLowerCase();

  const locationWords = [
    "delhi",
    "noida",
    "ghaziabad",
    "meerut",
    "lucknow",
    "jaipur",
    "agra",
    "chandigarh",
    "gurgaon",
    "gurugram",
    "mumbai",
    "pune",
    "bangalore",
    "bengaluru",
    "hyderabad",
    "kolkata",
    "chennai",
    "ahmedabad",
    "dehradun",
    "rajasthan",
    "uttar pradesh",
    "haryana",
    "maharashtra",
    "karnataka",
    "telangana",
    "uttarakhand",
    "punjab",
  ];

  return locationWords.some((word) =>
    value.includes(word)
  );
};

const isLikelyName = (line) => {
  if (!line) return false;

  if (isPhone(line)) return false;

  if (isHeader(line)) return false;

  if (isLikelyLocation(line)) return false;

  // Name should contain letters
  if (!/[a-zA-Z]/.test(line)) return false;

  return true;
};

export const parseImageLeads = (text) => {
  const lines = cleanLines(text);

  console.log("Cleaned OCR lines:", lines);

  const phones = lines.filter(isPhone);

  console.log("Detected phones:", phones);

  if (!phones.length) {
    return [];
  }

  const leads = [];

  /*
  --------------------------------
  STEP 1
  Find every phone number.
  --------------------------------
  */

  for (let i = 0; i < lines.length; i++) {

    if (!isPhone(lines[i])) {
      continue;
    }

    const phone = lines[i];

    let name = null;
    let location = null;

    /*
    Look backwards for name/location
    */

    const previousLines = lines
      .slice(Math.max(0, i - 4), i)
      .reverse();

    for (const line of previousLines) {

      if (!location && isLikelyLocation(line)) {
        location = line;
        continue;
      }

      if (!name && isLikelyName(line)) {
        name = line;
      }

      if (name && location) {
        break;
      }
    }

    /*
    Look forward if something is missing.
    */

    const nextLines = lines.slice(
      i + 1,
      Math.min(lines.length, i + 4)
    );

    for (const line of nextLines) {

      if (!location && isLikelyLocation(line)) {
        location = line;
        continue;
      }

      if (!name && isLikelyName(line)) {
        name = line;
      }

      if (name && location) {
        break;
      }
    }

    /*
    Only save a lead if we have
    a phone + name + location.
    */

    if (phone && name && location) {
      leads.push({
        name,
        phone,
        location,
      });
    }
  }

  console.log(
    "Parsed image leads:",
    leads
  );

  return leads;
};
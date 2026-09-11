const normalizeText = (value) => {
  return String(value ?? "")
    .replace(/\r/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

// ------------------------------------
// PHONE
// ------------------------------------

const normalizePhone = (value) => {
  if (!value) return "";

  let phone = String(value)
    .trim()
    .replace(/[^\d+]/g, "");

  if (phone.startsWith("+91")) {
    phone = phone.slice(3);
  } else if (phone.startsWith("91") && phone.length === 12) {
    phone = phone.slice(2);
  }

  return phone;
};

const isPhone = (line) => {
  const phone = normalizePhone(line);

  return /^\d{10}$/.test(phone);
};

// ------------------------------------
// HEADERS
// ------------------------------------

const HEADER_WORDS = new Set([
  "name",
  "fullname",
  "full name",
  "customer",
  "customer name",
  "client",
  "client name",
  "contact name",

  "location",
  "city",
  "address",
  "area",
  "place",
  "district",
  "state",
  "region",

  "phone",
  "phone number",
  "phone no",
  "mobile",
  "mobile number",
  "mobile no",
  "number",
  "contact",
  "contact number",
  "contact no",
  "telephone",
  "telephone number",
]);

const isHeader = (line) => {
  const normalized = normalizeText(line).toLowerCase();

  return HEADER_WORDS.has(normalized);
};

// ------------------------------------
// CLEAN OCR
// ------------------------------------

const cleanLines = (text) => {
  return text
    .split("\n")
    .map(normalizeText)
    .filter(Boolean)
    .filter((line) => !isHeader(line));
};

// ------------------------------------
// TEXT CHARACTERISTICS
// ------------------------------------

const containsLetters = (line) => {
  return /[a-zA-Z]/.test(line);
};

const containsNumbers = (line) => {
  return /\d/.test(line);
};

const isMostlyNumeric = (line) => {
  const digits = (line.match(/\d/g) || []).length;
  const letters = (line.match(/[a-zA-Z]/g) || []).length;
  return digits > letters;
};

// ------------------------------------
// NAME DETECTION
// ------------------------------------

const isLikelyName = (line) => {
  if (!line) return false;

  if (isPhone(line)) return false;

  if (isHeader(line)) return false;

  if (!containsLetters(line)) {
    return false;
  }

  if (line.length > 60) {
    return false;
  }

  if (containsNumbers(line)) {
    return false;
  }

  // A name normally contains at least
  // one alphabetic word.
  const words = line.split(" ");

  if (words.length > 6) {
    return false;
  }

  return true;
};

// ------------------------------------
// LOCATION DETECTION
// ------------------------------------

const isLikelyLocation = (line) => {
  if (!line) return false;

  if (isPhone(line)) return false;

  if (isHeader(line)) return false;

  if (!containsLetters(line)) {
    return false;
  }

  if (line.length > 80) {
    return false;
  }

  if (containsNumbers(line)) {
    return false;
  }

  return true;
};

// ------------------------------------
// SCORE NAME
// ------------------------------------

const scoreName = (line, distance, direction) => {
  if (!isLikelyName(line)) {
    return -Infinity;
  }

  let score = 0;

  // Prefer lines immediately before
  // the phone number.
  if (direction === "before") {
    score += 5;
  }

  if (distance === 1) {
    score += 5;
  }

  if (distance === 2) {
    score += 3;
  }

  if (distance === 3) {
    score += 1;
  }

  // Names commonly have 2-4 words.
  const words = line.split(" ");

  if (words.length >= 2) {
    score += 3;
  }

  if (words.length >= 2 && words.length <= 4) {
    score += 2;
  }

  // Avoid extremely short values.
  if (line.length >= 3) {
    score += 1;
  }

  return score;
};

// ------------------------------------
// SCORE LOCATION
// ------------------------------------

const scoreLocation = (line, distance, direction) => {
  if (!isLikelyLocation(line)) {
    return -Infinity;
  }

  let score = 0;

  // Locations can appear either before
  // or after the phone.
  if (distance === 1) {
    score += 4;
  }

  if (distance === 2) {
    score += 3;
  }

  if (distance === 3) {
    score += 1;
  }

  // A location is often shorter than
  // a person's full name.
  const words = line.split(" ");

  if (words.length <= 5) {
    score += 2;
  }

  // Address/location-like words.
  const locationHints = [
    "road",
    "street",
    "nagar",
    "colony",
    "sector",
    "phase",
    "market",
    "society",
    "vihar",
    "puram",
    "extension",
    "block",
    "district",
    "state",
    "town",
  ];

  const lower = line.toLowerCase();

  for (const hint of locationHints) {
    if (lower.includes(hint)) {
      score += 4;
      break;
    }
  }

  return score;
};

// ------------------------------------
// FIND NEARBY CANDIDATES
// ------------------------------------

const getNearbyCandidates = (lines, phoneIndex) => {
  const candidates = [];

  // Look before phone.
  for (let i = phoneIndex - 1; i >= Math.max(0, phoneIndex - 4); i--) {
    candidates.push({
      line: lines[i],
      distance: phoneIndex - i,
      direction: "before",
      index: i,
    });
  }

  // Look after phone.
  for (
    let i = phoneIndex + 1;
    i <= Math.min(lines.length - 1, phoneIndex + 4);
    i++
  ) {
    candidates.push({
      line: lines[i],
      distance: i - phoneIndex,
      direction: "after",
      index: i,
    });
  }

  return candidates;
};

// ------------------------------------
// PARSER
// ------------------------------------

export const parseImageLeads = (text) => {
  if (!text) {
    return [];
  }

  const lines = cleanLines(text);

  console.log("Cleaned OCR lines:", lines);

  const leads = [];

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];

    if (!isPhone(currentLine)) {
      continue;
    }

    const phone = normalizePhone(currentLine);

    const candidates = getNearbyCandidates(lines, i);

    console.log(`Candidates for phone ${phone}:`, candidates);

    // --------------------------------
    // NAME
    // --------------------------------

    const nameCandidates = candidates
      .map((candidate) => ({
        ...candidate,
        score: scoreName(
          candidate.line,
          candidate.distance,
          candidate.direction,
        ),
      }))
      .filter((candidate) => candidate.score > -Infinity)
      .sort((a, b) => b.score - a.score);

    // --------------------------------
    // LOCATION
    // --------------------------------

    const locationCandidates = candidates
      .map((candidate) => ({
        ...candidate,
        score: scoreLocation(
          candidate.line,
          candidate.distance,
          candidate.direction,
        ),
      }))
      .filter((candidate) => candidate.score > -Infinity)
      .sort((a, b) => b.score - a.score);

    let name = nameCandidates[0]?.line || null;

    let location = null;

    // --------------------------------
    // Prevent same line being used
    // for name and location
    // --------------------------------

    for (const candidate of locationCandidates) {
      if (candidate.line !== name) {
        location = candidate.line;

        break;
      }
    }

    // --------------------------------
    // FALLBACK
    // --------------------------------

    // If only one text line exists
    // around the phone, treat it as name.
    if (!name && locationCandidates.length) {
      name = locationCandidates[0].line;
    }

    leads.push({
      name,
      phone,
      location,
    });
  }

  // --------------------------------
  // REMOVE DUPLICATES
  // --------------------------------

  const uniqueLeads = [];

  const seenPhones = new Set();

  for (const lead of leads) {
    if (!lead.phone || seenPhones.has(lead.phone)) {
      continue;
    }

    seenPhones.add(lead.phone);

    uniqueLeads.push(lead);
  }

  console.log("Parsed image leads:", uniqueLeads);

  return uniqueLeads;
};

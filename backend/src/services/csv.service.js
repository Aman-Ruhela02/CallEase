import csv from "csv-parser";
import { Readable } from "stream";
import { mapLeadRow } from "../utils/leadMapper.js";

export const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const leads = [];
    Readable.from(buffer)
      .pipe(
        csv({
          mapHeaders: ({ header }) => header?.replace(/^\uFEFF/, "").trim(),
        }),
      )
      .on("data", (row) => leads.push(mapLeadRow(row)))
      .on("end", () => resolve(leads))
      .on("error", reject);
  });
};

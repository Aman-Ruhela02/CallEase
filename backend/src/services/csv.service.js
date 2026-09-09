import csv from "csv-parser";
import { Readable } from "stream";

import { mapLeadRow } from "../utils/leadMapper.js";

export const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const leads = [];

    const stream = Readable.from(buffer);

    stream
      .pipe(
        csv({
          mapHeaders: ({ header }) => header?.replace(/^\uFEFF/, "").trim(),
        }),
      )
      .on("data", (row) => {
        console.log("CSV ROW:", row);

        const lead = mapLeadRow(row);

        leads.push(lead);
      })
      .on("end", () => {
        resolve(leads);
      })
      .on("error", reject);
  });
};

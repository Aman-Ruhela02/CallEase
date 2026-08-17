import csv from "csv-parser";
import { Readable } from "stream";
import { mapCSVRow } from "../utils/csvMapper.js";

export const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const leads = [];

    const stream = Readable.from(buffer);

    stream
      .pipe(csv())
      .on("data", (row) => {
        console.log("CSV ROW:", row);

        const lead = mapCSVRow(row);

        leads.push(lead);
      })
      .on("end", () => {
        resolve(leads);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};
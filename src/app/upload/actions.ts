"use server";

import { checkDuplicateDOI } from "@/ai/flows/doi-checker";

export async function checkDoiUniqueness(doi: string) {
  if (!doi || doi.trim().length < 5) {
    return { isDuplicate: null, message: "" };
  }
  try {
    const result = await checkDuplicateDOI({ doi });
    return {
      isDuplicate: result.isDuplicate,
      message: result.isDuplicate
        ? "Warning: This DOI may already exist in the database."
        : "Success: This DOI appears to be unique.",
    };
  } catch (error) {
    console.error("DOI check error:", error);
    return {
      isDuplicate: null,
      message: "An error occurred while checking the DOI.",
    };
  }
}

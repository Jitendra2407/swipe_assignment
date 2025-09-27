// utils/textParser.js

// Regex patterns for extracting candidate information
const PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone:
    /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
  // Name pattern - looks for common name patterns at the beginning of resume
  name: /^([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/m,
};

/**
 * Extract candidate information from resume text
 * @param {string} text - Raw text from resume
 * @returns {object} Extracted candidate data
 */
export function extractCandidateInfo(text) {
  if (!text || typeof text !== "string") {
    return { name: "", email: "", phone: "", rawText: "" };
  }

  // Clean the text
  const cleanedText = text.trim();

  // Extract email
  const emailMatch = cleanedText.match(PATTERNS.email);
  const email = emailMatch ? emailMatch[0] : "";

  // Extract phone number
  const phoneMatch = cleanedText.match(PATTERNS.phone);
  let phone = "";
  if (phoneMatch) {
    // Format phone number consistently
    const digits = phoneMatch[0].replace(/\D/g, "");
    if (digits.length === 10) {
      phone = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
        6
      )}`;
    } else if (digits.length === 11 && digits.startsWith("1")) {
      phone = `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(
        7
      )}`;
    } else {
      phone = phoneMatch[0];
    }
  }

  // Extract name - try multiple approaches
  let name = "";

  // Method 1: Look for name at the beginning of the document
  const nameMatch = cleanedText.match(PATTERNS.name);
  if (nameMatch) {
    name = nameMatch[1];
  }

  // Method 2: If no name found, look for the first line that looks like a name
  if (!name) {
    const lines = cleanedText.split("\n").map((line) => line.trim());
    for (const line of lines) {
      if (
        line.length > 0 &&
        line.length < 50 &&
        /^[A-Z][a-zA-Z\s]+$/.test(line)
      ) {
        // Check if it's not an email or phone or common header words
        if (
          !line.includes("@") &&
          !PATTERNS.phone.test(line) &&
          !/(resume|cv|curriculum|vitae|profile|objective)/i.test(line)
        ) {
          name = line;
          break;
        }
      }
    }
  }

  return {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    rawText: cleanedText,
  };
}

/**
 * Validate extracted candidate information
 * @param {object} candidateData - Extracted data to validate
 * @returns {object} Validation result
 */
export function validateCandidateData(candidateData) {
  const errors = [];

  if (!candidateData.name) {
    errors.push("Name not found in resume");
  }

  if (!candidateData.email) {
    errors.push("Email not found in resume");
  } else if (!PATTERNS.email.test(candidateData.email)) {
    errors.push("Invalid email format");
  }

  if (!candidateData.phone) {
    errors.push("Phone number not found in resume");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

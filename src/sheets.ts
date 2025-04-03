import { google } from "googleapis";
import path from "path";

export async function appendToSheet(rows: string[][]) {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve(process.env.GOOGLE_CREDENTIALS_PATH || "./credentials.json"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    throw new Error("❌ GOOGLE_SHEET_ID não definido no .env");
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Commits!A:E",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: rows,
    },
  });

  console.log("📤 Dados enviados para a planilha com sucesso!");
}

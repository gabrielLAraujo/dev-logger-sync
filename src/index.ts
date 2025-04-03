import "dotenv/config";
import { getTodayCommits } from "./github";
import { appendToSheet } from "./sheets";

const githubUsername = process.env.GITHUB_USERNAME;
const repositories = process.env.REPOSITORIES?.split(",");
console.log(process.env);
console.log(process.env.GITHUB_USERNAME);
console.log(repositories);
if (!githubUsername || !repositories || repositories.length === 0) {
  console.error("⚠️ Verifique se GITHUB_USERNAME e REPOSITORIES estão definidos corretamente no .env");
  process.exit(1);
}

(async () => {
  console.log("🔍 Buscando commits de hoje para:", githubUsername);
  console.log("📦 Repositórios:", repositories);

  const commits = await getTodayCommits(githubUsername, repositories);

  const rows = commits.map((c) => {
    const date = new Date(c.date);
    return [
      date.toLocaleDateString("pt-BR"),
      c.repo,
      c.branch,
      c.message,
      date.toLocaleTimeString("pt-BR"),
    ];
  });

  console.log(rows);

  if (rows.length > 0) {
    await appendToSheet(rows);
    console.log(`✅ ${rows.length} commits enviados para a planilha.`);
  } else {
    console.log("ℹ️ Nenhum commit encontrado para hoje.");
  }
})();

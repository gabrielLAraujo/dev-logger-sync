import "dotenv/config";
import { getCommitsBetween } from "./github";
import { appendToSheet } from "./sheets";

const githubUsername = process.env.GITHUB_USERNAME;
const repositories = process.env.REPOSITORIES?.split(",");

if (!githubUsername || !repositories || repositories.length === 0) {
  console.error("⚠️ Verifique GITHUB_USERNAME e REPOSITORIES no .env");
  process.exit(1);
}

const today = new Date();
const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

function getDiaSemanaExtenso(date: Date) {
  return date.toLocaleDateString("pt-BR", { weekday: "long" });
}

function getEntradaSaida(date: Date): [string, string] {
  return date.getDay() === 5 ? ["07:00", "16:00"] : ["07:00", "17:00"];
}

(async () => {
  console.log(`🔍 Buscando commits de ${startOfMonth.toISOString()} até ${today.toISOString()}`);

  const commits = await getCommitsBetween(githubUsername, repositories, startOfMonth, today);

  // Agrupar commits por dia
  const commitsByDay = new Map<string, string[]>();
  for (const commit of commits) {
    const commitDate = new Date(commit.date).toLocaleDateString("pt-BR");
    const commitHora = new Date(commit.date).toLocaleTimeString("pt-BR");
    const descricaoCompleta = `[${commitHora} - ${commit.repo}] ${commit.message}`;

    if (!commitsByDay.has(commitDate)) {
      commitsByDay.set(commitDate, []);
    }
    commitsByDay.get(commitDate)?.push(descricaoCompleta);
  }

  const rows: string[][] = [];
  rows.push(["Dia da Semana", "Data", "Entrada", "Saída", "Descrição"]);

  const diasNoMes = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  for (let day = 1; day <= today.getDate(); day++) {
    const date = new Date(today.getFullYear(), today.getMonth(), day);
    const dataStr = date.toLocaleDateString("pt-BR");
    const diaSemana = getDiaSemanaExtenso(date);
    const [entrada, saida] = getEntradaSaida(date);
    const mensagens = commitsByDay.get(dataStr) || [];
    const descricao = mensagens.join(" | ");

    rows.push([
      diaSemana,
      dataStr,
      entrada,
      saida,
      descricao
    ]);
  }

  if (rows.length > 0) {
    await appendToSheet(rows);
    console.log(`✅ ${rows.length - 1} dias de expediente enviados para a planilha.`);
  } else {
    console.log("ℹ️ Nenhuma linha gerada.");
  }
})();

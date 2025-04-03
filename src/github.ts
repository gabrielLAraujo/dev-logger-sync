import { Octokit } from "@octokit/rest";

const github = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function getTodayCommits(username: string, repos: string[]): Promise<any[]> {
  const today = new Date();
  const since = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const until = new Date().toISOString();

  const allCommits: any[] = [];

  for (const repo of repos) {
    const { data: commits } = await github.repos.listCommits({
      owner: username,
      repo,
      since,
      until,
    });

    for (const commit of commits) {
      allCommits.push({
        date: commit.commit.author?.date,
        message: commit.commit.message,
        repo,
        sha: commit.sha,
        branch: commit.commit.tree?.sha.slice(0, 7),
      });
    }
  }

  return allCommits;
}

export async function getCommitsBetween(
  username: string,
  repos: string[],
  startDate: Date,
  endDate: Date
): Promise<any[]> {
  const since = startDate.toISOString();
  const until = endDate.toISOString();
  const allCommits: any[] = [];

  for (const repo of repos) {
    try {
      const { data: commits } = await github.repos.listCommits({
        owner: username,
        repo,
        since,
        until,
      });

      for (const commit of commits) {
        allCommits.push({
          date: commit.commit.author?.date,
          message: commit.commit.message,
          repo,
          sha: commit.sha,
          branch: commit.commit.tree?.sha.slice(0, 7),
        });
      }
    } catch (err: any) {
      console.error(`❌ Erro ao buscar commits do repositório "${repo}":`, err.message);
    }
  }

  return allCommits;
}


import axios from "axios";
import { parse } from "url";

const ignoredFiles = [
  "package.json",
  "package-lock.json",
  "node_modules",
  ".gitignore",
  "README.md",
  "yarn.lock",
];

function getRepoDetails(repoUrl: string) {
  const { pathname } = parse(repoUrl);
  const parts = pathname?.split("/").filter(Boolean);
  if (!parts || parts.length < 2) throw new Error("Invalid GitHub repository URL");

  return { owner: parts[0], repo: parts[1] };
}

async function fetchFromGitHub(path: string) {
  try {
    console.log(path);
    
    const response = await axios.get(`https://api.github.com${path}`, {
      headers: { "User-Agent": "node.js", Accept: "application/vnd.github.v3+json" },
    });

    return response.data;
  } catch (error) {
    throw new Error("GitHub API request failed");
  }
}

async function evaluateRepository(repoUrl: string): Promise<number> {
  try {
    const { owner, repo } = getRepoDetails(repoUrl);
    const files = await fetchFromGitHub(`/repos/${owner}/${repo}/contents/`);

    console.log(files);
    

    let score = 100;
    for (const file of files) {
      if (file.type === "file" && ignoredFiles.includes(file.name)) {
        score -= 10;
      }
    }

    return score;
  } catch (error) {
    console.error("Error evaluating repository:", error);
    return 0;
  }
}

export { evaluateRepository };


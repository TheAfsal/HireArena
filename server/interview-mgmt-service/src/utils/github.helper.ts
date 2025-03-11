// import https from "https";
// import { parse } from "url";

// const IGNORED_FILES = ["package.json", "node_modules", ".gitignore", "README.md"];

// class GitHubHelper {
//   private static getRepoDetails(repoUrl: string) {
//     const { pathname } = parse(repoUrl);
//     const parts = pathname?.split("/").filter(Boolean);
//     if (!parts || parts.length < 2) throw new Error("Invalid GitHub URL");
//     return { owner: parts[0], repo: parts[1] };
//   }

//   private static fetchFromGitHub(path: string): Promise<any> {
//     return new Promise((resolve, reject) => {
//       const options = {
//         hostname: "api.github.com",
//         path,
//         method: "GET",
//         headers: {
//           "User-Agent": "node.js",
//           Accept: "application/vnd.github.v3+json",
//         },
//       };

//       https.get(options, (res) => {
//         let data = "";
//         res.on("data", (chunk) => (data += chunk));
//         res.on("end", () => resolve(JSON.parse(data)));
//         res.on("error", reject);
//       });
//     });
//   }

//   static async fetchRepoFiles(repoUrl: string, path = ""): Promise<any[]> {
//     const { owner, repo } = this.getRepoDetails(repoUrl);
//     const files = await this.fetchFromGitHub(`/repos/${owner}/${repo}/contents/${path}`);

//     let collectedFiles: any[] = [];

//     for (const file of files) {
//       if (file.type === "file" && !IGNORED_FILES.includes(file.name)) {
//         const contentData = await this.fetchFromGitHub(file.url);
//         collectedFiles.push({
//           file: file.path,
//           content: Buffer.from(contentData.content, "base64").toString(),
//         });
//       } else if (file.type === "dir") {
//         const subFiles = await this.fetchRepoFiles(repoUrl, file.path);
//         collectedFiles.push(...subFiles);
//       }
//     }

//     return collectedFiles;
//   }
// }

// export default GitHubHelper;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateRepository = evaluateRepository;
const axios_1 = __importDefault(require("axios"));
const url_1 = require("url");
const ignoredFiles = [
    "package.json",
    "package-lock.json",
    "node_modules",
    ".gitignore",
    "README.md",
    "yarn.lock",
];
function getRepoDetails(repoUrl) {
    const { pathname } = (0, url_1.parse)(repoUrl);
    const parts = pathname?.split("/").filter(Boolean);
    if (!parts || parts.length < 2)
        throw new Error("Invalid GitHub repository URL");
    return { owner: parts[0], repo: parts[1] };
}
async function fetchFromGitHub(path) {
    try {
        console.log(path);
        const response = await axios_1.default.get(`https://api.github.com${path}`, {
            headers: { "User-Agent": "node.js", Accept: "application/vnd.github.v3+json" },
        });
        return response.data;
    }
    catch (error) {
        throw new Error("GitHub API request failed");
    }
}
async function evaluateRepository(repoUrl) {
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
    }
    catch (error) {
        console.error("Error evaluating repository:", error);
        return 0;
    }
}

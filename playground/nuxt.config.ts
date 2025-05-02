export default defineNuxtConfig({
    modules: ["../src/module"],
    "feedback-control.bs.js": {
        repo: "Feedback",
        owner: "DCC-BS",
        project: "feedback-control.bs.js",
        githubToken: process.env.GITHUB_TOKEN,
    },
    devtools: { enabled: true },
    compatibilityDate: "2025-02-17",
});

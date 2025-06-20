import { defineEventHandler, readBody } from "h3";
import { $fetch } from "ofetch";
import { useRuntimeConfig } from "#internal/nitro";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { message, rating } = body;
    const config = useRuntimeConfig();

    const moduleConfig = config["feedback-control.bs.js"] as {
        repo: string;
        owner: string;
        project: string;
        githubToken: string;
    };

    const repo = moduleConfig.repo;
    const owner = moduleConfig.owner;
    const project = moduleConfig.project;
    const messageWithRating = `Rating: ${rating}\n\n${message}`;

    const title = `${project} - ${message.substring(0, 20)}`;

    await $fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${moduleConfig.githubToken}`,
            "X-GitHub-Api-Version": "2022-11-28",
        },
        body: {
            title: title,
            body: messageWithRating,
            labels: [project, "feedback"],
        },
    });

    return {
        status: 200,
        message: "ok",
    };
});

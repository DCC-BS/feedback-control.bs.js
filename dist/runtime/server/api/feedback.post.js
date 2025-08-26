import { defineEventHandler, readBody } from "h3";
import { $fetch } from "ofetch";
import { EnvHttpProxyAgent } from "undici";
import { useRuntimeConfig } from "#internal/nitro";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { message, rating, email } = body;
  const config = useRuntimeConfig();
  const moduleConfig = config["feedback-control.bs.js"];
  const githubToken = config.githubToken || moduleConfig.githubToken;
  const repo = moduleConfig.repo;
  const owner = moduleConfig.owner;
  const project = moduleConfig.project;
  let messageWithDetails = `Rating: ${rating}

${message}`;
  if (email) {
    messageWithDetails += `

Contact Email: ${email}`;
  }
  const title = `${project} - ${message.substring(0, 20)}`;
  const agent = new EnvHttpProxyAgent();
  await $fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${githubToken}`,
      "X-GitHub-Api-Version": "2022-11-28"
    },
    dispatcher: agent,
    body: {
      title,
      body: messageWithDetails,
      labels: [project, "feedback"]
    }
  });
  return {
    status: 200,
    message: "ok"
  };
});

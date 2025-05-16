import { defineNuxtModule, createResolver, addComponentsDir, addServerHandler } from '@nuxt/kit';

const module = defineNuxtModule({
  meta: {
    name: "feedback-control.bs.js",
    configKey: "feedback-control.bs.js"
  },
  // Default configuration options of the Nuxt module
  defaults: {
    repo: "Feedback",
    owner: "DCC-BS"
  },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url);
    _nuxt.options.runtimeConfig["feedback-control.bs.js"] = {
      repo: _options.repo,
      owner: _options.owner,
      project: _options.project,
      githubToken: _options.githubToken
    };
    addComponentsDir({
      path: resolver.resolve("./runtime/components"),
      global: true,
      pathPrefix: false
    });
    addServerHandler({
      route: "/api/feedback",
      method: "post",
      handler: resolver.resolve("./runtime/server/api/feedback.post")
    });
  }
});

export { module as default };

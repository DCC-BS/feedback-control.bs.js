import {
    addComponentsDir,
    addServerHandler,
    createResolver,
    defineNuxtModule,
} from "@nuxt/kit";

export interface ModuleOptions {
    repo: string;
    owner: string;
    project: string;
    githubToken: string;
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: "feedback-control.bs.js",
        configKey: "feedback-control.bs.js",
    },
    // Default configuration options of the Nuxt module
    defaults: {
        repo: "Feedback",
        owner: "DCC-BS",
    },
    setup(_options, _nuxt) {
        const resolver = createResolver(import.meta.url);

        // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`

        _nuxt.options.runtimeConfig["feedback-control.bs.js"] = {
            repo: _options.repo,
            owner: _options.owner,
            project: _options.project,
            githubToken: _options.githubToken,
        };

        addComponentsDir({
            path: resolver.resolve("./runtime/components"),
            global: true,
            pathPrefix: false,
        });

        addServerHandler({
            route: "/api/feedback",
            method: "post",
            handler: resolver.resolve("./runtime/server/api/feedback.post"),
        });

        // examples:
        // addImportsDir(resolver.resolve('./runtime/composables'));
        // addTypeTemplate({ filename: 'types/commands.d.ts', src: resolver.resolve('./runtime/models/commands.d.ts') });
    },
});

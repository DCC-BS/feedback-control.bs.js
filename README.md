# feedback-control.bs.js

![GitHub package.json version](https://img.shields.io/github/package-json/v/DCC-BS/feedback-control.bs.js)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/DCC-BS/feedback-control.bs.js/publish.yml)
[![codecov](https://codecov.io/gh/DCC-BS/feedback-control.bs.js/graph/badge.svg?token=3PBNL8OR24)](https://codecov.io/gh/DCC-BS/feedback-control.bs.js)

Control for feedback in the DCC-BS ecosystem.

## Quick Setup

To install the module create a `.npmrc` next to your `package.json` file:

```txt
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@dcc-bs:registry=https://npm.pkg.github.com
```

Create a github [personal access token (classic)](https://github.com/settings/tokens/new) with `read:packages` permissions and add it to your `.env` file:

```txt
GITHUB_TOKEN='YOUR_TOKEN'
```

Install the module to your Nuxt application with:

```bash
bun add @dcc-bs/feedback-control.bs.js
```

Add it to your `nuxt.config.ts`:
```ts
export default defineNuxtConfig({
    ...
    modules: [
        '@dcc-bs/feedback-control.bs.js',
        ...
    ],
    "feedback-control.bs.js": {
        repo: "Feedback",
        owner: "DCC-BS",
        project: "myProject",
        githubToken: process.env.GITHUB_TOKEN,
    },
    ...
})
```

That's it! You can now use feedback-control.bs.js in your Nuxt app ✨

## Usage

Add the control to the app.vue
```html
<template>
  <div>
    <FeedbackControl />
    <NuxtPage />
  </div>
</template>
```

## Release a new Version
Commit your changes and then:
```sh
bun release
```
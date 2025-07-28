# feedback-control.bs.js

![GitHub package.json version](https://img.shields.io/github/package-json/v/DCC-BS/feedback-control.bs.js)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/DCC-BS/feedback-control.bs.js/publish.yml)
[![codecov](https://codecov.io/gh/DCC-BS/feedback-control.bs.js/graph/badge.svg?token=3PBNL8OR24)](https://codecov.io/gh/DCC-BS/feedback-control.bs.js)

Control for feedback in the DCC-BS ecosystem.

## Quick Setup
Install the module to your Nuxt application with:
```sh
bun add git+https://github.com/DCC-BS/feedback-control.bs.js.git#v1.1.0
```
replace `v1.1.0` with the latest version tag: ![GitHub package.json version](https://img.shields.io/github/package-json/v/DCC-BS/feedback-control.bs.js)

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
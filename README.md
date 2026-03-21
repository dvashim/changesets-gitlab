# @dvashim/changesets-gitlab

[![npm version](https://img.shields.io/npm/v/@dvashim/changesets-gitlab.svg?logo=npm&style=flat-square&color=07c&label=@dvashim/changesets-gitlab)](https://www.npmjs.com/package/@dvashim/changesets-gitlab) [![npm downloads](https://img.shields.io/npm/dm/@dvashim/changesets-gitlab?logo=npm&style=flat-square&color=07c)](https://www.npmjs.com/package/@dvashim/changesets-gitlab) [![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat-square&logo=biome&color=07c&logoColor=fff)](https://biomejs.dev)

> Based on project [`un-ts/changesets-gitlab`](https://github.com/un-ts/changesets-gitlab) by [JounQin](https://github.com/JounQin)

GitLab CI CLI for [changesets](https://github.com/atlassian/changesets), similar to the [GitHub Action](https://github.com/changesets/action). It creates a merge request with all of the package versions updated and changelogs updated, and when there are new changesets on the default branch, the MR will be updated. When you're ready, you can merge the merge request and either publish the packages to npm manually or set up the CLI to do it for you.

## Usage

### Inputs

> Note: environment variables are case-sensitive

- `INPUT_PUBLISH` - The command to use to build and publish packages
- `INPUT_VERSION` - The command to update version, edit CHANGELOG, read and delete changesets. Defaults to `changeset version` if not provided
- `INPUT_COMMIT` - The commit message to use. Default `Version Packages`
- `INPUT_TITLE` - The merge request title. Default `Version Packages`

#### Only available in `@dvashim/changesets-gitlab`

- `INPUT_PUBLISHED` - Command executed after publishing
- `INPUT_ONLY_CHANGESETS` - Command executed when only changesets are detected
- `INPUT_REMOVE_SOURCE_BRANCH` - Enables the merge request "Delete source branch" checkbox. Default `false`
- `INPUT_TARGET_BRANCH` - The merge request target branch. Defaults to the current branch
- `INPUT_CREATE_GITLAB_RELEASES` - Whether to create GitLab releases after publish. Default `true`
- `INPUT_LABELS` - A comma-separated string of labels to add to the version package merge request

### Outputs

- `PUBLISHED` - A boolean value indicating whether publishing happened
- `PUBLISHED_PACKAGES` - A JSON array of published packages. Format: `[{"name": "@xx/xx", "version": "1.2.0"}, {"name": "@xx/xy", "version": "0.8.9"}]`

### Environment Variables

```sh
GLOBAL_AGENT_HTTP_PROXY  # optional, if you're using a custom GitLab service under proxy
GLOBAL_AGENT_HTTPS_PROXY # as above but for https requests
GLOBAL_AGENT_NO_PROXY    # as above but for non-proxied requests

# http_proxy, https_proxy, no_proxy environment variables are also supported

GITLAB_HOST # optional, custom GitLab host, falls back to `CI_SERVER_URL` if not provided

GITLAB_TOKEN                           # required, token with access to push, package registries, and merge request APIs. Note: CI_JOB_TOKEN does not have sufficient permissions
GITLAB_TOKEN_TYPE                      # optional, type of the provided token. Defaults to personal access token. Set to `oauth` for GitLab OAuth tokens
GITLAB_CI_USER_NAME                    # optional, username for pushing, paired with the token (if personal access token). If not set, read from the GitLab API
GITLAB_CI_USER_EMAIL                   # optional, default `gitlab[bot]@users.noreply.gitlab.com`
GITLAB_COMMENT_TYPE                    # optional, type of the comment. Defaults to `discussion`. Set to `note` for a simple comment instead of a thread
GITLAB_COMMENT_DISCUSSION_AUTO_RESOLVE # optional, auto-resolve discussion when changeset is present. If you want to always resolve, use `GITLAB_COMMENT_TYPE=note` instead. Default `true`
GITLAB_COMMENT_CUSTOM_LINKS            # optional, override the links in the bot comment. Use {{ addChangesetUrl }} placeholder for the dynamic URL to add a changeset
GITLAB_ADD_CHANGESET_MESSAGE           # optional, default commit message for adding changesets on GitLab Web UI
DEBUG_GITLAB_CREDENTIAL                # optional, whether to log the remote URL with the token visible
```

### Example workflow

#### Without publishing

Create a file at `.gitlab-ci.yml` with the following content.

```yml
stages:
  - comment
  - release

comment:
  image: node:lts-alpine
  stage: comment
  before_script: pnpm install --frozen-lockfile
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
  script: pnpm changesets-gitlab comment

release:
  image: node:lts-alpine
  stage: release
  before_script: pnpm install --frozen-lockfile
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
  script: pnpm changesets-gitlab
```

#### With publishing

You'll need an [npm token](https://docs.npmjs.com/creating-and-viewing-authentication-tokens) that can publish the packages in the repo and doesn't have 2FA on publish enabled ([2FA on auth can be enabled](https://docs.npmjs.com/about-two-factor-authentication)). [Add it as a CI/CD variable](https://docs.gitlab.com/ee/ci/variables/#custom-cicd-variables) with the name `NPM_TOKEN`.

```yml
stages:
  - comment
  - release

comment:
  image: node:lts-alpine
  stage: comment
  before_script: pnpm install --frozen-lockfile
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
  script: pnpm changesets-gitlab comment

release:
  image: node:lts-alpine
  stage: release
  before_script: pnpm install --frozen-lockfile
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
  script: pnpm changesets-gitlab
  variables:
    INPUT_PUBLISH: pnpm release
```

By default, the CLI creates a `~/.npmrc` file with the `NPM_TOKEN` interpolated as the auth token for `registry.npmjs.org`. If a `.npmrc` file already exists, it will not be overwritten. This is useful if you need to configure `.npmrc` yourself:

```yml
script: |
  cat << EOF > "$HOME/.npmrc"
    email=my@email.com
    //registry.npmjs.org/:_authToken=$NPM_TOKEN
  EOF
```

#### With version script

If you need to add additional logic to the version command, you can use a version script.

When the version script is present, the CLI will run that script instead of `changeset version`, so make sure your script calls `changeset version` at some point. All changes made by the script will be included in the MR.

```yml
stages:
  - comment
  - release

comment:
  image: node:lts-alpine
  stage: comment
  before_script: pnpm install --frozen-lockfile
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
  script: pnpm changesets-gitlab comment

release:
  image: node:lts-alpine
  stage: release
  before_script: pnpm install --frozen-lockfile
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
  script: pnpm changesets-gitlab
  variables:
    INPUT_VERSION: pnpm version-packages
```

## Changelog

Detailed changes for each release are documented in [CHANGELOG.md](./CHANGELOG.md).

## License

[MIT](http://opensource.org/licenses/MIT) © [Aleksei Reznichenko](https://github.com/dvashim)

Originally created by [JounQin](https://github.com/JounQin) at [un-ts/changesets-gitlab](https://github.com/un-ts/changesets-gitlab).

# [1.1.0](https://github.com/bhouston/threeify/compare/v1.0.0...v1.1.0) (2020-06-13)


### Features

* **changelog:** store the commitizen git hook ([#34](https://github.com/bhouston/threeify/issues/34)) ([05f72f6](https://github.com/bhouston/threeify/commit/05f72f6ccb17146c8756aab6070bbb013ac76e7c))

# 1.0.0 (2020-06-13)


### Bug Fixes

* fix syntax error in index.ts ([89809f4](https://github.com/bhouston/threeify/commit/89809f453f6196ad7e286ddd6b10e9a8e6c5144e))


### Features

* **changelog:** implement semantic-release and release notes generator ([#33](https://github.com/bhouston/threeify/issues/33)) ([ce3b03d](https://github.com/bhouston/threeify/commit/ce3b03da9e99db8aff5aea14c4da25c79e2fabdb))


### Reverts

* Revert "Revert "Apply linting" - removed all .js extensions on imports." ([e8ba0a3](https://github.com/bhouston/threeify/commit/e8ba0a3e18ab7f5794041c2d6a67fe76a9f60b37))

# Changelog

All notable changes to this project will be documented in this file for each PR.
Ideally, a Github Action will vet changes to this file for a PR to be validated.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Maintenance of a changelog.
- Added glsl transpiler to JS modules.
- Added VirtualFramebuffer, CanvasFramebuffer.
- Added MaterialOutputFlags.
- Rename boxGeometry to box.
- Add count and offset to VertexAttributeGeometry, VertexArrayObject.

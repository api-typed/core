# 🥣 Api-Typed Framework

![Tests](https://github.com/api-typed/core/actions/workflows/tests.yml/badge.svg?branch=main)
![E2E Tests](https://github.com/api-typed/core/actions/workflows/e2e-tests.yml/badge.svg?branch=main)
![Lint](https://github.com/api-typed/core/actions/workflows/lint.yml/badge.svg?branch=main)
[![codecov](https://codecov.io/gh/api-typed/core/branch/main/graph/badge.svg?token=XF35AW6T60)](https://codecov.io/gh/api-typed/core)

🔥 **Early Alpha / PoC** - try at your own risk

Opinionated TypeScript framework built on the shoulders of giants.

Api-Typed combines several popular librariers into one framework removing the overhead of setting up a new project and wiring things up together:

- [TypeDI](https://github.com/typestack/typedi) for a friendly dependency injection container
- [TypeORM](https://typeorm.io/) for convenient working with databases
- [Routing Controllers](https://github.com/typestack/routing-controllers) with [express](https://expressjs.com/) for declarative HTTP endpoints definition
- [Commander](https://github.com/tj/commander.js) for building CLI programs
- [winston](https://github.com/winstonjs/winston) for logging

Api-Typed ties these powerful tools together and exposes a convenient pluggable modules design with easy configuration.

# Features

- `@ApiResource()` annotation on entities that automatically registers an LCRUD controller. [See docs](./docs/ApiResource.md)

# Documentation

TBD.

See `./docs` dir for now.

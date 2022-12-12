# Leave Tracker BACKEND API

# Description
- This is a simple leave tracker backend api built with 
  - Nodejs 
  - Express
  - Firestore
  - passportjs for authentication
  - swagger for documentation

# Installation
---
- Clone the repo
- Run `npm install` to install all dependencies
- add firebase.json file to the root directory [firebase.json download docs](https://firebase.google.com/docs/admin/setup#add_firebase_to_your_app)
- Run `npm run dev` to start the server

# Folder Structure
---
- `src` - contains all the source code
  - `config` - contains all the configuration files
  - `controllers` - contains all the controllers
  - `services` - contains all the services
  - `routes` - contains all the routes
  - `middlewares` - contains all the middlewares
  - `utils` - contains all the utility functions

# Future Plans

- [ ] firestore rules configuration
- [ ] Add more tests
- [ ] update swagger documentation
- [ ] implement lint restrictions and git commit hooks with husky.
- [ ] deploy on firebase functions

# commit Guidelines
---
## Why?

Clear and short explanation here.

## How?

- Done A (replace with a breakdown of the steps)
- Done B
- Done C

## Tickets?

- [Ticket 1](the-ticket-url-here)
- [Ticket 2](the-ticket-url-here)
- [Ticket 3](the-ticket-url-here)

## Contribution checklist?

- [ ] The commit messages are detailed
- [ ] It does not break existing features (unless required)
- [ ] I have performed a self-review of my own code
- [ ] Documentation has been updated to reflect the changes
- [ ] Tests have been added or updated to reflect the changes
- [ ] All code formatting pass
- [ ] All lints pass
- [ ] All tests pass

## Security checklist?

- [ ] Injection has been prevented (parameterized queries, no eval or system calls)
- [ ] The UI is escaping output (to prevent XSS)
- [ ] Sensitive data has been identified and is being protected properly

## Demo?

Optionally, provide any screenshot, gif or small video.

# 🙏 Contribution guidelines
---

- Create branches from the `main` branch and name it in accordance to **conventional commits** [here](https://www.conventionalcommits.org/en/v1.0.0/), or follow the examples bellow:


- test: :ring: Adding missing tests
- feat: :guitar: A new feature
- fix: :bug: A bug fix
- chore: :robot: Build process or auxiliary tool changes
- docs: :pencil2: Documentation only changes
- refactor: :bulb: A code change that neither fixes a bug or adds a feature
- style: :lipstick: Markup, white-space, formatting, missing semi-colons...


- The following example, demonstrates how to branch-out from `main`, creating a `test/a-test-scenario` branch and commit two changes!


- git checkout main

- git checkout -b test/a-test-scenario

- git commit -m 'test: verified X equals Z when Foobar'

- git commit -m 'refactor: input value changes'


- Here's an example of a refactor of an hypotetical `address-panel`:


- git checkout main

- git checkout -b refactor/address-panel

- git commit -m 'fix: font-size used in the address description'

- git commit -m 'refactor: simplified markup for the address panel'

# Contributors
---
- [Jane Doe](https://github.com/janeDoe)
# kiffarino/kfr

Kiffarino is a lightweight, local-first project management tool built for developers and small teams who prefer a simple, CLI and web-based workflow.  
It lets you manage tasks, tickets, and projects directly within your project folder — no complex setups, cloud services, or external tools required.  
Just fast, minimal, local productivity.

Loosely based on [kiffari](https://github.com/vikkio88/kiffari).

>Kiffari: from sicilian (Aju) Chiffari = I've got stuff to do.

## ✨ Features

- 🗃️ **Local-first ticket and task management** — Everything is stored locally in plain files, no cloud required.
- ⚡ **Lightweight** — Minimal dependencies, with a total size of ~600 KB.
- 🏷️ **Flexible ticketing** — Supports tags, filters, and status tracking out of the box.
- 🛠️ **Modern stack** — Built with TypeScript, Bun, and Svelte 5.
- 📝 **Markdown-based tickets** — Tickets are just Markdown files you can open and edit manually anytime.

## Installation

```bash
npm install -g kiffarino
```

**Help**
Displays a list of available commands and usage information.

```bash
kfr help
```

**Init**

Initializes your project by creating a .kfrc configuration file.
Use this file to define the path to your ticket/document folder and basic project settings.

```bash
kfr init
```

**Generate**

Generates the necessary folder structure for your ticket system, based on the .kfrc config.

```bash
kfr generate
```

**Start**

Starts the Kiffarino server locally.
By default, it runs on port 3003. You can specify a different port like this:

```bash
kfr start ## <- will start the server on port 3003
kfr start 5321
```

## TODOs
- [ ]  Cli
    - [ ] version

- [ ] Tickets

  - [ ] BE
    - [x] Create
    - [x] Read
    - [x] Update
    - [x] Delete
    - [x] Move
    - [ ] Archive
    - [ ] Link
    - [x] Tags CRUD
  - [ ] FE
    - [x] Create
    - [x] Read
    - [x] Update
    - [x] Delete
    - [x] Move
    - [ ] Archive
    - [ ] Link
    - [ ] Tags CRUD
    - [ ] Tags Search

- [ ] Docs

  - [ ] Create
  - [ ] Read
  - [ ] Update
  - [ ] Delete
  - [ ] Archive

- Nice to have
  - [ ] Tags
    - [ ] Implement Tags parsing
    - [ ] Implement Tags Filters/Update/Create (zod)
  - [x] Ticket type
  - [ ] Short code?
  - [ ] Markdown plugins (like todo checkboxes)
    - [ ] Move config to frontmatter
    - [ ] Add them in multiple sections so you can have different parts of the page
  - [ ] Epic link/Milestone
  - [ ] Add images on a subfolder and be able to serve it via public serve in api

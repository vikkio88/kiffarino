![Kiffarino Logo](/assets//logo.svg)

# kiffarino/kfr

Kiffarino is a lightweight, local-first project management tool built for developers and small teams who prefer a simple, CLI and Web based workflow tracking tool.

It lets you manage tasks, tickets, and projects directly within your project folder — no complex setups, cloud services, or external tools required.

Just fast, minimal, local productivity.

It's like Jira, but simple and it just works.

Loosely based on another side project of mine: [kiffari](https://github.com/vikkio88/kiffari).

> Kiffari: from sicilian (Aju) Chiffari = I've got stuff to do.


## ✨ Features

- 🗃️ **Local-first ticket and task management** — Everything is stored locally in plain files, no cloud required.
- ⚡ **Lightweight** — Minimal dependencies, with a total size of ~420 KB.
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
kfr start # <- will start the server on port 3003
kfr start 5321 # <- will start the server on port 5321
```

## TODOs

- [x] Cli

  - [x] version

- [x] Tickets

  - [x] BE

    - [x] Create
    - [x] Read
    - [x] Update
    - [x] Delete
    - [x] Move
    - [x] Archive
    - [x] Link
    - [x] Tags CRUD
    - [x] Priority Ordering

  - [x] FE

    - [x] Create
    - [x] Read
    - [x] Update
    - [x] Delete
    - [x] Move
    - [x] Archive
    - [ ] Show/Set Priority
    - [x] Link

      - [x] Search ticket to link
        - [x] BE Search
        - [x] Title Search moved to its own component

    - [x] Tags CRUD on Ticket
    - [x] Priority CRUD

- [ ] Docs

  - [ ] Create
  - [ ] Read
  - [ ] Update
  - [ ] Delete
  - [ ] Archive

- Bugs

  - Sending malformed JSON gives a 500

- Nice to have

  - [ ] Abstract db ops to drivers so could swap db for something else
  - [ ] Drag&Drop for Board
  - [ ] Routes to fetch Archived tickets
  - [x] Tags
    - [x] Tags Search
    - [x] Tags Autocomplete
    - [x] Implement Tags parsing
    - [x] Implement Tags Filters/Update/Create (zod)

  - [x] Ticket type
  - [ ] Short code?
  - [ ] Markdown plugins (like todo checkboxes)
    - [x] Move config to frontmatter
    - [x] Add them in multiple sections so you can have different parts of the page
    - [x] Imgs !\[Alt text\]\(/static/something.svg "a title"\)
  - [ ] Epic link/Milestone

  - [x] Add images on a subfolder and be able to serve it via public serve in api
    - [x] Picker to search for assets in public folder
    - [x] Folder is generated need to link static serve to local folder
    - [x] Folder forward on dev mode too
  
  - [ ] Add Github releases

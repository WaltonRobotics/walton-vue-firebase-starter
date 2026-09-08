# Setting Up a New Computer

This walks through getting a brand-new computer ready to work on this project.
**Windows** is covered in detail below since that's what most students use; a shorter
macOS/Linux version follows at the bottom.

## Windows

### 1. Install Git

Download and run the installer from [git-scm.com](https://git-scm.com/download/win). The
default options are fine — just click through the installer.

This also installs **Git Bash**, a terminal that understands Unix-style commands. It's a
good choice for this project since most tutorials and this guide use commands like `cp`
and `rm` that Windows' own Command Prompt doesn't understand.

_Prefer the command line?_ If you have [winget](https://learn.microsoft.com/windows/package-manager/winget/)
(built into modern Windows), you can instead run in PowerShell:

```powershell
winget install --id Git.Git -e
```

### 2. Install Node.js

This project needs Node **22.18 or newer** (check the `engines` field in `package.json`
for the exact requirement). Download the **LTS** installer from
[nodejs.org](https://nodejs.org/) and run it with default options.

```powershell
winget install --id OpenJS.NodeJS.LTS -e
```

Close and reopen your terminal, then confirm it installed:

```powershell
node --version
npm --version
```

### 3. Install VS Code

Download from [code.visualstudio.com](https://code.visualstudio.com/), or:

```powershell
winget install --id Microsoft.VisualStudioCode -e
```

Open this project folder in VS Code (`File > Open Folder…`). VS Code will prompt you to
install this project's recommended extensions (listed in `.vscode/extensions.json`) —
click **Install All**. They give you Vue syntax highlighting/type-checking (Volar),
auto-formatting on save (Prettier), and linting (ESLint).

### 4. Configure Git (one-time, per computer)

Git needs to know who you are before you can commit:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### 5. Get the project and install dependencies

```powershell
git clone <the repo's URL>
cd walton-vue-firebase-starter
npm install
```

### 6. Run it

No Firebase account or project needed — this project develops against local emulators.
Open **two** terminals:

```powershell
npm run emulators   # terminal 1
```

```powershell
npm run dev          # terminal 2
```

Open the URL the second command prints in your browser. See
[README.md](README.md) for what to try once it's running, and
[DEPLOY.md](DEPLOY.md) for when you're ready to put the app online.

### Troubleshooting (Windows)

- **"running scripts is disabled on this system"** when running `npm` in PowerShell:
  PowerShell is blocking scripts. Run PowerShell as Administrator once and execute
  `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, then reopen your terminal.
- **`npm install` is very slow or gets stuck**: this is usually antivirus scanning every
  file as it's written. Excluding your project folder and `%APPDATA%\npm-cache` from
  real-time scanning (in Windows Security settings) fixes it.
- **`cp` / `rm` / other commands "not recognized"**: you're in Command Prompt, not Git
  Bash. Open **Git Bash** instead (search for it in the Start menu), or use the
  PowerShell equivalents (`Copy-Item`, `Remove-Item -Recurse -Force`).
- **Node version too old**: uninstall Node from "Add or remove programs" and reinstall
  the current LTS from nodejs.org, or use [nvm-windows](https://github.com/coreybutler/nvm-windows)
  if you need to switch between Node versions.

## macOS or Linux

Install Git with your system package manager:

```sh
# macOS, using Homebrew (https://brew.sh)
brew install git

# Debian/Ubuntu Linux
sudo apt update && sudo apt install git
```

For Node.js, use **[nvm](https://github.com/nvm-sh/nvm)** (Node Version Manager) rather
than installing Node directly from Homebrew/apt. This project needs Node 22.18+ (see the
`engines` field in `package.json`), and nvm lets you install and switch Node versions
per-project instead of being stuck with whatever version your system happens to have —
useful the first time you work on a second project that needs a different one.

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Close and reopen your terminal (or run `source ~/.bashrc` / `source ~/.zshrc`), then:

```sh
nvm install --lts
nvm use --lts
node --version
npm --version
```

This repo has a `.nvmrc` file, so once you `cd` into it you can just run `nvm use` and
it'll pick the right version automatically.

Then install [VS Code](https://code.visualstudio.com/) and its recommended extensions,
configure Git the same way as step 4 above, and continue from step 5.

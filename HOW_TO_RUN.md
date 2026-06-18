# How to run the Azwa website — step by step (Windows)

This guide gets the caregiver-support website running on your own computer, from
zero to an open browser tab. Follow the steps **in order**.

> **The golden rule:** every command in this guide is run from inside the
> project folder **`D:\trial\caregiver-platform`** — *not* `D:\trial`.
> If a command says "Missing script: dev", you are in the wrong folder.

---

## 0. What you need first (one time only)

- **Node.js version 20.9 or newer** (this project uses Next.js 16, which refuses
  to run on older Node). You currently have a compatible version installed.
- A terminal. Use **Windows PowerShell** *or* the **VS Code integrated terminal**
  (in VS Code: menu **Terminal → New Terminal**). Either works.

**Check Node is OK** — open the terminal and type:

```powershell
node -v
```

You should see something like `v20.x` or `v22.x`. If you see `v18` or lower, or
"command not found", install Node from <https://nodejs.org> (pick the **LTS**
version), close the terminal, reopen it, and check again.

---

## 1. Go to the project folder

In the terminal, type this and press Enter:

```powershell
cd D:\trial\caregiver-platform
```

Confirm you are in the right place — this should list `package.json`,
`app`, `lib`, etc.:

```powershell
dir
```

---

## 2. Install the dependencies (first time, and after any code update)

```powershell
npm install
```

This downloads everything the site needs into a `node_modules` folder. It can
take a minute or two the first time. You only need to repeat it if `node_modules`
is missing or `package.json` changed.

---

## 3. Add your Groq API key

The key lives in the file **`D:\trial\caregiver-platform\.env.local`**.
Open it in VS Code (or Notepad) and make sure this line has your key:

```
GROQ_API_KEY=gsk_your_key_here
```

- Get a key at <https://console.groq.com/keys>.
- **Without a key the site still runs** — the chatbot just uses its built-in
  rule-based explanations instead of Groq-written ones.
- After editing `.env.local`, you must **restart** the dev server (Step 5) —
  environment files are only read when the server starts.

---

## 4. Start the website (development mode)

```powershell
npm run dev
```

Wait until you see:

```
✓ Ready in ...ms
- Local:   http://localhost:3000
```

The terminal will stay busy — that is normal. It is the running server. **Leave
this terminal window open** while you use the site.

---

## 5. Open it in your browser

Go to:

```
http://localhost:3000
```

Try the walkthrough:

1. **Home** → click **"Get started"** to reach **Sign in to Azwa**. Enter any
   name and phone number (the demo sends no code) and continue.
2. **Tell us about your care journey** → answer the quick questionnaire (who you
   care for, their needs, your goals) and submit.
3. **My Care Plan** → see workshops and support tailored to your answers.
4. **Find Support** → in the assistant panel click **"Yes, continue"**, type
   something like *"I feel overwhelmed and exhausted"* and press **Send**. You'll
   get suggestions written by Groq, each with **Book** and **Talk to a person**.
5. Visit **Care Workshops** (register), **Our Partners**, and **Talk to Our
   Team**.
6. Use the language buttons in the top bar to switch **English ⇄ العربية**
   (Arabic flips the whole layout right-to-left).

---

## 6. Stop the website

Click the terminal window and press:

```
Ctrl + C
```

(If asked "Terminate batch job (Y/N)?", type `Y` and Enter.)

---

## Everyday routine (after the first setup)

Once Step 0–3 are done, starting the site again is just:

```powershell
cd D:\trial\caregiver-platform
npm run dev
```

…then open <http://localhost:3000>, and `Ctrl + C` to stop.

---

## Optional: production build (faster, what you'd deploy)

Development mode (`npm run dev`) is for editing. To run the optimized version:

```powershell
cd D:\trial\caregiver-platform
npm run build
npm run start
```

`npm run build` compiles the site once; `npm run start` then serves it at
<http://localhost:3000>. Rebuild after any code change.

---

## Add your solution logo

Right now the brand in the top-left of every page and on the home hero is the
**text wordmark "Azwa / أزوة"** — there is no image logo yet. To use your own
logo image, do these two small steps.

**Step A — drop the file in.** Put your logo here (create the `brand` folder if
it isn't there):

```
D:\trial\caregiver-platform\public\images\brand\logo.png
```

- A **transparent PNG** or **SVG** works best. Aim for roughly **200×60** (a wide
  shape) so it sits neatly in the top bar.
- You can name it anything; just match the name in Step B. We'll assume
  `logo.png`. Anything under `public\` is served from the site root, so this file
  becomes the web address **`/images/brand/logo.png`**.

**Step B — show it in the top bar.** Open
**`app\_components\Header.tsx`** and find this line (around line 43):

```tsx
<span className="azwa-wordmark">{t("meta.appName")}</span>
```

Replace that one line with:

```tsx
<img src="/images/brand/logo.png" alt={t("meta.appName")} className="h-9 w-auto" />
```

Save the file — if `npm run dev` is running, the page reloads and your logo
appears in the top-left, still clickable back to Home. (Adjust `h-9` up or down
to resize: `h-8` smaller, `h-10`/`h-12` bigger.)

**Optional — the big home-page hero.** The large animated "Azwa أزوة" on the
landing page lives in **`app\_components\BrandHero.tsx`** (the `<h1>` around
lines 19–24). If you also want your logo there instead of the animated text,
replace that `<h1>…</h1>` block with, for example:

```tsx
<img src="/images/brand/logo.png" alt="Azwa" className="h-16 w-auto sm:h-20" />
```

> Tip: if the logo doesn't show, the file name/path is usually the culprit —
> confirm it's exactly `public\images\brand\logo.png` and that you typed
> `/images/brand/logo.png` (forward slashes) in the code.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `Missing script: "dev"` | You're in the wrong folder. Run `cd D:\trial\caregiver-platform` first. |
| `npm install` errors | Delete the `node_modules` folder and `package-lock.json`, then run `npm install` again. |
| Chatbot says "rule-based" instead of using Groq | Key missing/typo in `.env.local`, or you didn't restart the server after editing it. Stop (`Ctrl+C`) and run `npm run dev` again. |
| Groq model error in the terminal | Your plan may not include the default model. In `.env.local` set `GROQ_MODEL=llama-3.1-8b-instant` and restart. |
| "Port 3000 is already in use" | Another server is still running. Close other terminals, or start on a different port: `npm run dev -- -p 3001` and open <http://localhost:3001>. |
| Page won't load / blank | Look at the terminal running `npm run dev` for a red error message — it tells you the file and line. |
| Node version error | Install Node.js 20.9+ (LTS) from <https://nodejs.org>, reopen the terminal. |

---

## Where things live (if you want to change content)

Search the whole project for the text **`WHAT CAN WE EDIT`** to find every safe
editing point. Quick map:

- **API key / model / your chatbot prompt** → `.env.local`
- **Chatbot prompt (built-in)** → `lib/assistant/prompt.ts`
- **Chatbot keyword rules / emergency words** → `lib/assistant/pipeline.ts`
- **Services, trainings, centers (the demo data)** → `lib/data/seed.ts`
- **Brand colours & fonts** → `app/globals.css`
- **Your logo** → drop `public/images/brand/logo.png`, then edit `app/_components/Header.tsx` (see "Add your solution logo" above)
- **Photos** (services / workshops / partners) → `public/images/<folder>/<id>.<ext>` (see `public/images/README.md`)
- **English / Arabic wording** → `lib/i18n/dictionaries/en.json` and `ar.json`

After editing a code file while `npm run dev` is running, just save — the page
reloads automatically. After editing `.env.local`, restart the server.

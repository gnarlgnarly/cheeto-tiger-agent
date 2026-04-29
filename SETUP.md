# 🐅 CHEETO TIGER — Telegram Agent Setup
## Dummy-proof edition. Follow every step exactly.

---

## STEP 1 — Get your Anthropic API key (the AI brain)

1. Go to **https://console.anthropic.com**
2. Sign up or log in
3. Click **"API Keys"** in the left sidebar
4. Click **"Create Key"**, give it a name like `cheeto-tiger`
5. **Copy the key** — it looks like: `sk-ant-api03-XXXX...`
6. Paste it somewhere safe. You only see it once.

---

## STEP 2 — Create a Telegram Bot and get its token

1. Open **Telegram** (phone or desktop)
2. Search for **@BotFather** and open the chat
3. Send the message: `/newbot`
4. When asked for a name, type: `Cheeto Tiger`
5. When asked for a username, type: `mfcheetotiger_bot` (or any name ending in `_bot`)
6. BotFather will give you a token that looks like: `7123456789:AAFxxx...`
7. **Copy that token.**

---

## STEP 3 — Fill in the config file

1. In this folder (`cheeto-tiger-agent`), find the file called `.env.example`
2. Make a **copy** of it and rename the copy to `.env`
   - On Windows: right-click → Copy → Paste → rename to `.env`
   - Or in terminal: `cp .env.example .env`
3. Open `.env` in any text editor (Notepad is fine)
4. Fill in these lines:

```
ANTHROPIC_API_KEY=sk-ant-api03-paste-your-key-here

TELEGRAM_BOT_TOKEN=7123456789:AAFpaste-your-token-here
```

5. Leave everything else as-is for now. Save the file.

---

## STEP 4 — Install Node.js (if you haven't)

1. Go to **https://nodejs.org**
2. Download the **LTS** version (big green button)
3. Install it — just click Next → Next → Finish
4. To confirm it worked: open a terminal and type `node --version`
   - You should see something like `v22.x.x`

---

## STEP 5 — Install dependencies

Open a terminal **in this folder** (the `cheeto-tiger-agent` folder):

- **Windows**: right-click the folder → "Open in Terminal"  
  OR open Command Prompt and type: `cd C:\path\to\cheeto-tiger-agent`

Then run:
```
npm install
```

Wait for it to finish. It will download everything the bot needs.

---

## STEP 6 — Start the bot

In the same terminal, run:
```
npm run start
```

You should see:
```
🐅 BOOTING APEX UNIT
[ OK ] character loaded: Cheeto Tiger
[ OK ] pressurizing GPPT-Mk7 giraffe-piss turbines... 88.7%
[ OK ] APEX UNIT ONLINE. stay orange. 🐅
```

---

## STEP 7 — Test it

1. Open Telegram
2. Search for your bot by the username you chose (e.g. `@mfcheetotiger_bot`)
3. Send it a message like `gm`
4. It should reply within a few seconds

---

## Keeping it running 24/7

The bot only runs while the terminal is open. To keep it running permanently:

**Easy option**: Leave your computer on with the terminal open.

**Better option**: Use a cheap VPS (Virtual Private Server):
- Sign up at **https://www.vultr.com** or **https://digitalocean.com**
- Create a $6/month Ubuntu server
- Upload this folder to the server
- Run `npm install && npm run start`
- Use `pm2` to keep it alive: `npm install -g pm2 && pm2 start "npm run start" --name cheeto-tiger`

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Error: invalid API key` | Check your ANTHROPIC_API_KEY in `.env` — no extra spaces |
| `Error: 401 Unauthorized` | Your Telegram token is wrong — re-copy from BotFather |
| Bot doesn't reply | Make sure the terminal is still running `npm run start` |
| `Cannot find module` | Run `npm install` again |
| Port already in use | Close other terminals and try again |

---

## ⚠️ IMPORTANT — Keep your `.env` file private

- **Never share the `.env` file** — it contains your API keys
- **Never post it on GitHub** — it's already in `.gitignore` so git won't include it
- If your keys leak, go to each site and regenerate them immediately

---

🐅 **STAY ORANGE.**

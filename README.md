# 🎂 Birthday Reminder

*Never miss a special day.* A React + Bootstrap 5 app that shows whose birthday is this month, with profile pictures, countdowns, confetti for birthdays today, and everything stored privately in your browser (LocalStorage). No backend.

## 1. Create the project (how this one was made)
```bash
mkdir birthday-reminder && cd birthday-reminder
npm init -y
npm i react react-dom bootstrap react-icons
npm i -D vite @vitejs/plugin-react
```
Then add `index.html`, `vite.config.js` and the `src/` folder from this repo and set `"type": "module"` plus the `dev` / `build` / `preview` scripts in `package.json`.

## 2. Install
```bash
npm install
```

## 3. Run
```bash
npm run dev        # http://localhost:5173
```

## 4. Folder guide
```
src/
├── main.jsx                 entry: loads Bootstrap CSS, App.css, mounts <App/>
├── App.jsx                  app state: view, selected month, modals, toast
├── App.css                  design tokens, cards, animations, responsive rules
├── components/
│   ├── Header.jsx           navbar, hero title, tagline, live date
│   ├── Dashboard.jsx        month view: banner, stats, nav, selector, cards
│   ├── BirthdayCard.jsx     the premium card (+ special "today" variant)
│   ├── BirthdayCelebration  confetti / balloons layer
│   ├── TodayBanner.jsx      "Happy Birthday, X!" / "3 people are celebrating…"
│   ├── Statistics.jsx       Total / This Month / Upcoming / Today
│   ├── MonthSelector.jsx    12 month pills
│   ├── MonthNavigation.jsx  ← Previous | November 2026 | Next →
│   ├── BirthdayList.jsx     "All Birthdays" with name search
│   ├── BirthdayModal.jsx    add/edit modal  ─┐
│   ├── BirthdayForm.jsx     validated form   ├─ built on Modal.jsx (accessible)
│   ├── ConfirmDeleteModal   "Are you sure…?" ┘
│   ├── ImageUploader.jsx    picker + instant preview
│   ├── Avatar.jsx           photo with initials fallback
│   ├── EmptyState.jsx       illustrated empty state
│   └── Toast.jsx            small confirmations
├── hooks/
│   ├── useBirthdays.js      state + write-through persistence
│   └── useToday.js          current date; refreshes at midnight
├── utils/
│   ├── dateUtils.js         age, countdown, leap years, formatting
│   ├── storageUtils.js      load / save / add / update / delete helpers
│   └── imageUtils.js        validate, crop, resize, Base64
└── data/sampleBirthdays.js  demo people, placed relative to today's date
```

## 5. How LocalStorage works
* All people live in one key: `birthday-reminder:birthdays:v1` as a JSON array of
  `{ id, name, photo, day, month, year }` (photo is a Base64 data URL).
* `loadBirthdays()` runs once at startup. First visit → sample people are saved.
  If you delete everyone, the empty list is saved, so samples never come back.
* Every add / edit / delete updates React state **and** calls `saveBirthdays()`.
* Safety nets: corrupted JSON is backed up to `birthday-reminder:corrupt-backup` and the
  app starts fresh with a friendly message; invalid records are skipped; blocked or full
  storage shows a warning instead of crashing.

## 6. How image upload works
1. You pick a JPG / PNG / WEBP (anything else, or > 10 MB, is rejected with a message).
2. `FileReader` turns the file into a data URL, which is decoded in an `<Image>`.
3. It is centre-cropped to a square, drawn on a 320×320 canvas and exported as JPEG
   (quality 0.85) — typically 15–40 KB, so LocalStorage's ~5 MB goes a long way.
4. The preview updates instantly; saving stores the Base64 string with the person.
5. Editing keeps the existing photo unless you choose a new one (or press Remove).
6. No photo, or a broken one → a gradient avatar with initials is shown.

## 7. Build for production
```bash
npm run build      # outputs ./dist
npm run preview    # test the production build locally
```
`vite.config.js` uses `base: './'`, so the build works from any URL or sub-path.

## 8. Deploy
**Netlify** – push to GitHub → "Add new site → Import" → build command `npm run build`, publish directory `dist`.
(Or drag the `dist` folder onto app.netlify.com/drop.)

**Vercel** – push to GitHub → "Add New → Project" → framework preset *Vite* (auto-detected). Deploy.

**GitHub Pages**
```bash
npm i -D gh-pages
# add to package.json scripts:  "deploy": "npm run build && gh-pages -d dist"
npm run deploy
```
Then in the repo: Settings → Pages → Source: branch `gh-pages`.

## Notes
* Feb 29 birthdays are celebrated (and age up) on Feb 28 in non-leap years.
* "Birthday passed" is shown on month cards once this year's date is behind you;
  the All Birthdays list always counts down to the next one.
* "Upcoming" in the stats = birthdays in the next 30 days (excluding today).

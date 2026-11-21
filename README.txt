# Old portfolio template update

Files:
- `index.html` — your old portfolio design, updated with experience cards and without the BMS simulator.
- `experience.html` — one reusable detail-page template. Every experience card opens this page with its own role.
- `experience-data.js` — the experience records used by both pages.

## Add another experience
Open `experience-data.js` and add another object inside the `window.PORTFOLIO_EXPERIENCES` array. Give it a unique `slug`, then fill in `title`, `company`, `location`, `dates`, `summary`, `overview`, `responsibilities`, and `skills`.

Example:
```js
{
  slug: "new-role",
  title: "New Role",
  company: "Company Name",
  location: "Dubai, UAE",
  dates: "Month Year – Month Year",
  summary: "Short summary shown on the portfolio card.",
  overview: "A fuller introduction shown on the detail page.",
  responsibilities: ["Responsibility one", "Responsibility two"],
  skills: ["Skill one", "Skill two"]
}
```
The card will automatically link to `experience.html?role=new-role`. No separate HTML page is needed for each future role.

Keep all three files in the same folder. If you publish this as a GitHub Pages site, make sure all three are deployed together.

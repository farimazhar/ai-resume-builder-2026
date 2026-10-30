# ResumeCraft — AI Resume Builder

A clean, responsive resume builder that helps users create an ATS-friendly resume, preview it live, and save it as a PDF.

## Features

- Responsive editor and live resume preview
- Personal details, professional summary, work experience, education, skills, projects and certifications
- Local writing suggestion for a professional summary
- Resume completeness indicator
- Autosaves data in the browser using `localStorage`
- Print-ready A4 layout — use **Download PDF** and choose **Save as PDF**
- No backend, account, or API key required

## Run locally

No build step or dependencies are required.

1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Fill in your details and use **Download PDF** to export.

You can also run a local static server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## About the AI feature

The summary helper currently creates an editable, rule-based writing suggestion in the browser. It does **not** call a generative AI model. To add true AI generation, connect a backend endpoint and keep your provider API key on the server — never expose secret API keys in frontend JavaScript.

## Project structure

```text
ai-resume-builder/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## Customization

- Edit colors in the `:root` block in `styles.css`.
- Update the resume layout in `index.html` and print styles at the bottom of `styles.css`.
- Extend the fields and preview rendering in `app.js`.

## License

MIT — feel free to use, modify, and contribute.

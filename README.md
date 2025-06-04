# Dorian Web

This repository contains a simple static demo for the Dorian Emotional Universe simulation. The application consists entirely of client-side JavaScript modules so it can be served directly from GitHub Pages.

## Development

To view the site locally, run a static server from the repository root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html` in your browser.

## Deployment

The HTML page and its JavaScript modules use relative paths so they work when hosted at `https://<username>.github.io/<repository>/`.

## Testing

Run the placeholder npm test command:

```bash
npm test
```

This repository currently has no automated tests.

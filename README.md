# Weaviate Add Collection (minimal)

A minimal React app (Vite) with a Collection component to compose a Weaviate collection JSON.

Quick start (macOS, zsh):

```bash
# install deps
npm install

# start dev server
npm run dev
```

How it works:
- Open the app at http://localhost:5173 (default Vite port).
- Fill the name and description fields. The generated JSON will update live below the form.
- You can also import a JSON file with `name` and `description` keys to prepopulate the form.

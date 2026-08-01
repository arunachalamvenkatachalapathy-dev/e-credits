# BOM-to-LCI Semantic Mapping Tool

MVP implementation of a BYOL-safe decision-support assistant for mapping BOM line items to LCI background processes.

## Legal/data posture

- No shared ecoinvent index is included.
- Seed data is synthetic/open-data-style demonstration data only.
- ecoinvent import is intended for a client's private licensed deployment.
- Outputs require human practitioner review before use in regulated reporting.

## Run locally

Backend:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python seed.py
uvicorn app.main:app --reload --port 8000
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open the frontend URL shown by Vite. The API defaults to `http://localhost:8000`.

Quick static preview:

```powershell
.\open-preview.ps1
```

This opens `preview.html`. It is a standalone demo and should not be confused with the Ollama service URL.

## Demo flow

1. Register or log in.
2. Create a project.
3. Upload a CSV with columns like `description`, `quantity`, `unit`.
4. Review matches, expand rows for DQR reasoning, approve or override.
5. Export approved/overridden mappings as CSV or JSON.

## Web review assistant

The preview and React UI include a browser-side review assistant for demo/product workflow guidance. It does not require Ollama, an API key, or a locally running model.

The backend still includes `/ai/chat` as an optional future integration point, but the webpage works without it.

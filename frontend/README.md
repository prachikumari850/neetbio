# NEETBIO – Biology for NEET

# For Running the webapp

# Terminal 1 – from neetbio/backend, virtual environment active
cd backend
.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload

# Terminal 2 – from neetbio/frontend
cd frontend
npm run dev
npm run lint
npm run build
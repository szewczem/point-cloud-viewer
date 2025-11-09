# ---------- Build frontend ----------
FROM node:22-alpine AS frontend-builder

WORKDIR /frontend

# Copy and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy the rest of the frontend code and build
COPY frontend/. .
RUN npm run build


# ---------- Build backend ----------
FROM python:3.12-slim AS backend

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Copy built frontend
COPY --from=frontend-builder /frontend/dist ./frontend_dist

# Expose FastAPI port
EXPOSE 8000

# ---------- Run app ----------
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

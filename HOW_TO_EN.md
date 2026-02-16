# 🚀 Fullstack Dockerized Infrastructure

This repository contains a complete, production-ready containerized infrastructure for a Fullstack application featuring a FastAPI Backend, React (Vite) Frontend, PostgreSQL Database, and Redis (for DDoS Middleware/Rate Limiting).

🏗️ What’s Included?

1. Streamlined Project Structure

backend/: FastAPI application, unit/integration tests, and a Dockerfile based on python:3.11-slim.

frontend/: React + Vite application with a multi-stage Dockerfile (Build & Serve).

docker-compose.yml: The main orchestrator connecting all services into a unified network.

1. Automated Backend Initialization

Lifespan Management: The backend automatically initializes database tables upon startup (unless in TESTING mode), removing the need for manual migrations during the first deployment.

DDoS Protection: Integrated Redis support for the security middleware to handle rate limiting and connection tracking.

1. Production-Ready Frontend

Multi-stage Build: Uses Node.js for the build phase and a lightweight Nginx server for the final production image.

Nginx Reverse Proxy: Configured to handle SPA routing (try_files) and proxy /api requests to the backend while preserving the client's real IP (X-Real-IP), which is essential for DDoS protection.

1. Comprehensive Testing Suite

E2E (Playwright): End-to-End test scenarios in tests/e2e/test_user_flows.py simulating real user journeys: Registration ➔ Login ➔ Profile Management.

🛠️ Getting Started
Prerequisites

Docker and Docker Compose installed on your machine.

Launching the Stack

Run the following command in the project root directory:

code
Bash
download
content_copy
expand_less
docker-compose up --build

Note: The --build flag ensures all images are updated with your latest code changes.

🌐 Service Map
Service URL Description
Frontend <http://localhost> Client Application (Port 80)
API Docs <http://localhost/api/docs> Interactive Swagger UI (via Nginx)
Backend API <http://localhost:8000> Direct Backend Access
🧪 Running Tests
Backend Tests (Unit, Security, DDoS)

These tests should be executed inside the running backend container to ensure environment parity.

code
Bash
download
content_copy
expand_less

## Run all backend tests

docker exec -it legal_backend pytest

## Run a specific test module (e.g., Security)

docker exec -it legal_backend pytest tests/test_security.py
E2E Tests (Playwright)

E2E tests require a browser environment and should be run locally while the Docker stack is active.

code
Bash
download
content_copy
expand_less

## 1. Navigate to the backend directory and activate your venv

cd backend
source .venv/bin/activate

## 2. Set the Base URL to the Frontend (Nginx)

export BASE_URL=<http://localhost>

## 3. Execute E2E tests

pytest tests/e2e

Requirement: Ensure you have run pip install pytest-playwright and playwright install beforehand.

🔒 Security & Scalability

RBAC: Robust Role-Based Access Control logic integrated into the backend.

Network Isolation: The Database and Redis are not exposed to the public internet; they are only accessible to the backend within the internal Docker network.

Middleware: Real-time traffic monitoring and protection via the Redis-backed DDoS layer.

Status: Deploy-Ready

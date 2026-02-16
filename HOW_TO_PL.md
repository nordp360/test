# 🚀 Fullstack Dockerized Infrastructure

Niniejsza dokumentacja opisuje kompletną architekturę konteneryzacji aplikacji, obejmującą Backend (FastAPI), Frontend (React + Vite), Bazę Danych (PostgreSQL) oraz Redis (DDoS Middleware).

1. Uporządkowana Struktura Projektu

   backend/: Aplikacja FastAPI, testy jednostkowe/integracyjne oraz Dockerfile oparty na obrazie python:3.11-slim.

   frontend/: Aplikacja React (Vite) z dedykowanym Dockerfile (Multi-stage build) i konfiguracją Nginx.

   docker-compose.yml: Główny orkiestrator spinający wszystkie usługi w jedną sieć.

2. Automatyzacja i Backend

   Lifespan Management: Backend automatycznie inicjalizuje tabele w bazie danych przy starcie (poza trybem TESTING), eliminując konieczność manualnych migracji przy pierwszym uruchomieniu.

   Security & DDoS Protection: Integracja z Redisem w celu obsługi Rate Limitingu i ochrony przed atakami DDoS.

3. Production-Ready Frontend

   Multi-stage Build: Pierwszy etap buduje aplikację (Node.js), drugi serwuje gotowe pliki statyczne przez lekki serwer Nginx.

   Nginx Reverse Proxy: Skonfigurowany pod routing SPA (try_files) oraz przekazywanie zapytań /api do backendu z zachowaniem nagłówków X-Real-IP (kluczowe dla zabezpieczeń).

4. System Testowy

   E2E (Playwright): Dodano scenariusze testowe w tests/e2e/test_user_flows.py, które symulują realne zachowanie użytkownika: Rejestracja ➔ Logowanie ➔ Zarządzanie Profilem.

🛠️ Jak uruchomić aplikację?

Wymagany zainstalowany Docker oraz Docker Compose.

code
Bash
download
content_copy
expand_less

## docker-compose up

Polecenie uruchamiające wszystkie usługi w kontenerach.

## docker-compose up --build

Flaga --build jest zalecana przy pierwszym uruchomieniu lub po zmianach w kodzie źródłowym.

🌐 Adresy usług
Usługa URL Opis
Frontend <http://localhost> Aplikacja kliencka (Port 80)
API Docs <http://localhost/api/docs> Dokumentacja Swagger (przez Nginx)
Backend API <http://localhost:8000> Bezpośredni dostęp do API
🧪 Testowanie
Testy Backendowe (Unit, Security, DDoS)

Testy są uruchamiane wewnątrz kontenera, co gwarantuje zgodność środowiskową.

code
Bash
download
content_copy
expand_less

## Uruchomienie wszystkich testów backendu

docker exec -it legal_backend pytest

## Uruchomienie konkretnego modułu (np. bezpieczeństwo)

docker exec -it legal_backend pytest tests/test_security.py
Testy E2E (Playwright)

Testy End-to-End wymagają przeglądarki, dlatego najlepiej uruchamiać je lokalnie przy podniesionym stosie Dockerowym.

code
Bash
download
content_copy
expand_less

## 1. Przejdź do katalogu backend i aktywuj venv

cd backend
source .venv/bin/activate

## 2. Ustaw adres bazowy na frontend (Nginx)

export BASE_URL=<http://localhost>

## 3. Uruchom testy E2E

pytest tests/e2e

Upewnij się, że wykonałeś wcześniej pip install pytest-playwright oraz playwright install.

🔒 Bezpieczeństwo i Skalowalność

RBAC: Role-Based Access Control zaimplementowany w logice backendu.

Encryption: Szyfrowanie danych wrażliwych w locie.

Izolacja: Baza danych i Redis nie są wystawione na świat zewnętrzny (brak mapowania portów w trybie prod), dostęp do nich ma tylko kontener backendu wewnątrz sieci Dockera.

Status projektu: Deploy-Ready

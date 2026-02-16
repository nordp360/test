# Rozwiązania i Odpowiedzi

## 1. Ochrona przed DDoS - 3 Rozwiązania

### Rozwiązanie 1: Cloudflare (Zalecane)

Najprostsze i najskuteczniejsze rozwiązanie dla większości aplikacji webowych.

- **Jak działa:** Ustawiasz Cloudflare jako proxy przed swoim serwerem (zmieniając DNS). Cloudflare filtruje ruch, blokując ataki wolumetryczne i boty.
- **Konfiguracja:** Darmowy plan oferuje podstawową ochronę ("I'm Under Attack Mode"), WAF (Web Application Firewall) i ukrywa prawdziwe IP serwera.
- **Zaleta:** Zerowa konfiguracja po stronie kodu aplikacji.

### Rozwiązanie 2: Nginx Rate Limiting (Serwer)

Konfiguracja na poziomie serwera WWW (np. Nginx), który obsługuje ruch przychodzący do aplikacji Python (Uvicorn).

- **Konfiguracja:** W pliku `nginx.conf`:

  ```nginx
  http {
      limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;
      server {
          location / {
              limit_req zone=mylimit burst=20 nodelay;
              proxy_pass http://127.0.0.1:8000;
          }
      }
  }
  ```

- **Zaleta:** Pełna kontrola, brak kosztów zewnętrznych, działa na własnej infrastrukturze.

### Rozwiązanie 3: Middleware w Aplikacji (SlowAPI)

Użycie biblioteki Python `slowapi` wewnątrz FastAPI.

- **Konfiguracja:**

  ```python
  from slowapi import Limiter, _rate_limit_exceeded_handler
  from slowapi.util import get_remote_address

  limiter = Limiter(key_func=get_remote_address)
  app.state.limiter = limiter
  app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

  @app.get("/home")
  @limiter.limit("5/minute")
  async def homepage(request: Request):
      return {"message": "Hello"}
  ```

- **Zaleta:** Granularna kontrola nad poszczególnymi endpointami (np. bardziej restrykcyjne dla logowania).

---

## 2. Argon2 vs PBKDF2-SHA256

**Czy można użyć Argon2?**
Tak, zdecydowanie można i jest to rekomendowane przez OWASP. Biblioteka `passlib` obsługuje Argon2.

**W czym Argon2 jest lepszy?**

1. **Odporność na GPU/ASIC:** PBKDF2 jest algorytmem, który łatwo zrównoleglić na kartach graficznych (GPU), co pozwala hakerom na szybkie łamanie haseł metodą brute-force. Argon2 jest zaprojektowany tak, aby wymagać dostępu do pamięci RAM (Memory-Hard), co drastycznie utrudnia atakowanie go przy użyciu tanich układów GPU czy ASIC.
2. **Odporność na ataki typu Side-Channel:** Argon2i (wariant) jest zoptymalizowany pod kątem odporności na ataki czasowe (timing attacks).
3. **Elastyczność:** Pozwala konfigurować nie tylko czas obliczeń (jak PBKDF2), ale też ilość wymaganej pamięci i równoległość wątków.

**Wniosek:** PBKDF2 jest bezpieczny i zgodny ze standardami (NIST), ale Argon2 jest nowocześniejszy i oferuje wyższy margines bezpieczeństwa w przyszłości.

---

## 15. Aktualne Dane Logowania (z bazy danych)

Zweryfikowano w skrypcie `seed.py`. Poniższe dane są **poprawne** i obecne w kodzie inicjalizującym aplikację:

| Rola                   | Email                      | Hasło         |
| :--------------------- | :------------------------- | :------------ |
| **Administrator**      | `admin@lexportal.pl`       | `admin123`    |
| **Operator (Prawnik)** | `anna.nowak@lexportal.pl`  | `lawyer123`   |
| **Klient**             | `jan.kowalski@example.com` | `password123` |

**Uwaga:** Jeśli logowanie nie działa, upewnij się, że skrypt `python seed.py` został uruchomiony, aby napełnić bazę danych tymi użytkownikami.




test-production-bf56f.up.railway.app
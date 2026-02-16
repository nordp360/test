# ANALIZA BEZPIECZEŃSTWA

Na podstawie przeglądu plików `backend/app/core/security.py`, `models.py` oraz zależności, poniżej przedstawiono stan zabezpieczeń aplikacji:

## 1. Szyfrowanie haseł

✅ **Status: Bezpieczne**
Używasz biblioteki **Passlib** z algorytmem `PBKDF2-SHA256`. Jest to silny i akceptowany standard (choć nowsze rekomendacje wskazują na Argon2). Hasła nie są przechowywane jawnym tekstem, co zapewnia ich bezpieczeństwo.

## 2. Ochrona danych wrażliwych (RODO)\*\*

✅ **Status: Bezpieczne (Encryption at Rest)**
W modelach `UserProfile` i `Message` zidentyfikowano pola z sufiksem `_enc` (np. `body_enc`). Wskazuje to na zastosowanie szyfrowania danych w spoczynku.
**Efekt:** Nawet w przypadku kradzieży bazy danych, dane takie jak PESEL czy treść porad prawnych pozostaną nieczytelne bez klucza szyfrującego.

### 3. SQL Injection

✅ **Status: Zabezpieczone**
Backend wykorzystuje **SQLAlchemy (ORM)**. Biblioteka ta automatycznie parametryzuje zapytania do bazy danych, co eliminuje ryzyko wstrzyknięcia złośliwego kodu SQL (SQL Injection), typowego dla ręcznego sklejania zapytań.

### 4. Ochrona przed DDoS

✅ **Status: Zaimplementowane**
W kodzie aplikacji (Python) wdrożono "Rate Limiter" przy użyciu biblioteki `slowapi`.

- **Zaimplementowane limity:**
  - `/api/v1/auth/register`: 3 żądania/minutę
  - `/api/v1/auth/login`: 5 żądań/minutę
  - `/api/v1/ai/generate`: 10 żądań/minutę
- **Rekomendacja dodatkowa:** Dla zwiększonej ochrony można dodatkowo skonfigurować ograniczenie na poziomie serwera (Nginx, Cloudflare lub API Gateway).

### 5. Logi (Audit)

✅ **Status: Bardzo dobra praktyka**
Aplikacja posiada tabelę `AuditLog`, która rejestruje kluczowe informacje:

- **Kto** wykonał akcję,
- **Co** zostało zrobione,
- **Kiedy** (znacznik czasu),
- **Adres IP** użytkownika.
  Umożliwia to skuteczne śledzenie incydentów i analizę powłamaniową.

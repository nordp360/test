import pytest
import uuid
from playwright.sync_api import Page, expect

BASE_URL = "http://localhost:3000"  # Adres Twojego frontendu

@pytest.fixture
def random_user():
    """Generuje losowe dane do rejestracji"""
    uid = uuid.uuid4().hex[:6]
    return {
        "email": f"test_{uid}@example.com",
        "password": "StrongPassword123!",
        "full_name": "Jan Kowalski",
        "pesel": "12345678901",
        "phone": "+48123456789"
    }

def test_registration_validation_and_success(page: Page, random_user):
    # 1. Wejdź na stronę rejestracji
    page.goto(f"{BASE_URL}/register")

    # 2. Test walidacji "na żywo" (Słabe hasło)
    # Check if we are on register page or need to navigate via login
    # Assume default route /register exists
    
    password_input = page.get_by_label("Hasło")
    password_input.fill("weak")
    # Kliknięcie poza polem, aby wywołać walidację (blur)
    page.get_by_label("E-mail").click()
    
    # Sprawdź, czy frontend wyświetla błąd z Twojego modelu Pydantic
    # Or frontend validation message
    expect(page.get_by_text("at least 8 characters")).to_be_visible()
    
    # 3. Poprawne wypełnienie danych
    page.get_by_label("E-mail").fill(random_user["email"])
    password_input.fill(random_user["password"])
    page.get_by_label("Imię i Nazwisko").fill(random_user["full_name"])
    
    # 4. Wysyłka i przekierowanie
    page.get_by_role("button", name="Zarejestruj").click()
    
    # Czekamy na przekierowanie do logowania lub dashboardu
    expect(page).to_have_url(f"{BASE_URL}/login")
    expect(page.get_by_text("Konto zostało utworzone")).to_be_visible()

def test_profile_update_pesel_validation(page: Page, random_user):
    """Testuje aktualizację profilu (UserUpdate model)"""
    # Logowanie (uproszczone)
    page.goto(f"{BASE_URL}/login")
    page.get_by_label("E-mail").fill(random_user["email"])
    page.get_by_label("Hasło").fill(random_user["password"])
    page.get_by_role("button", name="Zaloguj").click()

    # Przejście do ustawień profilu
    page.goto(f"{BASE_URL}/profile/settings")

    # Próba wpisania błędnego numeru PESEL (Twoja walidacja: dokładnie 11 cyfr)
    pesel_field = page.get_by_label("PESEL")
    pesel_field.fill("123") 
    page.get_by_role("button", name="Zapisz").click()

    # Sprawdzamy błąd 422 przekazany na UI
    expect(page.get_by_text("PESEL must be exactly 11 digits")).to_be_visible()

    # Naprawienie i sukces
    pesel_field.fill(random_user["pesel"])
    page.get_by_role("button", name="Zapisz").click()
    expect(page.get_by_text("Zaktualizowano profil")).to_be_visible()

def test_ddos_middleware_ui_reaction(page: Page):
    """
    Testuje, jak frontend reaguje na ban z DDoSProtectionMiddleware (429)
    """
    page.goto(f"{BASE_URL}/")

    # Symulujemy złośliwe zachowanie - wielokrotne uderzanie w nieistniejącą ścieżkę
    # W realnym teście E2E Playwright może to zrobić bardzo szybko
    for _ in range(6):
        page.evaluate("() => fetch('/.env')") 
    
    # Próba wejścia na stronę główną
    page.reload()
    
    # Sprawdzamy, czy middleware zwrócił 429 i czy frontend wyświetlił Twój komunikat
    # "Your IP has been temporarily banned due to suspicious activity"
    expect(page.get_by_text("temporarily banned")).to_be_visible()

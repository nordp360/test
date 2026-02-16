
import pytest
from pydantic import ValidationError
from app.schemas.user import UserCreate, UserUpdate, UserBase, UserPasswordUpdate

def test_user_create_password_complexity_success():
    user = UserCreate(
        email="test@example.com",
        password="StrongPassword123!",
        full_name="Test User"
    )
    assert user.password == "StrongPassword123!"

def test_user_create_password_too_short():
    with pytest.raises(ValidationError) as excinfo:
        UserCreate(
            email="test@example.com",
            password="Short1!",
            full_name="Test"
        )
    assert "at least 8 characters" in str(excinfo.value)

def test_user_create_password_missing_uppercase():
    with pytest.raises(ValidationError) as excinfo:
        UserCreate(email="t@e.com", password="password123!", full_name="T")
    assert "uppercase" in str(excinfo.value)

def test_user_create_password_missing_digit():
    with pytest.raises(ValidationError) as excinfo:
        UserCreate(email="t@e.com", password="Password!", full_name="T")
    assert "digit" in str(excinfo.value)

def test_user_create_password_missing_special():
    with pytest.raises(ValidationError) as excinfo:
        UserCreate(email="t@e.com", password="Password123", full_name="T")
    assert "special character" in str(excinfo.value)

def test_user_update_pesel_valid():
    user_up = UserUpdate(pesel="12345678901")
    assert user_up.pesel == "12345678901"

def test_user_update_pesel_invalid_length():
    with pytest.raises(ValidationError) as excinfo:
        UserUpdate(pesel="123")
    assert "11 digits" in str(excinfo.value)

def test_user_update_pesel_non_digit():
    with pytest.raises(ValidationError) as excinfo:
        UserUpdate(pesel="12345abc901")
    assert "11 digits" in str(excinfo.value)

def test_user_update_phone_valid():
    user_up = UserUpdate(phone="+48123456789")
    assert user_up.phone == "+48123456789"

def test_user_update_phone_invalid_format():
    with pytest.raises(ValidationError) as excinfo:
        UserUpdate(phone="123456789") # Missing plus might be invalid depending on regex
    assert "E.164" in str(excinfo.value)

def test_user_base_role_valid():
    # Attempting to assign a role in UserBase (used by UserCreate inheritence structure check)
    # Note: The UserBase model defines role with default "client".
    ub = UserBase(email="x@x.com", role="admin")
    assert ub.role == "admin"

def test_user_update_no_role_modification_possible():
    # UserUpdate model DOES NOT have a 'role' field.
    # Passing 'role' to it should be ignored or raise error if forbid_extra is on.
    # By default pydantic ignores extra unless configured.
    user_up = UserUpdate(role="admin", full_name="Hacker")
    assert not hasattr(user_up, "role") 

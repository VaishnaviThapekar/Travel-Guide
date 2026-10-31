import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    if os.getenv("APP_ENV", "development").lower() in {"production", "prod"}:
        raise RuntimeError("SECRET_KEY must be configured in production")
    SECRET_KEY = secrets.token_urlsafe(32)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    subject: str,
    expires_delta: Optional[timedelta] = None,
    token_type: str = "access",
    nonce: str | None = None,
) -> str:
    now = datetime.now(timezone.utc)
    if expires_delta:
        exp = now + expires_delta
    else:
        exp = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": subject, "exp": int(exp.timestamp()), "type": token_type}
    if nonce:
        to_encode["nonce"] = nonce
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str, expected_type: str = "access", expected_nonce: str | None = None) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != expected_type:
            return None
        if expected_nonce is not None and payload.get("nonce") != expected_nonce:
            return None
        subject = payload.get("sub")
        return subject if isinstance(subject, str) else None
    except JWTError:
        return None

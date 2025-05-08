from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from jose import jwt
import requests
import os
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CLERK_ISSUER = os.getenv("CLERK_ISSUER")
JWKS_URL = f"{CLERK_ISSUER}/.well-known/jwks.json"
JWKS = requests.get(JWKS_URL).json()

def get_public_key(token):
    headers = jwt.get_unverified_header(token)
    for key in JWKS["keys"]:
        if key["kid"] == headers["kid"]:
            return key
    raise HTTPException(status_code=401, detail="Public key not found.")

def verify_token(request: Request):
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token = auth.split("Bearer ")[1]
    key = get_public_key(token)
    try:
        payload = jwt.decode(
            token,
            key,
            algorithms=key["alg"],
            audience=None,  # Set if you use audience
            issuer=CLERK_ISSUER,
        )
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/")
def answer():
    return {"message": "Yo Buddy"}

@app.get("/dashboard")
def protected(user_data: dict = Depends(verify_token)):
    return {"message": f"Hello, {user_data.get('sub', 'user')}!"}

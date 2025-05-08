from fastapi import FastAPI, Request, HTTPException, Depends
import os
from dotenv import load_dotenv
import requests

load_dotenv()
app = FastAPI()

CLERK_ISSUER = os.getenv("CLERK_ISSUER")  


def verify_token(request: Request):
    token = request.headers.get("Authorization")
    if not token or not token.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")

    session_token = token.split("Bearer ")[1]

    # Verify with Clerk
    res = requests.get(
        f"{CLERK_ISSUER}/v1/introspect",
        headers={"Authorization": f"Bearer {session_token}"}
    )

    if res.status_code != 200 or not res.json().get("active"):
        raise HTTPException(status_code=401, detail="Unauthorized")

    return res.json()

@app.get("/")
def asnwer():
    return {"message": f"Yo Buddy"}
# Test route
@app.get("/dashboard")
def protected(user_data: dict = Depends(verify_token)):
    return {"message": f"Hello, {user_data.get('sub')}!"}

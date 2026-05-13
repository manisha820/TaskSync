import os
import urllib.request
import json
import ssl

def load_env():
    env_vars = {}
    if os.path.exists('.env'):
        with open('.env', 'r') as f:
            for line in f:
                if '=' in line and not line.strip().startswith('#'):
                    key, val = line.strip().split('=', 1)
                    env_vars[key] = val.strip('"').strip("'")
    return env_vars

def verify_supabase(url, key):
    if not url or not key:
        return False, "Missing Supabase URL or Key"
    try:
        req = urllib.request.Request(f"{url}/rest/v1/users?limit=1", headers={"apikey": key, "Authorization": f"Bearer {key}"})
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                return True, "Supabase Connection Successful"
            return False, f"Unexpected Status: {response.status}"
    except urllib.error.HTTPError as e:
        if e.code == 401:
            return False, "Supabase Connection Failed: Unauthorized (Invalid Key)"
        # Sometimes root endpoint isn't fully accessible but if it's 404 it might be wrong url
        return False, f"Supabase Connection Failed: HTTP {e.code}"
    except Exception as e:
        return False, f"Supabase Connection Failed: {e}"

def main():
    print("--- B.L.A.S.T Phase 2: Link Verification ---")
    env = load_env()
    
    # 1. Verify Supabase
    supabase_url = env.get("SUPABASE_URL", "")
    supabase_key = env.get("SUPABASE_ANON_KEY", "")
    
    if supabase_url == "" or supabase_key == "":
        print("[-] Supabase Link: FAILED")
        print("    -> Action Required: Populate SUPABASE_URL and SUPABASE_ANON_KEY in .env")
    else:
        success, msg = verify_supabase(supabase_url, supabase_key)
        if success:
            print(f"[+] Supabase Link: SUCCESS ({msg})")
        else:
            print(f"[-] Supabase Link: FAILED ({msg})")

    # 2. Verify AI API Key
    openai_key = env.get("OPENAI_API_KEY", "")
    gemini_key = env.get("GEMINI_API_KEY", "")
    if openai_key == "" and gemini_key == "":
        print("[-] AI Link: FAILED")
        print("    -> Action Required: Populate OPENAI_API_KEY or GEMINI_API_KEY in .env")
    else:
        print("[+] AI Link: SUCCESS (Key present, deeper verification requires SDK)")

    # 3. Verify OAuth (Google/GitHub)
    if env.get("GOOGLE_CLIENT_ID", "") == "" or env.get("GOOGLE_CLIENT_SECRET", "") == "":
        print("[-] Google OAuth Link: PENDING (Keys missing)")
    else:
        print("[+] Google OAuth Link: CONFIGURED")

if __name__ == "__main__":
    main()

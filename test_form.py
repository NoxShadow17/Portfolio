import requests
import sys

def test_formspree(endpoint_id):
    url = f"https://formspree.io/f/{endpoint_id}"
    data = {
        "name": "Antigravity Test Bot",
        "email": "test@example.com",
        "message": "This is a diagnostic test to verify your Formspree integration is working correctly."
    }
    
    print(f"Sending test submission to {url}...")
    
    try:
        response = requests.post(url, data=data, headers={"Accept": "application/json"})
        
        if response.status_code == 200:
            print("✅ SUCCESS: Formspree accepted the submission!")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ FAILED: Received status code {response.status_code}")
            print(f"Error details: {response.text}")
            
    except Exception as e:
        print(f"⚠️ ERROR: Could not connect to Formspree: {str(e)}")

if __name__ == "__main__":
    test_id = "xreawdwl"
    test_formspree(test_id)

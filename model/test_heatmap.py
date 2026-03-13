import requests

url = "http://localhost:8005/generate-heatmap"
image_path = r"c:\wiet-hackverse-2-0-hackathon-project-submission-aiml-701-wa05_hackmatrix-main\backend\node_modules\bootswatch\yeti\thumbnail.png"

with open(image_path, "rb") as f:
    files = {"file": f}
    response = requests.post(url, files=files)

print(f"Status Code: {response.status_code}")
if response.status_code == 200:
    with open("test_heatmap.jpg", "wb") as out:
        out.write(response.content)
    print("Heatmap saved to test_heatmap.jpg")
else:
    print(f"Error: {response.text}")

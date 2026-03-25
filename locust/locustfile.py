import random
import string
import io
from locust import HttpUser, task, between, events


def random_string(length=8):
    return ''.join(random.choices(string.ascii_lowercase, k=length))


class FotoalbumUser(HttpUser):
    wait_time = between(1, 3)
    token = None
    uploaded_filenames = []

    def on_start(self):
        """Bejelentkezés az összes user számára induláskor"""
        response = self.client.post("/api/auth/login", json={
            "email": "admin@admin.com",
            "password": "admin123"
        })
        if response.status_code == 200 or response.status_code == 201:
            self.token = response.text.strip()#response.json().get("access_token") or response.json().get("token")
        else:
            self.token = None

    def auth_headers(self):
        return {"Authorization": f"Bearer {self.token}"} if self.token else {}

    @task(5)
    def list_images(self):
        """Képek listázása - leggyakoribb művelet"""
        with self.client.get("/api/images", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
                images = response.json()
                if isinstance(images, list) and len(images) > 0:
                    # Véletlenszerű kép fájlnevét eltároljuk törléshez
                    FotoalbumUser.uploaded_filenames = [
                        img.get("filename") or img.get("fileName") or img.get("id")
                        for img in images
                        if img.get("filename") or img.get("fileName") or img.get("id")
                    ]
            else:
                response.failure(f"GET /api/images failed: {response.status_code}")

    @task(3)
    def upload_image(self):
        """Kép feltöltése"""
        if not self.token:
            return

        # Kis méretű fake PNG generálása (1x1 pixel)
        png_bytes = (
            b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01'
            b'\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00'
            b'\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18'
            b'\xd8N\x00\x00\x00\x00IEND\xaeB`\x82'
        )

        name = f"test_{random_string(6)}"
        file_obj = io.BytesIO(png_bytes)

        with self.client.post(
            "/api/image",
            headers=self.auth_headers(),
            files={"file": (f"{name}.png", file_obj, "image/png")},
            data={"name": name},
            catch_response=True
        ) as response:
            if response.status_code in (200, 201):
                response.success()
                try:
                    data = response.json()
                    filename = data.get("filename") or data.get("fileName") or data.get("id")
                    if filename:
                        FotoalbumUser.uploaded_filenames.append(filename)
                except Exception:
                    pass
            else:
                response.failure(f"POST /api/image failed: {response.status_code} - {response.text}")

    @task(2)
    def delete_image(self):
        """Kép törlése - csak ha van mit törölni"""
        if not self.token:
            return
        if not FotoalbumUser.uploaded_filenames:
            return

        filename = random.choice(FotoalbumUser.uploaded_filenames)

        with self.client.delete(
            f"/api/image/{filename}",
            headers=self.auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code in (200, 204):
                response.success()
                try:
                    FotoalbumUser.uploaded_filenames.remove(filename)
                except ValueError:
                    pass
            else:
                response.failure(f"DELETE /api/image/{filename} failed: {response.status_code}")

    @task(1)
    def get_me(self):
        """Bejelentkezett felhasználó adatainak lekérése"""
        if not self.token:
            return
        with self.client.get(
            "/api/auth/me",
            headers=self.auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"GET /api/auth/me failed: {response.status_code}")
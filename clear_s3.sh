#!/bin/bash

BASE_URL="https://fotoalbum-server-fotoalbum.apps.okd.fured.cloud.bme.hu"

EMAIL="test@gmail.com"
PASSWORD="test"

echo "Logging in..."

# 1. Login → returns plain token string
TOKEN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

# Trim possible quotes/newlines
TOKEN=$(echo "$TOKEN" | tr -d '"\n\r')

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get token"
  exit 1
fi

echo "✅ Token acquired"
echo "TOKEN: [$TOKEN]"

# 2. Get all images (this is still JSON → jq needed here)
echo "Fetching images..."

RESPONSE=$(curl -s -X GET "$BASE_URL/api/images" \
  -H "Authorization: Bearer $TOKEN")

FILENAMES=$(echo "$RESPONSE" | jq -r '.images[].fileName')

if [ -z "$FILENAMES" ]; then
  echo "⚠️ No images found"
  exit 0
fi

# 3. Delete each image
# echo "Deleting images..."

# for FILE in $FILENAMES; do
#   echo "Deleting $FILE ..."
  
#   DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/api/image/$FILE" \
#     -H "Authorization: Bearer $TOKEN")

#   echo "Response: $DELETE_RESPONSE"
# done

MAX_JOBS=5
CURRENT_JOBS=0

echo "Deleting images in parallel (max $MAX_JOBS)..."

for FILE in $FILENAMES; do
  (
    echo "Deleting $FILE ..."
    
    RESPONSE=$(curl -s -X DELETE "$BASE_URL/api/image/$FILE" \
      -H "Authorization: Bearer $TOKEN")

    echo "[$FILE] -> $RESPONSE"
  ) &

  ((CURRENT_JOBS++))

  # If we reached max jobs → wait for them to finish
  if [ "$CURRENT_JOBS" -ge "$MAX_JOBS" ]; then
    wait
    CURRENT_JOBS=0
  fi

done

# Wait for any remaining jobs
wait

echo "✅ Done"
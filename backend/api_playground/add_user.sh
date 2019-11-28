curl -i -H \
"Content-Type: application/json" -H "Accept: application/json" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9wZXJhdG9yQG9wZXJhdG9yLmNvbSIsInJvbGUiOiJvcGVyYXRvciIsImV4cCI6MTU3NDkzMDQzMH0.Zj3wflNxLGvYMz0cIuFP1KSeeAVo7TxoSKWXDK1A058" \
-X POST -d '{"email":"jan.zauskaa@gmail.com", "password":"react", "role":"operator", "address"}' http://127.0.0.1:9092/api/user

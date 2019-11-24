curl -i -H \
"Content-Type: application/json" -H "Accept: application/json" \
-X POST -d '{"email":"jan.zauska@gmail.com", "password":"react", "role":"operator"}' http://127.0.0.1:9092/api/user

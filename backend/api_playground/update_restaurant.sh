curl -i --user julo.marko@gmail.com:heslo123 -H \
"Content-Type: application/json" -H "Accept: application/json" \
-X PATCH -d '{"name":"Forkys"}' http://127.0.0.1:9092/api/restaurant/1

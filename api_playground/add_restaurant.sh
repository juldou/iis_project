curl -i --user julo.marko@gmail.com:heslo123 -H \
"Content-Type: application/json" -H "Accept: application/json" \
-X POST -d '{"category":"vietnam", "name":"Na purkyncee", "description":"somedescription", "picture_url":"fake_url"}' http://127.0.0.1:9092/api/restaurants/

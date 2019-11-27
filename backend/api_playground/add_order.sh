curl -i -H \
"Content-Type: application/json" -H "Accept: application/json" \
-X POST -d '{"user_id":1, "food_ids":[1,2,3]}' http://127.0.0.1:9092/api/order


curl -i -H \
"Content-Type: application/json" -H "Accept: application/json" \
-X POST -d '{"street":"grinova","city":"uhorka","phone":"+4214129512", "food_ids":[1,2,3]}' http://127.0.0.1:9092/api/order

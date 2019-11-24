curl -i -H \
"Content-Type: application/json" -H "Accept: application/json" \
-X POST -d '{"address_id":1, "user_id":1, "restaurant_id":2, "food_ids":[1,2,3]}' http://127.0.0.1:9092/api/order

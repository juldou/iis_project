# Run postgres DB in docker
1. install docker
2. run `docker run --name postgres-iis -e POSTGRES_DB=food_delivery -e POSTGRES_USER=postgres_iis -e POSTGRES_PASSWORD=secret123 -d -p 5432:5432 postgres`

# Run redis in docker
1. `docker run --name redis-iis -p 6379:6379 -d redis`

# How to build server
- `go build -o server .`

# How to run server
- `./server serve`

# How to create/drop tables
- check sql/ directory, run scripts against your db 

# API
GET
```
api/restaurant/{id}
api/restaurant/{id}/foods 
api/restaurant/{id}/menu?name=daily     (returns foods)
api/restaurant/{id}/menu?name=permanent (returns foods)

api/restaurants

api/restaurant-categories
```
POST
```
api/restaurant
api/restaurant/{id}/food
```
PATCH
```
api/restaurants/{id}
```


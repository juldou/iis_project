sudo docker cp ./sql/drop_tables.sql postgres-iis:/home/drop_tables.sql
sudo docker cp ./sql/create_tables.sql postgres-iis:/home/create_tables.sql

sudo docker exec -u root postgres-iis psql food_delivery postgres_iis -f /home/drop_tables.sql
sudo docker exec -u root postgres-iis psql food_delivery postgres_iis -f /home/create_tables.sql
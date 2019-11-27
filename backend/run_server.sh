#!/bin/bash
bash ./recreate_tables.sh
go build -o server .
./server serve
#!/bin/bash
go build -o server .
nohup ./server serve &

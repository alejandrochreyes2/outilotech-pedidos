#!/bin/bash
apt update
apt install -y docker.io docker-compose git python3-pip
systemctl enable docker
systemctl start docker
pip3 install psycopg2-binary pymongo supabase-py
git clone https://github.com/alejandrochreyes2/outilotech-pedidos.git /opt/outilotech
cd /opt/outilotech
# Se creará un archivo .env más adelante

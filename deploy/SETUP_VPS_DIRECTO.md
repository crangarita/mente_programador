# Configuración del Servicio Systemd y Nginx para Producción

Esta guía describe cómo preparar tu servidor VPS (`76.13.99.135`) para el despliegue automático mediante [JenkinsfileProd](file:///Users/crangarita/Documents/development/feria/mente-programador/JenkinsfileProd).

---

## 1. Servicio Systemd para el Backend (`mente-programador-api`)

Crea el archivo unitario de systemd:
```bash
sudo nano /etc/systemd/system/mente-programador-api.service
```

Pega el siguiente contenido (ajustando las contraseñas de BD):

```ini
[Unit]
Description=Mente Programador Backend API
After=syslog.target network.target postgresql.service

[Service]
User=deploy
Group=deploy
Type=simple
WorkingDirectory=/opt/mente-programador/backend

# Variables de entorno para Spring Boot
Environment="SPRING_PROFILES_ACTIVE=prod"
Environment="SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/mente_programador"
Environment="SPRING_DATASOURCE_USERNAME=mente_programador"
Environment="SPRING_DATASOURCE_PASSWORD=TU_CONTRASENA_AQUI"
Environment="FRONTEND_ORIGIN=https://mente.ubunifusoft.tech"
Environment="PORT=8084"

ExecStart=/usr/bin/java -jar /opt/mente-programador/backend/app.jar
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=mente-programador-api

[Install]
WantedBy=multi-user.target
```

Luego habilita e inicia el servicio:
```bash
sudo mkdir -p /opt/mente-programador/backend
sudo chown -R deploy:deploy /opt/mente-programador

sudo systemctl daemon-reload
sudo systemctl enable mente-programador-api
sudo systemctl status mente-programador-api
```

---

## 2. Configuración de Nginx para el Frontend

Crea el bloque de servidor en Nginx:
```bash
sudo nano /etc/nginx/sites-available/mente-programador
```

Configuración recomendada para SPA:
```nginx
server {
    listen 3004;
    server_name localhost;

    root /var/www/mente-programador;
    index index.html;

    # Compresión gzip
    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;

    # Caché para estáticos
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    # Redirección SPA para React Router
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Habilita el sitio y recarga Nginx:
```bash
sudo mkdir -p /var/www/mente-programador
sudo chown -R www-data:www-data /var/www/mente-programador
sudo chmod -R 755 /var/www/mente-programador

sudo ln -sf /etc/nginx/sites-available/mente-programador /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 3. Permisos sudo para el usuario `deploy` (Sin Password para despliegue)

Para que Jenkins pueda reiniciar el servicio y Nginx sin pedir contraseña por SSH:
```bash
sudo visudo /etc/sudoers.d/deploy-mente
```
Agrega:
```sudoers
deploy ALL=(ALL) NOPASSWD: /bin/systemctl restart mente-programador-api, /bin/systemctl status mente-programador-api, /bin/systemctl reload nginx, /bin/mkdir, /bin/cp, /bin/rm, /bin/chown, /bin/chmod
```

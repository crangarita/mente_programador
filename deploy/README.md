# Guía de Despliegue con Docker y GitHub Container Registry (GHCR)

Este directorio contiene la infraestructura como código para desplegar **mente-programador** en un servidor remoto (VPS) utilizando contenedores Docker.

---

## 1. Requisitos Previos

### A. Token de GitHub (PAT) para GHCR
1. En GitHub ve a **Settings** -> **Developer Settings** -> **Personal Access Tokens** -> **Tokens (classic)**.
2. Genera un nuevo token con los permisos:
   - `write:packages` (para subir imágenes)
   - `read:packages` (para descargar imágenes)
   - `delete:packages` (opcional)
3. Guarda este token, ya que será la contraseña para autenticar Docker con `ghcr.io`.

### B. Credenciales en Jenkins (`Manage Jenkins` -> `Credentials`)
Crea 2 credenciales:
1. **GitHub GHCR Credentials**:
   - **Tipo:** `Username with password`
   - **ID:** `github-ghcr-credentials`
   - **Username:** Tu usuario de GitHub en minúsculas (ej: `crangarita`).
   - **Password:** El Personal Access Token generado en el paso A.
2. **SSH Servidor Remoto**:
   - **Tipo:** `SSH Username with private key`
   - **ID:** `mente-programador-prod-ssh`
   - **Username:** `deploy`
   - **Private Key:** La llave privada SSH que tiene acceso al VPS.

---

## 2. Preparación del Servidor Remoto (VPS)

En tu servidor de producción (una única vez):

### A. Instalar Docker y Docker Compose
```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker deploy
```
*(Cierra y vuelve a abrir sesión con el usuario `deploy` para aplicar el grupo `docker`).*

### B. Login a GHCR en el servidor
Si tus imágenes en GitHub Packages son privadas, inicia sesión una vez con el usuario `deploy`:
```bash
echo "TU_GITHUB_PAT" | docker login ghcr.io -u TU_USUARIO_GITHUB --password-stdin
```

### C. Directorio de la aplicación y variables de entorno
```bash
sudo mkdir -p /opt/mente-programador
sudo chown -R deploy:deploy /opt/mente-programador
```

Crea el archivo `/opt/mente-programador/.env` en el servidor con los valores de producción:
```bash
cp deploy/.env.prod.example /opt/mente-programador/.env
nano /opt/mente-programador/.env
```
Asegúrate de definir allí `POSTGRES_PASSWORD`, `FRONTEND_ORIGIN` y `VITE_API_URL`.

---

## 3. Configuración del Job en Jenkins

1. Crea un nuevo Pipeline en Jenkins.
2. En la sección **Pipeline Script from SCM**:
   - Selecciona **Git**.
   - URL del repositorio: tu repo de GitHub.
   - Script Path: `deploy/Jenkinsfile`.
3. Ejecuta **Build Now**.

---

## 4. Estructura de este directorio (`deploy/`)

- [Jenkinsfile](file:///Users/crangarita/Documents/development/feria/mente-programador/deploy/Jenkinsfile): Pipeline CI/CD que detecta cambios, compila imágenes Docker, las sube a `ghcr.io` y actualiza el servidor remoto por SSH.
- [docker-compose.prod.yml](file:///Users/crangarita/Documents/development/feria/mente-programador/deploy/docker-compose.prod.yml): Definición de los servicios de producción (`postgres`, `backend` y `frontend`).
- [.env.prod.example](file:///Users/crangarita/Documents/development/feria/mente-programador/deploy/.env.prod.example): Plantilla de variables de entorno para el VPS.

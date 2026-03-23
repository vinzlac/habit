# Image minimale pour démarrer — remplace par ton stack (Node, Go, Python, etc.).
FROM nginx:1.27-alpine
COPY html/ /usr/share/nginx/html/
EXPOSE 80

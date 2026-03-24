# Image non-root : compatible securityContext Kubernetes (capabilities drop ALL).
FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY html/ /usr/share/nginx/html/
EXPOSE 8080

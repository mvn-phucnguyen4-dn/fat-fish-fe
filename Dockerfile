# production environment
FROM nginx:1.13.9-alpine
COPY --from=builder /build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

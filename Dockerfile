# Используем официальный образ nginx (минимальный)
FROM nginx:alpine

# Удаляем стандартную страницу
RUN rm -rf /usr/share/nginx/html/*

# Копируем все файлы сайта в рабочую папку nginx
COPY . /usr/share/nginx/html/

# Даём права на чтение (для статики этого достаточно)
RUN chmod -R 755 /usr/share/nginx/html

# Открываем порт 80
EXPOSE 80

# Запускаем nginx (уже определён в базовом образе)
CMD ["nginx", "-g", "daemon off;"]
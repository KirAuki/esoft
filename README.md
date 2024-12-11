Запуск Backend

1. Установка и активация виртуального окружения

Windows:

python -m venv venv
venv\Scripts\activate

macOS/Linux:

python -m venv venv
source venv/bin/activate

2. Установка зависимостей

Убедитесь, что вы находитесь в директории backend:

cd backend
pip install -r requirements.txt

3. Применение миграций

Создайте и примените миграции для базы данных:

python manage.py makemigrations
python manage.py migrate

4. Запуск сервера разработки

Для запуска локального сервера:

python manage.py runserver

Сервер будет доступен по адресу: http://127.0.0.1:8000

Запуск Frontend

1. Установка зависимостей

Перейдите в директорию frontend и установите зависимости:

cd frontend
npm install

2. Запуск проекта

Запустите Expo CLI для разработки приложения:

npx expo start

3. Просмотр приложения

Для запуска на устройстве: пперейдиет на сайт http://localhost:8001
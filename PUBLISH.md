# Как опубликовать 2039 Tools на GitHub

Все файлы уже подготовлены и закоммичены локально. Осталось **один раз войти в GitHub** и выполнить скрипт.

## Шаг 1 — Войти в GitHub (один раз)

Откройте PowerShell и выполните:

```powershell
& "$env:TEMP\ghcli\bin\gh.exe" auth login
```

Выберите:
- **GitHub.com**
- **HTTPS**
- **Login with a web browser** (скопируйте код и подтвердите в браузере)

## Шаг 2 — Опубликовать

```powershell
cd "C:\Users\denis\Desktop\2039 Tools"
powershell -ExecutionPolicy Bypass -File .\publish.ps1
```

Скрипт автоматически:
1. Создаст репозиторий `2039-tools` на вашем аккаунте
2. Загрузит все файлы
3. Включит GitHub Pages

## Шаг 3 — Открыть сайт

Через 1–3 минуты сайт будет доступен:

**https://denislopdev.github.io/2039-tools/**

---

## Что уже готово локально

- `index.html` — красивая витрина со всеми инструментами
- 9 HTML-инструментов + visual editor JS
- `LICENSE` — свободное использование с подписью «Тяни слоп»
- Подпись «Тяни слоп» в footer каждого инструмента
- `README.md` для GitHub

## Локальный просмотр (без GitHub)

Откройте в браузере файл:

`C:\Users\denis\Desktop\2039 Tools\index.html`

Фейковый API для простого CRUD приложения "TODO LIST"

Роутинг
GET /list
выводит весь список заметок

GET /list/:id
данные по одной конкретной заметке

POST /add
body: {
  text: string (required),
  color: string (optional),
  description: string (optional),
}
добавить новую заметку

PUT /edit/:id
body: {
  text: string (optional, but not empty),
  done: string (optional),
  color: string (optional),
  description: string (optional),
}
редактировать заметку

DELETE /delete/:id
удалить заметку
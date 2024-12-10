const USER__KEY = {
	CLIENT_ID: '650ez9kP2Q7YFio7dvXJ',
	SECRET_KEY: '333WSvuCAd3iiXThHOawJ7exBhfNvEq7iCT',
}

window.ondragover = function (e) {
	e.preventDefault()
}
window.ondrop = function (e) {
	e.preventDefault()
	window.upload(e.dataTransfer.files[0])
}

function upload(file) {
	if (!file || !file.type.match(/image.*/)) {
		alert('Пожалуйста, выберите изображение')
		return
	}

	document.body.className = 'loading'

	console.log('Начинаем загрузку файла:', {
		name: file.name,
		size: file.size,
		type: file.type,
	})

	// Создаем новый FormData и добавляем файл как есть
	const fd = new FormData()
	fd.append('image', file, file.name) // Добавляем третий параметр - имя файла

	console.log('Отправляем данные:')
	for (let pair of fd.entries()) {
		console.log(pair[0] + ':', pair[1])
	}

	const url = 'https://api.imageban.ru/v1'
	console.log('Отправляем запрос на:', url)

	fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `TOKEN ${USER__KEY.CLIENT_ID}`,
		},
		body: fd,
	})
		.then(response => {
			console.log('Получен ответ от сервера:', {
				status: response.status,
				statusText: response.statusText,
				headers: [...response.headers.entries()],
			})
			return response.text().then(text => {
				console.log('Текст ответа:', text)
				try {
					const json = JSON.parse(text)
					if (json.error) {
						throw new Error(json.error.message || 'Неизвестная ошибка API')
					}
					return json
				} catch (e) {
					console.error('Ошибка парсинга ответа:', e)
					throw e
				}
			})
		})
		.then(data => {
			console.log('Обработанный ответ:', data)
			if (data.data) {
				const link = document.getElementById('link')
				link.className = 'uploaded'
				link.href = data.data.link
				link.textContent = data.data.img_name || data.data.link
				document.body.className = 'uploaded'
				console.log('Загрузка успешна, обновлен линк:', link.href)
			} else {
				throw new Error('Отсутствуют данные в ответе')
			}
		})
	// .catch(error => {
	// 	console.error('Ошибка загрузки:', error)
	// 	alert('Ошибка при загрузке изображения: ' + error.message)
	// 	document.body.className = ''
	// })
	// .finally(() => {
	// 	console.log('Загрузка завершена')
	// 	document.body.className = ''
	// })
}

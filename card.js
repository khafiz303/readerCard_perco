const CardReader = require('./reader');

(async () => {
  const reader = new CardReader('COM4'); // Замените на ваш COM-порт
  
  try {
    // Подключаемся
    await reader.connect();

    // Подписываемся на события
    reader.on('data', (data) => {
      console.log(`Данные с карты: ${data}`);
    });

    reader.on('error', (err) => {
      console.error(`Ошибка: ${err}`);
    });

    // Читаем карту
    console.log('Попробуйте приложить карту...');
    await reader.readCard();

    // Закрываем соединение через 10 секунд
    setTimeout(async () => {
      await reader.disconnect();
      console.log('Соединение закрыто');
    }, 10000);
  } catch (err) {
    console.error(err);
  }
})();

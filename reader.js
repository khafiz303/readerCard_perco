const { SerialPort } = require('serialport'); // Для работы с COM-портами
const EventEmitter = require('events'); // Для событий

class CardReader extends EventEmitter {
  constructor(portName, baudRate = 9600) {
    super();
    this.portName = portName;
    this.baudRate = baudRate;
    this.port = null;
    this.isConnected = false;
  }

  // Подключение к считывателю через COM-порт
  async connect() {
    try {
      this.port = new SerialPort({
        path: this.portName,
        baudRate: this.baudRate,
        autoOpen: false, // Ручное управление открытием порта
      });

      // Открытие порта
      await new Promise((resolve, reject) => {
        this.port.open((err) => {
          if (err) {
            return reject(`Ошибка подключения к порту ${this.portName}: ${err.message}`);
          }
          this.isConnected = true;
          resolve();
        });
      });

      // Обработка входящих данных
      this.port.on('data', (data) => this._handleData(data));
      this.port.on('error', (err) => this.emit('error', `Ошибка порта: ${err.message}`));

      console.log(`Успешное подключение к ${this.portName}`);
    } catch (error) {
      console.error(error);
      throw new Error('Не удалось подключиться к считывателю');
    }
  }

  // Закрытие порта
  async disconnect() {
    if (this.port && this.isConnected) {
      return new Promise((resolve, reject) => {
        this.port.close((err) => {
          if (err) {
            return reject(`Ошибка при закрытии порта: ${err.message}`);
          }
          this.isConnected = false;
          resolve();
        });
      });
    }
  }

  // Отправка команды в считыватель
  sendCommand(command) {
    if (!this.isConnected || !this.port) {
      throw new Error('Считыватель не подключен');
    }

    const buffer = Buffer.from(command, 'hex'); // Формат команды (например, HEX)
    this.port.write(buffer, (err) => {
      if (err) {
        console.error(`Ошибка отправки команды: ${err.message}`);
        this.emit('error', `Ошибка отправки команды: ${err.message}`);
      } else {
        console.log(`Команда отправлена: ${command}`);
      }
    });
  }

  // Обработка входящих данных
  _handleData(data) {
    console.log(`Получены данные: ${data.toString('hex')}`);
    this.emit('data', data.toString('hex')); // Отправляем событие с данными
  }

  // Чтение карты
  async readCard() {
    const command = 'AABBCCDD'; // Пример команды на чтение карты
    this.sendCommand(command);
  }
}

module.exports = CardReader;

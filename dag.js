const { SerialPort } = require('serialport');

const port = new SerialPort({ path: 'COM4', baudRate: 9600 });

port.on('open', () => {
    console.log('Порт успешно открыт');
});

port.on('error', (err) => {
    console.error('Ошибка порта:', err.message);
});

port.on('data', (data) => {
    console.log('Получены данные:', data.toString());
});

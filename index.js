require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const { getAccountBalance, getPrice, placeOrder } = require('./binanceService');

const app = express();
const PORT = process.env.PORT || 3000;

cron.schedule('* * * * *', async () => {
  console.log('🔁 Ejecutando ciclo automático');
  const usdt = await getAccountBalance();
  const price = await getPrice('BTCUSDT');

  // Compra si hay suficiente USDT y el precio está bajo
  if (usdt >= 10 && price < 30000) {
    await placeOrder('BTCUSDT', 'BUY', 0.001);
  }

  // Venta si hay BTC suficiente y el precio está alto
  if (price > 40000) {
    await placeOrder('BTCUSDT', 'SELL', 0.001);
  }
});

app.get('/', (req, res) => {
  res.send('✅ Bot funcionando');
});

app.listen(PORT, () => {
  console.log(`🚀 Bot escuchando en puerto ${PORT}`);
});

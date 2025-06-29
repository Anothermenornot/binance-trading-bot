require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const { getAccountBalance, getPrice, placeOrder } = require('./binanceService');

const app = express();
const PORT = process.env.PORT || 3000;

// Lógica del bot (cada minuto)
cron.schedule('* * * * *', async () => {
  console.log('🔄 Ejecutando ciclo automático...');

  try {
    const usdt = await getAccountBalance();
    const price = await getPrice('BTCUSDT');

    // Compra si el precio está bajo y hay USDT suficiente
    if (usdt >= 10 && price < 30000) {
      await placeOrder('BTCUSDT', 'BUY', 0.001);
    }

    // Venta si el precio está alto y hay BTC suficiente
    if (price > 40000) {
      await placeOrder('BTCUSDT', 'SELL', 0.001);
    }

  } catch (error) {
    console.error('❌ Error en ciclo de trading:', error.message);
  }
});

// Endpoint de verificación para Render
app.get('/', (req, res) => {
  res.send('✅ Bot funcionando');
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`🚀 Bot escuchando en puerto ${PORT}`);
});

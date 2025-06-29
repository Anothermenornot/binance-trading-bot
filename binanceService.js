const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const API_KEY = process.env.BINANCE_API_KEY;
const API_SECRET = process.env.BINANCE_SECRET_KEY;
const BASE_URL = 'https://api.binance.com';

function sign(queryString) {
  return crypto
    .createHmac('sha256', API_SECRET)
    .update(queryString)
    .digest('hex');
}

// === Obtener balances ===
async function getAccountBalance() {
  const timestamp = Date.now();
  const query = `timestamp=${timestamp}`;
  const signature = sign(query);
  const url = `${BASE_URL}/api/v3/account?${query}&signature=${signature}`;

  try {
    const response = await axios.get(url, {
      headers: { 'X-MBX-APIKEY': API_KEY },
    });
    return response.data.balances;
  } catch (error) {
    console.error('❌ Error al obtener balances:', error.response?.data || error.message);
    return null;
  }
}

// === Obtener precios spot ===
async function getPrice(symbol = 'BTCUSDT') {
  try {
    const response = await axios.get(`${BASE_URL}/api/v3/ticker/price?symbol=${symbol}`);
    return parseFloat(response.data.price);
  } catch (error) {
    console.error(`❌ Error al obtener precio de ${symbol}:`, error.response?.data || error.message);
    return 0;
  }
}

// === Ejecutar orden de compra o venta ===
async function placeOrder(symbol, side, quantity) {
  const timestamp = Date.now();
  const params = `symbol=${symbol}&side=${side}&type=MARKET&quantity=${quantity}&timestamp=${timestamp}`;
  const signature = sign(params);
  const url = `${BASE_URL}/api/v3/order?${params}&signature=${signature}`;

  try {
    const response = await axios.post(url, null, {
      headers: { 'X-MBX-APIKEY': API_KEY },
    });
    console.log(`✅ Orden ejecutada: ${side} ${quantity} ${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error al ejecutar orden ${side}:`, error.response?.data || error.message);
    return null;
  }
}

// === Exportar funciones ===
module.exports = {
  getAccountBalance,
  getPrice,
  placeOrder,
};

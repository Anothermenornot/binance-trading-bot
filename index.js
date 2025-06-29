const express = require('express');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;

// Bot logic (se agregará luego)
cron.schedule('* * * * *', async () => {
  console.log("⏱️ Ejecutando lógica de trading cada minuto");
});

app.get('/', (req, res) => {
  res.send('✅ Bot activo y escuchando...');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en el puerto ${PORT}`);
});

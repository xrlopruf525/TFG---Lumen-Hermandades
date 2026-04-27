const express = require('express');
const mongoose = require('mongoose');

const hermanoRoutes = require('./routes/hermano.routes');
const { errorHandler } = require('./middlewares/error-handler');

const app = express();

app.use(express.json());
app.use('/api/hermanos', hermanoRoutes);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use(errorHandler);

async function start() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lumen-hermandades';
  const port = Number(process.env.PORT || 3000);

  await mongoose.connect(mongoUri);
  app.listen(port, () => {
    console.log(`Backend example running at http://localhost:${port}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error('Unable to start backend example', error);
    process.exit(1);
  });
}

module.exports = { app, start };

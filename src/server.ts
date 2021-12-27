import express from 'express';
import { Boleto } from './boleto';

const app = express();

app.get('/boleto/:line', (req, res) => {
  try {
    const { line } = req.params;
    const boleto = new Boleto(line);
    return res.status(200).json({
      barCode: boleto.barCode,
      amount: (boleto.amount / 100).toFixed(2),
      expirationDate: boleto.expirationDate.toLocaleDateString(),
    });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
});

app.listen(8080, () => {
  console.log('Server started');
});

import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';

import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../config/upload';

/*  Intanciando e passando a configuração para upload */
const upload = multer(uploadConfig);

const transactionsRouter = Router();

 /* Rota de Listagem */
 transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
   const transactions =  await transactionsRepository.find();

   const balance = await transactionsRepository.getBalance();

   return response.json({ transactions, balance });

});


transactionsRouter.post('/', async (request, response) => {
  /* Cria a constante para armazenar o dados do corpo da requisição */
  const { title, value, type, category } = request.body;
  
  /* Herda a classe CreateTransactionService colocando na cosnt createTransaction */
  const createTransaction = new CreateTransactionService();

   /* Passa para o método execute() os parametro para criação
      do repository, sendo os campos passado no request.body
   */
  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);

});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  /* Herda a classe DeleteTransactionService colocando na cosnt deleteTransaction */
  const deleteTransaction = new DeleteTransactionService();
  
  await deleteTransaction.execute(id);
  /* Retorna um Status do tipo 204  */
  return response.status(204).send();
});

transactionsRouter.post('/import',  upload.single('file'), async (request, response) => {
       const imporrtTransaction = new ImportTransactionsService();

       const transactions = await imporrtTransaction.execute(request.file.path);

       return response.json(transactions);

});

export default transactionsRouter;

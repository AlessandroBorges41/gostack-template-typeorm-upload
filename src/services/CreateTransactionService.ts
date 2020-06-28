import  { getRepository, getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';
import Category from '../models/Category';

interface Request{
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category  }: Request): Promise<Transaction> {
     const transactionsRepository = getCustomRepository(TransactionsRepository);

     /* Cria um repository apartir da model importada */
     const categoryRepository = getRepository(Category);

    /* Obtendo o saldo total executando a método getBalance do TransactionRepository */
    const { total } = await transactionsRepository.getBalance();

    /* Validando o Retorno do saldo, verifica se o Type é do tipo 'outcome' e se o valor passado é menor que o valor total */
    if (type === 'outcome' && total <= value){
        throw new AppError(' There is not enough balance ');
    }
     
     /* Verificando se a categoria existe, se não existir será criado.
        É passado para o findOne que busque o title igual a category informada  */
     let transactionCategory = await categoryRepository.findOne({
       where: { title: category,}
     });

     /* Cria a categoria, caso não seja encontrada */
     if(!transactionCategory){
       transactionCategory = categoryRepository.create({
         title: category,
       });

       /* Salvando a categoria criada para ser utilizada abaixo */
       await categoryRepository.save(transactionCategory);
     }

     const transaction = transactionsRepository.create({
       title,
       value,
       type,
       category: transactionCategory,
     });

     await transactionsRepository.save(transaction);
    
     return transaction;

  }
}

export default CreateTransactionService;

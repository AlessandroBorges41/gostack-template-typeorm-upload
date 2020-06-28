import  { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    /* Por enquanto pesquisa apenas pelo titulo da transação, mas usaremos mais parâmetros para retornar precisamente */
    const transactions = await transactionsRepository.findOne({
      where: { id }
    });

    /* Se encontrar */
    if(!transactions){
      throw new AppError('The informed Transaction does not exist',400);
    }

     await transactionsRepository.remove(transactions);
    
  }
}

export default DeleteTransactionService;

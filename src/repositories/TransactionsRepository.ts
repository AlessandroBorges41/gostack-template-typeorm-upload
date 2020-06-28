import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {

     /* Obtem todas as transações e como já estamos dentro do repository podemos usar o This  */
     const transactions = await this.find();
     
     const { income, outcome} = transactions.reduce((accumulator: Balance, transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += Number(transaction.value); //Força o retono convertendo em Number
            break;
          case 'outcome':
            accumulator.outcome += Number(transaction.value); //Força o retono convertendo em Number
            break;
          default:
            break;
        }
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
    /* Faz o calculo de crédito e débito obtendo valor total*/
    const total = income - outcome;

    /* Retorna um Objeto Transaction */ 
    return { income, outcome, total };
  
  }
}

export default TransactionsRepository;

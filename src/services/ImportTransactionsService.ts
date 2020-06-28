import  { getRepository, getCustomRepository, In } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import csvParse from 'csv-parse';
import fs from 'fs';
import TransactionsRepository from '../repositories/TransactionsRepository';


interface TransactionCSV {
  title: string,
  type: 'income' | 'outcome'
  value: number;
  category: string;
}


class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
  
   const transactionsRepository = getCustomRepository(TransactionsRepository);  

  /* Cria um repository apartir da model importada */
  const categoriesRepository = getRepository(Category);

    const contactReadStream = fs.createReadStream(filePath);

     

    const parsers = csvParse({
        from_line: 2, //A linha 1 será o titulo das colunas
    });

    /* O pipe permite que seja lido as linhas de acordo com a existência */
    const parseCSV = contactReadStream.pipe(parsers);

      /* Variaveis criadas para auxiliar no BulkInsert */
      const transactions: TransactionCSV[] = [];
      const categories: string[] = [];
      
      parseCSV.on('data', async line => {
        const [ title, type, value, category ] = line.map((cell: string) => 
          cell.trim(), //Remove os espaço entre os campos
      );

        /* Se um dos campos não exsitr será retornado sem carregar */
        if( !title || !type || !value ) return;
        
        categories.push(category);
        
        transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    /* Mapeando as Categorias e verificando se existe no banco de dados */
    const existeCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      }
    });

     /* Realizando um map para obter somente os títulos da categorias */
     const existeCategoriesTitles = existeCategories.map(
       (category: Category) => category.title,
     );

     /* Retorna do arquivo CSV todos as categorias que não existão no banco */
     const addCategoryTitles = categories
     .filter(category => !existeCategoriesTitles.includes(category))
     .filter((value, index, self)=> self.indexOf(value) === index);

     /* Adicionando as categorias no Banco de dados */
      const newCategories = categoriesRepository.create(
        addCategoryTitles.map(title => ({
          title,
        })),
      );

      await categoriesRepository.save(newCategories);

      const finalCategories = [...newCategories, ...existeCategories];

      const createdTransactions = transactionsRepository.create(
        transactions.map(transaction => ({
          title: transaction.title,
          type: transaction.type,
          value: transaction.value,
          category: finalCategories.find(category=> category.title === transaction.category,
         ),
        })),
      );

      await transactionsRepository.save(createdTransactions);  

      await fs.promises.unlink(filePath);

      /* Retorna todas as Transações criadas */ 
      return createdTransactions;

  }
    
}

export default ImportTransactionsService;

import {MigrationInterface, QueryRunner, TableForeignKey,TableColumn} from "typeorm";

export default class AddCategoryIdToTransactions1593331473132 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        //await queryRunner.dropColumn('transactions', 'category');
        await queryRunner.addColumn(
            'transactions',
               new TableColumn({
                   name: 'category_id',
                   type: 'uuid',
                   isNullable: true,
             }),
         );


      await queryRunner.createForeignKey(
           'transactions',
                new TableForeignKey({
                    columnNames: ['category_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'categories',
                    name:'TransactionCategory',
                    onDelete: 'SET NULL',
                    onUpdate: 'CASCADE',
                }),
      );
 }

    public async down(queryRunner: QueryRunner): Promise<void> {
    
        await queryRunner.dropForeignKey('transactions', 'TransactionCategory');
        await queryRunner.dropColumn('transactions','category_id');
       /*  await queryRunner.addColumn('transactions', new TableColumn({
            name: 'category',
            type: 'varchar',
            isNullable: false
        })
        ); */
    }
}

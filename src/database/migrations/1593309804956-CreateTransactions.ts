import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export default class CreateTransactions1593309804956 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
        new Table({
            name: 'transactions', /* nome da tabela */
            columns: [{
                name: 'id',
                type: 'uuid',
                isPrimary: true,
                generationStrategy: 'uuid',
                default: 'uuid_generate_v4()'
              },
              {
                  name: 'title',
                  type: 'varchar',
              },
              {
                name: 'type',
                type: 'varchar',
              },
              {
                name: 'value',
                type: 'decimal',
                precision: 10,
                scale: 2,
                isNullable: false
              },
              {
                name: 'created_at',
                type: 'timestamp',
                default: 'now()',
              },
              {
              name: 'updated_at',
              type: 'timestamp',
              default: 'now()',
            },
            ]
        })
    );
}

public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transactions');
}
}

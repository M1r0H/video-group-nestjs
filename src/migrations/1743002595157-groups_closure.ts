import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class GroupsClosure1743002595157 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'groups_closure',
        columns: [
          {
            name: 'id_ancestor',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'id_descendant',
            type: 'uuid',
            isPrimary: true,
          }
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['id_ancestor'],
            referencedTableName: 'groups',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['id_descendant'],
            referencedTableName: 'groups',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('groups_closure');
  }
}

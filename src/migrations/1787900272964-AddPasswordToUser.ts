import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordToUser1787811103784 implements MigrationInterface {
    name = 'AddPasswordToUser1787811103784'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "task_tags" DROP CONSTRAINT "FK_70515bc464901781ac60b82a1ea"`
        );

        await queryRunner.query(
            `ALTER TABLE "users" ADD "password" character varying(255)`
        );

        await queryRunner.query(
            `ALTER TABLE "task_tags" ADD CONSTRAINT "FK_70515bc464901781ac60b82a1ea" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "task_tags" DROP CONSTRAINT "FK_70515bc464901781ac60b82a1ea"`
        );

        await queryRunner.query(
            `ALTER TABLE "users" DROP COLUMN "password"`
        );

        await queryRunner.query(
            `ALTER TABLE "task_tags" ADD CONSTRAINT "FK_70515bc464901781ac60b82a1ea" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }
}
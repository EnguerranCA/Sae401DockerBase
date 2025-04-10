<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250404154114 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE post ADD reply_to_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE post ADD CONSTRAINT FK_5A8A6C8DFFDF7169 FOREIGN KEY (reply_to_id) REFERENCES post (id)');
        $this->addSql('CREATE INDEX IDX_5A8A6C8DFFDF7169 ON post (reply_to_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE post DROP FOREIGN KEY FK_5A8A6C8DFFDF7169');
        $this->addSql('DROP INDEX IDX_5A8A6C8DFFDF7169 ON post');
        $this->addSql('ALTER TABLE post DROP reply_to_id');
    }
}

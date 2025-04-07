<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250407090000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Fix created_at column in post table and set current time for existing rows';
    }

    public function up(Schema $schema): void
    {
        // Update the column definition to set a default value
        $this->addSql("ALTER TABLE post MODIFY created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL");

        // Update existing rows to set created_at to the current timestamp
        $this->addSql("UPDATE post SET created_at = NOW() WHERE created_at = '0000-00-00 00:00:00' OR created_at IS NULL");
    }

    public function down(Schema $schema): void
    {
        // Revert the column definition
        $this->addSql('ALTER TABLE post MODIFY created_at DATETIME NOT NULL');

        // Optionally, reset the created_at values (not recommended in most cases)
        // $this->addSql("UPDATE post SET created_at = '0000-00-00 00:00:00' WHERE created_at IS NOT NULL");
    }
}
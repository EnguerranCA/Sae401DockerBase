<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250407103347 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add created_at and updated_at columns and fix invalid datetime values';
    }

    public function up(Schema $schema): void
    {
        // Modifie la définition des colonnes pour éviter les valeurs invalides
        $this->addSql('ALTER TABLE post ADD created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP');
        $this->addSql('ALTER TABLE user ADD created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP');
        $this->addSql('ALTER TABLE user ADD updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
    }

    public function down(Schema $schema): void
    {
        // Revenir à l'état précédent
        $this->addSql('ALTER TABLE post DROP COLUMN created_at');
        $this->addSql('ALTER TABLE user DROP COLUMN created_at');
        $this->addSql('ALTER TABLE user DROP COLUMN updated_at');
    }
}

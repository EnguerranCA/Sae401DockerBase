<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250328102334 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_blocked (user_source INT NOT NULL, user_target INT NOT NULL, INDEX IDX_8258F58A3AD8644E (user_source), INDEX IDX_8258F58A233D34C1 (user_target), PRIMARY KEY(user_source, user_target)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_followed (user_source INT NOT NULL, user_target INT NOT NULL, INDEX IDX_AD8F58173AD8644E (user_source), INDEX IDX_AD8F5817233D34C1 (user_target), PRIMARY KEY(user_source, user_target)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_blocked ADD CONSTRAINT FK_8258F58A3AD8644E FOREIGN KEY (user_source) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_blocked ADD CONSTRAINT FK_8258F58A233D34C1 FOREIGN KEY (user_target) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_followed ADD CONSTRAINT FK_AD8F58173AD8644E FOREIGN KEY (user_source) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_followed ADD CONSTRAINT FK_AD8F5817233D34C1 FOREIGN KEY (user_target) REFERENCES user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_blocked DROP FOREIGN KEY FK_8258F58A3AD8644E');
        $this->addSql('ALTER TABLE user_blocked DROP FOREIGN KEY FK_8258F58A233D34C1');
        $this->addSql('ALTER TABLE user_followed DROP FOREIGN KEY FK_AD8F58173AD8644E');
        $this->addSql('ALTER TABLE user_followed DROP FOREIGN KEY FK_AD8F5817233D34C1');
        $this->addSql('DROP TABLE user_blocked');
        $this->addSql('DROP TABLE user_followed');
    }
}

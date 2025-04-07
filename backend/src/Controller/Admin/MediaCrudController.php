<?php

namespace App\Controller\Admin;

use App\Entity\Media;
use App\Entity\Post;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use App\Enum\MediaType;

class MediaCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Media::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Media')
            ->setEntityLabelInPlural('Media')
            ->setSearchFields(['path', 'post.content'])
            ->setDefaultSort(['id' => 'DESC'])
            ->setPaginatorPageSize(30);
    }

    public function configureActions(Actions $actions): Actions
    {
        return $actions
            ->add(Crud::PAGE_INDEX, Action::DETAIL)
            ->update(Crud::PAGE_INDEX, Action::NEW, function (Action $action) {
                return $action->setIcon('fa fa-plus')->setLabel('Add Media');
            })
            ->update(Crud::PAGE_INDEX, Action::EDIT, function (Action $action) {
                return $action->setIcon('fa fa-edit');
            })
            ->update(Crud::PAGE_INDEX, Action::DELETE, function (Action $action) {
                return $action->setIcon('fa fa-trash');
            });
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm(),
            ImageField::new('path')
                ->setBasePath('http://localhost:8080/uploads/media')
                ->setUploadDir('public/uploads/media')
                ->setRequired(false),
            ChoiceField::new('type')
                ->setChoices([
                    'Image' => MediaType::IMAGE,
                    'Video' => MediaType::VIDEO,
                ]),
            AssociationField::new('post')
                ->setFormTypeOption('choice_label', 'content')
                ->formatValue(function ($value, $entity) {
                    return $entity->getPost() ? $entity->getPost()->getContent() : '';
                }),
            BooleanField::new('post.isCensored')
                ->setLabel('Is Post Censored')
                ->renderAsSwitch(false)
                ->onlyOnDetail(),
        ];
    }
} 
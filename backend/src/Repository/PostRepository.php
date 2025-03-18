<?php

namespace App\Repository;

use App\Entity\Post;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

use Doctrine\ORM\Tools\Pagination\Paginator;

/**
 * @extends ServiceEntityRepository<Post>
 */
class PostRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Post::class);
    }

    //    /**
    //     * @return Post[] Returns an array of Post objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    public function findAll(): array
    {
        return $this->createQueryBuilder('p')
            ->orderBy('p.id', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }

    public function findOnePost($value): ?Post
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.id = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    public function save(Post $post): void
    {
        $this->_em->persist($post);
        $this->_em->flush();
    }

    public function paginateAllOrderedByLatest($offset, $count): Paginator
    {
        $query = $this->createQueryBuilder('p')
            ->orderBy('p.created_at', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($count)
            ->getQuery();

        return new Paginator($query);
    }
}

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

    public function findAll(): array
    {
        return $this->createQueryBuilder('p')
            ->addSelect('u')
            ->leftJoin('p.user', 'u')
            ->orderBy('p.id', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }

    public function findOnePost($value): ?Post
    {
        return $this->createQueryBuilder('p')
            ->addSelect('u')
            ->leftJoin('p.user', 'u')
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
            ->addSelect('u', 'r', 'ru')
            ->leftJoin('p.user', 'u')
            ->leftJoin('p.replies', 'r')
            ->leftJoin('r.user', 'ru')
            ->where('p.replyTo IS NULL')
            ->orderBy('p.created_at', 'DESC')
            ->addOrderBy('r.created_at', 'ASC')
            ->setFirstResult($offset)
            ->setMaxResults($count)
            ->getQuery();

        return new Paginator($query);
    }

    public function paginateFollowedUsersPosts($user, $offset, $count): Paginator
    {
        $query = $this->createQueryBuilder('p')
            ->addSelect('u', 'r', 'ru')
            ->leftJoin('p.user', 'u')
            ->leftJoin('p.replies', 'r')
            ->leftJoin('r.user', 'ru')
            ->where('u.id IN (:followedUsers)')
            ->andWhere('p.replyTo IS NULL')
            ->setParameter('followedUsers', $user->getFollowedUsers())
            ->orderBy('p.created_at', 'DESC')
            ->addOrderBy('r.created_at', 'ASC')
            ->setFirstResult($offset)
            ->setMaxResults($count)
            ->getQuery();

        return new Paginator($query);
    }

    public function findPostsByUsername($username): ?array
    {
        return $this->createQueryBuilder('p')
            ->addSelect('u', 'r', 'ru')
            ->leftJoin('p.user', 'u')
            ->leftJoin('p.replies', 'r')
            ->leftJoin('r.user', 'ru')
            ->andWhere('u.username = :username')
            ->andWhere('p.replyTo IS NULL')
            ->setParameter('username', $username)
            ->orderBy('p.created_at', 'DESC')
            ->addOrderBy('r.created_at', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }
}

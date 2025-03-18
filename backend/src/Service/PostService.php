<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;

use App\DTO\CreatePostPayload;

use App\Entity\Post;

final class PostService
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function create(CreatePostPayload $createPostPayload): void
    {
        // Create a new post
        $post = new Post();
        $post->setContent($createPostPayload->getContent());
        $post->setCreatedAt(new \DateTime());
        
        // Save the post to the database
        $this->entityManager->persist($post);

        // executes the queries
        $this->entityManager->flush();
    }
}

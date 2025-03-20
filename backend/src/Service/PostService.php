<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;

use App\DTO\CreatePostPayload;

use App\Entity\Post;
use App\Entity\User;

final class PostService
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function create(CreatePostPayload $createPostPayload): void
    {
        // Find the user by username
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['username' => $createPostPayload->getUsername()]);

        if (!$user) {
            throw new \Exception('User not found');
        }

        // Create a new post
        $post = new Post();
        $post->setContent($createPostPayload->getContent());
        $post->setCreatedAt(new \DateTime());
        $post->setUser($user);

        // Save the post to the database
        $this->entityManager->persist($post);

        // Executes the queries
        $this->entityManager->flush();
    }
}

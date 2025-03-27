<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;


use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;

use App\Repository\PostRepository;
use App\Service\PostService;

use Symfony\Component\Validator\Validator\ValidatorInterface;
use App\DTO\CreatePostPayload;

use App\Entity\Post;

final class PostController extends AbstractController
{
    // Get all posts
    #[Route('/api/posts', name: "post.index", methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function index(Request $request, PostRepository $postRepository): Response
    {
        // Get the page parameter from the request, default to 1 if not provided
        $page = $request->query->getInt('page', 1);

        // Calculate the offset based on the page number
        $offset = ($page - 1) * 10;

        // Get the paginated posts
        $paginator = $postRepository->paginateAllOrderedByLatest($offset, 10);

        $previousPage = $page > 1 ? $page - 1 : null;
        $nextPage = count($paginator) > 0 ? $page + 1 : null;

        // Get the currently authenticated user
        $currentUser = $this->getUser();

        // Format the posts with user details, likes, and whether the user has liked the post
        $posts = [];
        foreach ($paginator as $post) {
            $user = $post->getUser();
            $likes = $post->getLikes(); // Assuming getLikes() returns a collection of users who liked the post
            $hasUserLiked = $likes->contains($currentUser);

            $posts[] = [
                'id' => $post->getId(),
                'content' => $post->getContent(),
                'created_at' => $post->getCreatedAt(),
                'user' => [
                    'name' => $user ? $user->getName() : null,
                    'username' => $user ? $user->getUsername() : null,
                    'avatar' => $user ? $user->getAvatar() : null,
                ],
                'likes' => [
                    'count' => count($likes),
                    'hasLiked' => $hasUserLiked,
                    'users' => array_map(function ($likeUser) {
                        return [
                            'name' => $likeUser->getName(),
                            'username' => $likeUser->getUsername(),
                            'avatar' => $likeUser->getAvatar(),
                        ];
                    }, $likes->toArray())
                ]
            ];
        }

        // Return the paginated posts
        return $this->json([
            'posts' => $posts,
            'previous_page' => $previousPage,
            'next_page' => $nextPage
        ]);
    }

    // Get one post by id
    #[Route('/api/posts/{id}', methods: ['GET'])]
    public function show(PostRepository $postRepository, int $id): Response
    {
        $post = $postRepository->findOnePost($id);

        if (!$post) {
            return $this->json(['message' => 'Post not found'], Response::HTTP_NOT_FOUND);
        }

        $user = $post->getUser();
        $likes = $post->getLikes(); // Assuming getLikes() returns a collection of users who liked the post

        return $this->json([
            'id' => $post->getId(),
            'content' => $post->getContent(),
            'created_at' => $post->getCreatedAt(),
            'user' => [
                'name' => $user ? $user->getName() : null,
                'username' => $user ? $user->getUsername() : null,
                'avatar' => $user ? $user->getAvatar() : null,
            ],
            'likes' => [
                'count' => count($likes),
                'users' => array_map(function ($likeUser) {
                    return [
                        'name' => $likeUser->getName(),
                        'username' => $likeUser->getUsername(),
                        'avatar' => $likeUser->getAvatar(),
                    ];
                }, $likes->toArray())
            ]
        ]);
    }

    // Create a new post
    #[Route('/api/posts', methods: ['POST'], format: 'json')]
    public function create(
        #[MapQueryParameter] string $content,
        #[MapQueryParameter] string $username,

        PostService $postService
    ): Response {
        // Create a new post
        $createPostPayload = new CreatePostPayload($content, $username);

        // Create the post
        $postService->create($createPostPayload);

        // Return a response
        return new Response('', Response::HTTP_CREATED);
    }

    // Like a post
    #[Route('/api/posts/{id}/like', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function like(PostRepository $postRepository, EntityManagerInterface $entityManager, int $id): Response
    {
        $post = $postRepository->findOnePost($id);

        if (!$post) {
            return $this->json(['message' => 'Post not found'], Response::HTTP_NOT_FOUND);
        }

        $currentUser = $this->getUser();

        // Check if the user has already liked the post
        if ($post->getLikes()->contains($currentUser)) {
            return $this->json(['message' => 'You have already liked this post'], Response::HTTP_BAD_REQUEST);
        }

        // Add the user to the post's likes
        $post->addLike($currentUser);

        $entityManager->flush();

        return $this->json(['message' => 'Post liked']);
    }
    
    // Unlike a post
    #[Route('/api/posts/{id}/unlike', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function unlike(PostRepository $postRepository, EntityManagerInterface $entityManager, int $id): Response
    {
        $post = $postRepository->findOnePost($id);

        if (!$post) {
            return $this->json(['message' => 'Post not found'], Response::HTTP_NOT_FOUND);
        }

        $currentUser = $this->getUser();

        // Check if the user has liked the post
        if (!$post->getLikes()->contains($currentUser)) {
            return $this->json(['message' => 'You have not liked this post'], Response::HTTP_BAD_REQUEST);
        }

        // Remove the user from the post's likes
        $post->getLikes()->removeElement($currentUser);

        $entityManager->flush();

        return $this->json(['message' => 'Post unliked']);
    }
}

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

        // Format the posts with user details
        $posts = [];
        foreach ($paginator as $post) {
            $user = $post->getUser();
            $posts[] = [
                'id' => $post->getId(),
                'content' => $post->getContent(),
                'created_at' => $post->getCreatedAt(),
                'user' => [
                    'name' => $user ? $user->getName() : null,
                    'username' => $user ? $user->getUsername() : null,
                    'avatar' => $user ? $user->getAvatar() : null,
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

        return $this->json([
            'id' => $post->getId(),
            'content' => $post->getContent(),
            'created_at' => $post->getCreatedAt(),
            'user' => [
                'name' => $user ? $user->getName() : null,
                'username' => $user ? $user->getUsername() : null,
                'avatar' => $user ? $user->getAvatar() : null,
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
}

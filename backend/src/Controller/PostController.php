<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;



use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;

use App\Repository\PostRepository;
use App\Service\PostService;

use Symfony\Component\Validator\Validator\ValidatorInterface;
use App\DTO\CreatePostPayload;

use App\Entity\Post;

final class PostController extends AbstractController
{
    // Get all posts
    #[Route('/posts', name:"post.index" ,methods: ['GET'])]
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

        // Return the paginated posts
        return $this->json([
            'posts' => $paginator,
            'previous_page' => $previousPage,
            'next_page' => $nextPage
        ]);
    }

    // Get one post by id
    #[Route('/posts/{id}', methods: ['GET'])]
    public function show(PostRepository $postRepository, int $id): Response
    {
        $post = $postRepository->findOnePost($id);

        return $this->json($post);
    }

    // Create a new post
    #[Route('/posts', methods: ['POST'], format: 'json')]
    public function create(
        #[MapQueryParameter] string $content,
        PostService $postService
    ): Response {
        // Create a new post
        $createPostPayload = new CreatePostPayload($content);

        // Create the post
        $postService->create($createPostPayload);

        // Return a response
        return new Response('', Response::HTTP_CREATED);
    }
}
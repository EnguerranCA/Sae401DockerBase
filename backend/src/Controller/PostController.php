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
use Symfony\Component\HttpFoundation\File\UploadedFile;

use App\Entity\Post;
use App\Entity\Media;
use App\Enum\MediaType;

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

        // Check if the filter parameter is set to 'follow'
        $filter = $request->query->get('filter');
        $currentUser = $this->getUser();

        if ($filter === 'follow') {
            // Get posts only from followed users
            $paginator = $postRepository->paginateFollowedUsersPosts($currentUser, $offset, 10);
        } else {
            // Get all posts
            $paginator = $postRepository->paginateAllOrderedByLatest($offset, 10);
        }

        $previousPage = $page > 1 ? $page - 1 : null;
        $nextPage = count($paginator) > 0 ? $page + 1 : null;

        // Format the posts with user details, likes, media paths, and whether the user has liked the post
        $posts = [];
        foreach ($paginator as $post) {
            $user = $post->getUser();
            $likes = $post->getLikes();
            $hasUserLiked = $likes->contains($currentUser);

            // Get media paths
            $mediaPaths = [];
            foreach ($post->getMedias() as $media) {
                $mediaPaths[] = $media->getPath();
            }

            // Get replies
            $replies = [];
            foreach ($post->getReplies() as $reply) {
                $replyUser = $reply->getUser();
                $replyLikes = $reply->getLikes();
                $hasUserLikedReply = $replyLikes->contains($currentUser);

                $replies[] = [
                    'id' => $reply->getId(),
                    'content' => $reply->getContent(),
                    'createdAt' => $reply->getCreatedAt(),
                    'user' => [
                        'name' => $replyUser ? $replyUser->getName() : null,
                        'username' => $replyUser ? $replyUser->getUsername() : null,
                        'avatar' => $replyUser ? $replyUser->getAvatar() : null,
                    ],
                    'likes' => [
                        'count' => count($replyLikes),
                        'hasLiked' => $hasUserLikedReply,
                        'users' => array_map(function ($likeUser) {
                            return [
                                'name' => $likeUser->getName(),
                                'username' => $likeUser->getUsername(),
                                'avatar' => $likeUser->getAvatar(),
                            ];
                        }, $replyLikes->toArray())
                    ]
                ];
            }

            if ($user && $user->isBlocked()) {
                $posts[] = [
                    'id' => $post->getId(),
                    'content' => 'This account has been blocked',
                    'createdAt' => $post->getCreatedAt(),
                    'user' => [
                        'name' => null,
                        'username' => null,
                        'avatar' => 'default.jpg',
                    ],
                    'likes' => [
                        'count' => 0,
                        'hasLiked' => false,
                        'users' => []
                    ],
                    'media' => [],
                    'replies' => []
                ];
            } else if ($post->isCensored()) {
                $posts[] = [
                    'id' => $post->getId(),
                    'content' => 'Ce message enfreint les conditions d\'utilisation de la plateforme',
                    'createdAt' => $post->getCreatedAt(),
                    'user' => [
                        'name' => $user ? $user->getName() : null,
                        'username' => $user ? $user->getUsername() : null,
                        'avatar' => $user ? $user->getAvatar() : null,
                    ],
                    'likes' => [
                        'count' => 0,
                        'hasLiked' => false,
                        'users' => []
                    ],
                    'media' => [],
                    'replies' => []
                ];
            } else {
                $posts[] = [
                    'id' => $post->getId(),
                    'content' => $post->getContent(),
                    'createdAt' => $post->getCreatedAt(),
                    'user' => [
                        'name' => $user ? $user->getName() : null,
                        'username' => $user ? $user->getUsername() : null,
                        'avatar' => $user ? $user->getAvatar() : null,
                        'isReadOnly' => $user ? $user->isReadOnly() : null,
                        'isPrivate' => $user ? $user->isPrivate() : null,
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
                    ],
                    'media' => $mediaPaths,
                    'replies' => $replies
                ];
            }
        }

        // Return the paginated posts
        return $this->json([
            'posts' => $posts,
            'previous_page' => $previousPage,
            'next_page' => $nextPage
        ]);
    }

    // Get all posts from a username
    #[Route('/api/posts/user/{username}', methods: ['GET'])]
    public function getPostsByUsername(PostRepository $postRepository, string $username): Response
    {
        // Get posts by username
        $posts = $postRepository->findPostsByUsername($username);

        if (!$posts) {
            return $this->json(['message' => 'No posts found for this user'], Response::HTTP_NOT_FOUND);
        }

        $currentUser = $this->getUser();

        // Format the posts with user details and likes
        $formattedPosts = [];
        foreach ($posts as $post) {
            $user = $post->getUser();
            $likes = $post->getLikes();
            $hasUserLiked = $likes->contains($currentUser);

            // Get media paths
            $mediaPaths = [];
            foreach ($post->getMedias() as $media) {
                $mediaPaths[] = $media->getPath();
            }

            // Get replies
            $replies = [];
            foreach ($post->getReplies() as $reply) {
                $replyUser = $reply->getUser();
                $replyLikes = $reply->getLikes();
                $hasUserLikedReply = $replyLikes->contains($currentUser);

                $replies[] = [
                    'id' => $reply->getId(),
                    'content' => $reply->getContent(),
                    'createdAt' => $reply->getCreatedAt(),
                    'user' => [
                        'name' => $replyUser ? $replyUser->getName() : null,
                        'username' => $replyUser ? $replyUser->getUsername() : null,
                        'avatar' => $replyUser ? $replyUser->getAvatar() : null,
                    ],
                    'likes' => [
                        'count' => count($replyLikes),
                        'hasLiked' => $hasUserLikedReply,
                        'users' => array_map(function ($likeUser) {
                            return [
                                'name' => $likeUser->getName(),
                                'username' => $likeUser->getUsername(),
                                'avatar' => $likeUser->getAvatar(),
                            ];
                        }, $replyLikes->toArray())
                    ]
                ];
            }

            if ($post->isCensored()) {
                $formattedPosts[] = [
                    'id' => $post->getId(),
                    'content' => 'Ce message enfreint les conditions d\'utilisation de la plateforme',
                    'createdAt' => $post->getCreatedAt(),
                    'user' => [
                        'name' => $user ? $user->getName() : null,
                        'username' => $user ? $user->getUsername() : null,
                        'avatar' => $user ? $user->getAvatar() : null,
                    ],
                    'likes' => [
                        'count' => 0,
                        'hasLiked' => false,
                        'users' => []
                    ],
                    'media' => [],
                    'replies' => []
                ];
            } else {
                $formattedPosts[] = [
                    'id' => $post->getId(),
                    'content' => $post->getContent(),
                    'createdAt' => $post->getCreatedAt(),
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
                    ],
                    'media' => $mediaPaths,
                    'replies' => $replies
                ];
            }
        }

        return $this->json(['posts' => $formattedPosts]);
    }


    // Get one post by id
    #[Route('/api/posts/{id}', methods: ['GET'])]
    public function getPost(PostRepository $postRepository, int $id): Response
    {
        $post = $postRepository->find($id);

        if (!$post) {
            return $this->json(['message' => 'Post not found'], Response::HTTP_NOT_FOUND);
        }

        $currentUser = $this->getUser();
        $user = $post->getUser();
        $likes = $post->getLikes();
        $hasUserLiked = $likes->contains($currentUser);

        // Get media paths
        $mediaPaths = [];
        foreach ($post->getMedias() as $media) {
            $mediaPaths[] = $media->getPath();
        }

        // Get replies
        $replies = [];
        foreach ($post->getReplies() as $reply) {
            $replyUser = $reply->getUser();
            $replyLikes = $reply->getLikes();
            $hasUserLikedReply = $replyLikes->contains($currentUser);

            $replies[] = [
                'id' => $reply->getId(),
                'content' => $reply->getContent(),
                'createdAt' => $reply->getCreatedAt(),
                'user' => [
                    'name' => $replyUser ? $replyUser->getName() : null,
                    'username' => $replyUser ? $replyUser->getUsername() : null,
                    'avatar' => $replyUser ? $replyUser->getAvatar() : null,
                ],
                'likes' => [
                    'count' => count($replyLikes),
                    'hasLiked' => $hasUserLikedReply,
                    'users' => array_map(function ($likeUser) {
                        return [
                            'name' => $likeUser->getName(),
                            'username' => $likeUser->getUsername(),
                            'avatar' => $likeUser->getAvatar(),
                        ];
                    }, $replyLikes->toArray())
                ]
            ];
        }

        if ($post->isCensored()) {
            return $this->json([
                'id' => $post->getId(),
                'content' => 'Ce message enfreint les conditions d\'utilisation de la plateforme',
                'createdAt' => $post->getCreatedAt(),
                'user' => [
                    'name' => $user ? $user->getName() : null,
                    'username' => $user ? $user->getUsername() : null,
                    'avatar' => $user ? $user->getAvatar() : null,
                ],
                'likes' => [
                    'count' => 0,
                    'hasLiked' => false,
                    'users' => []
                ],
                'media' => [],
                'replies' => []
            ]);
        }

        return $this->json([
            'id' => $post->getId(),
            'content' => $post->getContent(),
            'createdAt' => $post->getCreatedAt(),
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
            ],
            'media' => $mediaPaths,
            'replies' => $replies
        ]);
    }

    // Create a new post
    #[Route('/api/posts', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function create(
        Request $request,
        EntityManagerInterface $entityManager
    ): Response {
        $currentUser = $this->getUser();

        // Get the formData from the request
        $content = $request->request->get('content');

        if (!$content) {
            return $this->json(['message' => 'Content is required'], Response::HTTP_BAD_REQUEST);
        }

        // Create a new Post entity
        $post = new Post();
        $post->setContent($content);
        $post->setUser($currentUser);
        $post->setCreatedAt(new \DateTime());

        // Handle media uploads
        if ($request->files->has('media')) {
            $mediaFiles = $request->files->all()['media'];
            if (!is_array($mediaFiles)) {
                $mediaFiles = [$mediaFiles];
            }

            foreach ($mediaFiles as $mediaFile) {
                if ($mediaFile instanceof UploadedFile) {
                    $originalFilename = pathinfo($mediaFile->getClientOriginalName(), PATHINFO_FILENAME);
                    $newFilename = $originalFilename.'-'.uniqid().'.'.$mediaFile->guessExtension();
                    
                    // Determine media type based on file extension
                    $extension = strtolower($mediaFile->getClientOriginalExtension());
                    $mediaType = in_array($extension, ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv']) 
                        ? MediaType::VIDEO 
                        : MediaType::IMAGE;

                    $mediaFile->move(
                        $this->getParameter('kernel.project_dir') . '/public/uploads/media',
                        $newFilename
                    );

                    $media = new Media();
                    $media->setPath($newFilename);
                    $media->setType($mediaType);
                    $media->setPost($post);
                    $entityManager->persist($media);
                }
            }
        }

        // Persist the post
        $entityManager->persist($post);
        $entityManager->flush();

        return $this->json(['message' => 'Post created successfully'], Response::HTTP_CREATED);
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

    // Delete a post if the user is the author
    #[Route('/api/posts/{id}', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    public function delete(PostRepository $postRepository, EntityManagerInterface $entityManager, int $id): Response
    {
        $post = $postRepository->findOnePost($id);

        if (!$post) {
            return $this->json(['message' => 'Post not found'], Response::HTTP_NOT_FOUND);
        }

        $currentUser = $this->getUser();

        // Check if the user is the author of the post
        if ($post->getUser() !== $currentUser) {
            return $this->json(['message' => 'You are not authorized to delete this post'], Response::HTTP_FORBIDDEN);
        }

        $entityManager->remove($post);
        $entityManager->flush();

        return $this->json(['message' => 'Post deleted']);
    }

    // Update a post
    #[Route('/api/posts/{id}', methods: ['PATCH'])]
    #[IsGranted('ROLE_USER')]
    public function update(PostRepository $postRepository, EntityManagerInterface $entityManager, int $id, Request $request): Response
    {
        $post = $postRepository->findOnePost($id);

        if (!$post) {
            return $this->json(['message' => 'Post not found'], Response::HTTP_NOT_FOUND);
        }

        // Vérifier que l'utilisateur est l'auteur du post
        $currentUser = $this->getUser();
        if ($post->getUser()->getId() !== $currentUser->getId()) {
            return $this->json(['message' => 'You are not authorized to edit this post'], Response::HTTP_FORBIDDEN);
        }

        // Récupérer les données de la requête
        $data = json_decode($request->getContent(), true);

        if (isset($data['content'])) {
            $post->setContent($data['content']);
        }

        // Gérer les médias
        if (array_key_exists('mediaFiles', $data)) {
            // Supprimer les anciens médias
            foreach ($post->getMedias() as $media) {
                $entityManager->remove($media);
            }
            $post->getMedias()->clear();

            // Si mediaFiles est un tableau non vide, ajouter les nouveaux médias
            if (is_array($data['mediaFiles']) && !empty($data['mediaFiles'])) {
                foreach ($data['mediaFiles'] as $mediaPath) {
                    $media = new Media();
                    $media->setPath($mediaPath);
                    $media->setType(MediaType::IMAGE);
                    $media->setPost($post);
                    $entityManager->persist($media);
                }
            }
        }

        try {
            $entityManager->flush();
            return $this->json([
                'message' => 'Post updated successfully',
                'post' => [
                    'id' => $post->getId(),
                    'content' => $post->getContent(),
                    'media' => array_map(function($media) {
                        return $media->getPath();
                    }, $post->getMedias()->toArray())
                ]
            ]);
        } catch (\Exception $e) {
            return $this->json(['message' => 'Error updating post: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/api/posts/{id}/replies', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getReplies(PostRepository $postRepository, int $id): Response
    {
        $post = $postRepository->find($id);
        if (!$post) {
            return $this->json(['message' => 'Post not found'], Response::HTTP_NOT_FOUND);
        }

        $replies = $post->getReplies();
        $data = [];
        foreach ($replies as $reply) {
            $data[] = [
                'id' => $reply->getId(),
                'content' => $reply->getContent(),
                'createdAt' => $reply->getCreatedAt(),
                'user' => [
                    'id' => $reply->getUser()->getId(),
                    'username' => $reply->getUser()->getUsername(),
                    'name' => $reply->getUser()->getName(),
                    'avatar' => $reply->getUser()->getAvatar(),
                ],
                'likes' => $reply->getLikes()->count(),
                'hasLiked' => $reply->getLikes()->contains($this->getUser()),
                'replyCount' => $reply->getReplies()->count(),
            ];
        }

        return $this->json($data);
    }

    #[Route('/api/posts/{id}/reply', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function replyToPost(Request $request, PostRepository $postRepository, EntityManagerInterface $entityManager, int $id): Response
    {
        $post = $postRepository->find($id);
        if (!$post) {
            return $this->json(['message' => 'Post not found'], Response::HTTP_NOT_FOUND);
        }

        $content = $request->request->get('content');
        if (!$content) {
            return $this->json(['message' => 'Content is required'], Response::HTTP_BAD_REQUEST);
        }

        $reply = new Post();
        $reply->setContent($content);
        $reply->setUser($this->getUser());
        $reply->setReplyTo($post);
        $reply->setCreatedAt(new \DateTime());

        $entityManager->persist($reply);
        $entityManager->flush();

        return $this->json([
            'id' => $reply->getId(),
            'content' => $reply->getContent(),
            'createdAt' => $reply->getCreatedAt(),
            'user' => [
                'id' => $reply->getUser()->getId(),
                'username' => $reply->getUser()->getUsername(),
                'name' => $reply->getUser()->getName(),
                'avatar' => $reply->getUser()->getAvatar(),
            ],
            'likes' => 0,
            'hasLiked' => false,
            'replyCount' => 0,
        ]);
    }
}

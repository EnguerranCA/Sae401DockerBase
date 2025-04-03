<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;


use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class UserController extends AbstractController
{


    #[Route('/users/logout', name: 'user_logout')]
    public function logout()
    {
        throw new \Exception('This should never be reached!');
    }


    // #[Route('/user/{id}', name: 'user_show')]
    // public function show(int $id, UserRepository $userRepository): Response
    // {
    //     $user = $userRepository->findOneById($id);

    //     if (!$user) {
    //         throw $this->createNotFoundException('The user does not exist');
    //     }

    //     return new Response("User: " . $user->getName());
    // }


    // Get one user by id
    #[Route('/users/{id}', methods: ['GET'])]
    public function show(UserRepository $userRepository, int $id): Response
    {
        $user = $userRepository->findOneById($id);

        if (!$user) {
            throw $this->createNotFoundException('The user does not exist');
        }

        return $this->json([
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'name' => $user->getName(),
            'avatar' => $user->getAvatar(),
            'bio' => $user->getBio(),
            'banner' => $user->getBanner(),
            'website' => $user->getWebsite(),

            // Add other fields you want to expose
        ]);
    }

    // Get one user by username
    #[Route('/api/users/{username}', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function showByUsername(UserRepository $userRepository, string $username): Response
    {
        $user = $userRepository->findOneBy(['username' => $username]);
        $currentUser = $this->getUser();

        if (!$user) {
            throw $this->createNotFoundException('The user does not exist');
        }

        $isFollowed = $currentUser->getFollowedUsers()->contains($user);

        return $this->json([
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'name' => $user->getName(),
            'avatar' => $user->getAvatar(),
            'bio' => $user->getBio(),
            'banner' => $user->getBanner(),
            'website' => $user->getWebsite(),
            'location' => $user->getLocation(),
            'isFollowed' => $isFollowed,

            // Add other fields you want to expose
        ]);
    }

    

    #[Route('/api/me', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function me(): Response
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'name' => $user->getName(),
            'avatar' => $user->getAvatar(),
        ]);
    }

    // Edit user info
    #[Route('/api/me', methods: ['PATCH'])]
    #[IsGranted('ROLE_USER')]
    public function edit(Request $request, UserRepository $userRepository, EntityManagerInterface $entityManager): Response
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['username'])) {
            $user->setUsername($data['username']);
        }

        if (isset($data['name'])) {
            $user->setName($data['name']);
        }

        if (isset($data['bio'])) {
            $user->setBio($data['bio']);
        }

        if (isset($data['website'])) {
            $user->setWebsite($data['website']);
        }

        if (isset($data['avatar'])) {
            $user->setAvatar($data['avatar']);
        }

        if (isset($data['banner'])) {
            $user->setBanner($data['banner']);
        }

        if (isset($data['location'])) {
            $user->setLocation($data['location']);
        }

        $entityManager->flush();

        return $this->json([
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'name' => $user->getName(),
            'avatar' => $user->getAvatar(),
            'bio' => $user->getBio(),
            'banner' => $user->getBanner(),
            'website' => $user->getWebsite(),
            'location' => $user->getLocation(),
        ]);
    }


    // Admin routes
    #[Route('/api/admin/users/{id}', methods: ['GET'])]
    // #[IsGranted('ROLE_ADMIN')]
    public function adminShow(UserRepository $userRepository, int $id): Response
    {
        $user = $userRepository->findOneById($id);

        if (!$user) {
            throw $this->createNotFoundException('The user does not exist');
        }

        return $this->json([
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'name' => $user->getName(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'avatar' => $user->getAvatar(),
            'apiToken' => $user->getApiToken(),
            'verification_code' => $user->getVerificationCode(),
            'isVerified' => $user->getIsVerified(),
            // Add other fields you want to expose
        ]);
    }

    #[Route('/api/admin/users', methods: ['GET'])]
    public function adminIndex(UserRepository $userRepository): Response
    {
        $users = $userRepository->findAll();

        $data = [];
        $data['users'] = [];

        foreach ($users as $user) {
            $data['users'][] = [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'name' => $user->getName(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
                'avatar' => $user->getAvatar(),
                'apiToken' => $user->getApiToken(),
                'verification_code' => $user->getVerificationCode(),
                'isVerified' => $user->getIsVerified(),
                // Add other fields you want to expose
            ];
        }


        return $this->json($data);
    }

    #[Route('/api/admin/users/{id}', methods: ['PATCH'])]
    public function updateUser(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager, int $id): Response
    {
        $user = $userRepository->findOneById($id);

        if (!$user) {
            throw $this->createNotFoundException('The user does not exist');
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['username'])) {
            $user->setUsername($data['username']);
        }

        if (isset($data['name'])) {
            $user->setName($data['name']);
        }

        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }

        if (isset($data['roles'])) {
            $user->setRoles($data['roles']);
        }

        if (isset($data['avatar'])) {
            $user->setAvatar($data['avatar']);
        }

        if (isset($data['password'])) {
            $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);
        }

        if (isset($data['apiToken'])) {
            $user->setApiToken($data['apiToken']);
        }

        if (isset($data['verification_code'])) {
            $user->setVerificationCode($data['verification_code']);
        }

        if (isset($data['isVerified'])) {
            $user->setIsVerified($data['isVerified']);
        }

        $entityManager->flush();

        return $this->json([
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'name' => $user->getName(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'avatar' => $user->getAvatar(),
            'apiToken' => $user->getApiToken(),
            'verification_code' => $user->getVerificationCode(),
            'isVerified' => $user->getIsVerified(),
        ]);
    }

    // Get all liked post from a user
    #[Route('/api/users/{id}/liked-posts', methods: ['GET'])]
    public function getLikedPosts(UserRepository $userRepository, int $id): Response
    {
        $user = $userRepository->findOneById($id);

        if (!$user) {
            throw $this->createNotFoundException('The user does not exist');
        }

        $likedPosts = $user->getLiked();

        $data = [];
        foreach ($likedPosts as $post) {
            $data[] = [
                'id' => $post->getId(),
                'content' => $post->getContent(),
                'createdAt' => $post->getCreatedAt(),
                // Add other fields you want to expose
            ];
        }

        return $this->json($data);
    }

    // public function blockUser(UserRepository $userRepository, EntityManagerInterface $entityManager, int $id): JsonResponse
    // {
    //     $user = $this->getUser();
    //     $userToBlock = $userRepository->find($id);

    //     if (!$userToBlock) {
    //         return $this->json(['error' => 'User not found'], 404);
    //     }

    //     $user->addBlockedUser($userToBlock);
    //     $entityManager->flush();

    //     return $this->json(['message' => 'User blocked successfully']);
    // }

    #[Route('/api/users/{username}/follow', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function followUser(UserRepository $userRepository, EntityManagerInterface $entityManager, string $username): JsonResponse
    {
        $user = $this->getUser();
        $userToFollow = $userRepository->findOneBy(['username' => $username]);
        
        if (!$userToFollow) {
            return $this->json(['error' => 'User not found'], 404);
        }

        $user->addFollowedUser($userToFollow);
        $entityManager->flush();

        return $this->json(['message' => 'User followed successfully']);
    }

    #[Route('/api/users/{username}/unfollow', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function unfollowUser(UserRepository $userRepository, EntityManagerInterface $entityManager, string $username): JsonResponse
    {
        $user = $this->getUser();
        $userToUnfollow = $userRepository->findOneBy(['username' => $username]);
        
        if (!$userToUnfollow) {
            return $this->json(['error' => 'User not found'], 404);
        }
        
        $user->removeFollowedUser($userToUnfollow);
        $entityManager->flush();

        return $this->json(['message' => 'User unfollowed successfully']);
    }

    #[Route('/api/users/avatar', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function uploadAvatar(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $uploadedFile = $request->files->get('avatar');

        if (!$uploadedFile instanceof UploadedFile) {
            return $this->json(['message' => 'No file uploaded or invalid file'], Response::HTTP_BAD_REQUEST);
        }

        $uploadsDirectory = $this->getParameter('kernel.project_dir') . '/public/uploads/avatars';
        $newFilename = uniqid() . '.' . $uploadedFile->guessExtension();

        try {
            $uploadedFile->move($uploadsDirectory, $newFilename);
            $user->setAvatar($newFilename);

            $entityManager->persist($user);
            $entityManager->flush();
        } catch (\Exception $e) {
            return $this->json(['message' => 'Failed to upload avatar', 'error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(['message' => 'Avatar uploaded successfully', 'avatar' => $newFilename]);
    }

    #[Route('/api/users/banner', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function uploadBanner(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $uploadedFile = $request->files->get('banner');

        if (!$uploadedFile instanceof UploadedFile) {
            return $this->json(['message' => 'No file uploaded or invalid file'], Response::HTTP_BAD_REQUEST);
        }

        $uploadsDirectory = $this->getParameter('kernel.project_dir') . '/public/uploads/banners';
        $newFilename = uniqid() . '.' . $uploadedFile->guessExtension();

        try {
            $uploadedFile->move($uploadsDirectory, $newFilename);
            $user->setBanner($newFilename);

            $entityManager->persist($user);
            $entityManager->flush();
        } catch (\Exception $e) {
            return $this->json(['message' => 'Failed to upload banner', 'error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(['message' => 'Banner uploaded successfully', 'banner' => $newFilename]);
    }
}
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
    public function showByUsername(UserRepository $userRepository, string $username): Response
    {
        $user = $userRepository->findOneBy(['username' => $username]);

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
}
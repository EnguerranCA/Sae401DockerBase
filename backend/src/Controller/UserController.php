<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

use App\Entity\User;
use App\Repository\UserRepository;


final class UserController extends AbstractController
{
    #[Route('/users/login', name: 'user_login')]
    public function login(Request $request, AuthenticationUtils $authenticationUtils): Response
    {
        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        if ($this->getUser()) {
            return $this->redirect('http://localhost:8090/home');
        }
        
        return new Response("Error: " . $error);
    }

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
            // Add other fields you want to expose
        ]);
    }
    
}
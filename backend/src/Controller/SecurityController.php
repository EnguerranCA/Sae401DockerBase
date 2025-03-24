<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\UserRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;


use App\Entity\User;



final class SecurityController extends AbstractController
{
    #[Route('/api/login', name: 'user_login', methods: ['POST'])]
    public function login(Request $request, UserPasswordHasherInterface $passwordEncoder, UserRepository $userRepository): Response
    {
        $data = json_decode($request->getContent(), true);
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';

        $user = $userRepository->findOneBy(['username' => $username]);

        if (!$user || !$passwordEncoder->isPasswordValid($user, $password)) {
            return $this->json(['message' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json(['token' => $user->getApiToken()]);
    }

    #[Route('/api/register', name: 'user_register', methods: ['POST'])]
    public function register(Request $request, UserPasswordHasherInterface $passwordEncoder, EntityManagerInterface $entityManager, MailerInterface $mailer): Response
    {
        $data = json_decode($request->getContent(), true);
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        $name = $data['name'] ?? '';
        $email = $data['email'] ?? '';
        $avatar = "./src/assets/profile-pictures/default_pp.webp";

        if (empty($username) || empty($password) || empty($name) || empty($email)) {
            return $this->json(['message' => 'Missing required fields'], Response::HTTP_BAD_REQUEST);
        }
        $user = new User();
        $user->setUsername($username);
        $user->setPassword($passwordEncoder->hashPassword($user, $password));
        $user->setName($name);
        $user->setEmail($email);
        $user->setAvatar($avatar);
        $user->setRoles(['ROLE_USER']);
        $user->setIsVerified(false);
        $user->setApiToken(bin2hex(random_bytes(60)));

        // Generate a 6-digit verification code
        $verificationCode = random_int(100000, 999999);
        $user->setVerificationCode($verificationCode);

        $entityManager->persist($user);
        $entityManager->flush();

        // Render the email content using Twig
        $emailContent = $this->renderView('mailer/index.html.twig', [
            'name' => $user->getName(),
            'verification_code' => $verificationCode,
        ]);

        // Send verification email
        $emailMessage = (new Email())
            ->from('no-reply@example.com')
            ->to($user->getEmail())
            ->subject('Email Verification')
            ->html($emailContent);

        try {
            $mailer->send($emailMessage);
        } catch (TransportExceptionInterface $e) {
            return $this->json(['message' => 'Failed to send email'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(['token' => $user->getApiToken()]);
    }

    #[Route('/api/verify', name: 'user_verify', methods: ['POST'])]
    public function verify(Request $request, UserRepository $userRepository, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);

        $username = $data['username'] ?? '';
        $verificationCode = $data['verification_code'] ?? '';

        $user = $userRepository->findOneBy(['username' => $username]);

        if (!$user || $user->getVerificationCode() !== $verificationCode) {
            return $this->json(['message' => 'Invalid verification code'], Response::HTTP_UNAUTHORIZED);
        }

        $user->setIsVerified(true);
        $user->setVerificationCode(null); // Clear the verification code after successful verification

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(['message' => 'User verified']);
    }

    #[Route('/security', name: 'app_security')]
    public function index(): Response
    {
        return $this->render('security/index.html.twig', [
            'controller_name' => 'SecurityController',
        ]);
    }

    
}

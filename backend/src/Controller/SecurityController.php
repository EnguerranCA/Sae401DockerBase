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
use Symfony\Component\HttpFoundation\File\UploadedFile;


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

        if (!$user->getIsVerified()) {
            return $this->json(['message' => 'Email not verified'], Response::HTTP_UNAUTHORIZED);
        }

        $response = ['token' => $user->getApiToken(), 'role' => 'user'];
        if (in_array('ROLE_ADMIN', $user->getRoles())) {
            $response['role'] = 'admin';
            if ($request->query->has('redirect')) {
                $response['redirect'] = $request->query->get('redirect');
            }
        }
        return $this->json($response);
    }

    #[Route('/register', name: 'user_register', methods: ['POST'])]
    public function register(Request $request, UserPasswordHasherInterface $passwordEncoder, EntityManagerInterface $entityManager, MailerInterface $mailer): Response
    {
        $username = $request->get('username', '');
        $password = $request->get('password', '');
        $name = $request->get('name', '');
        $email = $request->get('email', '');
        $uploadedFile = $request->files->get('avatar');

        if (empty($username)) {
            return $this->json(['message' => 'Username is required'], Response::HTTP_BAD_REQUEST);
        }

        if (empty($password)) {
            return $this->json(['message' => 'Password is required'], Response::HTTP_BAD_REQUEST);
        }

        if (empty($name)) {
            return $this->json(['message' => 'Name is required'], Response::HTTP_BAD_REQUEST);
        }

        if (empty($email)) {
            return $this->json(['message' => 'Email is required'], Response::HTTP_BAD_REQUEST);
        }

        $avatar = null;
        if ($uploadedFile instanceof UploadedFile) {
            $uploadsDirectory = $this->getParameter('kernel.project_dir') . '/public/uploads/avatars';
            $newFilename = uniqid() . '.' . $uploadedFile->guessExtension();

            try {
                $uploadedFile->move($uploadsDirectory, $newFilename);
                $avatar = $newFilename;
            } catch (\Exception $e) {
                return $this->json(['message' => 'Failed to upload avatar', 'error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
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

        // Fill the null fields
        $user->setBio('');
        $user->setLocation('');
        $user->setWebsite('');
        $user->setBanner('');

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
            return $this->json(['message' => 'Failed to send email', 'error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(['token' => $user->getApiToken()]);
    }

    #[Route('/verify', name: 'user_verify', methods: ['POST'])]
    public function verify(Request $request, UserRepository $userRepository, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordEncoder): Response
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

        // Log the user in by generating a new API token
        $user->setApiToken(bin2hex(random_bytes(60)));
        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(['token' => $user->getApiToken()]);
    }

    #[Route('/security', name: 'app_security')]
    public function index(): Response
    {
        return $this->render('security/index.html.twig', [
            'controller_name' => 'SecurityController',
        ]);
    }

    #[Route('/resend', name: 'resend', methods: ['POST'])]
    public function resendVerification(Request $request, UserRepository $userRepository, MailerInterface $mailer, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $username = $data['username'] ?? '';

        $user = $userRepository->findOneBy(['username' => $username]);

        if (!$user) {
            return $this->json(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        if ($user->getIsVerified()) {
            return $this->json(['message' => 'Email already verified'], Response::HTTP_BAD_REQUEST);
        }

        // Generate a new 6-digit verification code
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

        return $this->json(['message' => 'Verification email resent']);
    }
}

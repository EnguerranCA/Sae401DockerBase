<?php

namespace App\Controller\Admin;

use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class SecurityController extends AbstractDashboardController
{
    #[Route('/admin/login', name: 'admin_login')]
    public function login(Request $request): Response
    {
        // Si l'utilisateur est déjà connecté en tant qu'admin, redirigez-le vers le dashboard
        if ($this->isGranted('ROLE_ADMIN')) {
            return $this->redirectToRoute('admin');
        }

        // Récupérer l'URL de redirection après la connexion
        $redirect = $request->query->get('redirect', '/admin');
        
        // Rediriger vers le login du frontend avec le paramètre de redirection
        return $this->redirectToRoute('user_login', ['redirect' => $redirect]);
    }

    #[Route('/admin/logout', name: 'admin_logout')]
    public function logout(): void
    {
        // La déconnexion est gérée par le firewall
    }
} 
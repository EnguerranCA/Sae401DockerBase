<?php
namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class CreatePostPayload
{
    
    /**
     * @Assert\NotBlank
     * @Assert\Length(
     *      min = 1,
     *      max = 280,
     *      minMessage = "The content must be at least {{ limit }} characters long",
     *      maxMessage = "The content cannot be longer than {{ limit }} characters"
     * )
     */
    private string $content;
    private string $username;


    public function __construct(string $content, string $username) 
    {
        $this->content = $content;
        $this->username = $username;
    }

    public function getContent(): string
    {
        return $this->content;
    }

    public function setContent(string $content): void
    {
        $this->content = $content;
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    public function setUsername(string $username): void
    {
        $this->username = $username;
    }
}
<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Ignore as JsonIgnore;


#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[UniqueEntity(fields: ['username'], message: 'There is already an account with this username')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 128)]
    private ?string $avatar = null;

    #[ORM\Column(length: 50)]
    private ?string $username = null;

    #[ORM\Column(length: 50)]
    private ?string $name = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $updatedAt = null;

    /**
     * @var Collection<int, Post>
     */
    #[ORM\OneToMany(targetEntity: Post::class, mappedBy: 'user')]
    private Collection $posts;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $apiToken = null;

    #[ORM\Column(length: 6, nullable: true)]
    private ?string $verification_code = null;

    #[ORM\Column]
    private bool $isVerified = false;

    /**
     * @var Collection<int, Post>
     */
    #[ORM\ManyToMany(targetEntity: Post::class, mappedBy: 'likes')]
    private Collection $liked;

    /**
     * @var Collection<int, self>
     */
    #[ORM\ManyToMany(targetEntity: self::class, inversedBy: 'blockers')]
    #[ORM\JoinTable(name: 'user_blocked')]
    private Collection $blockedUsers;

    /**
     * @var Collection<int, self>
     */
    #[ORM\ManyToMany(targetEntity: self::class, mappedBy: 'blockedUsers')]
    private Collection $blockers;

    /**
     * @var Collection<int, self>
     */
    #[ORM\ManyToMany(targetEntity: self::class, inversedBy: 'followers')]
    #[ORM\JoinTable(name: 'user_followed')]
    private Collection $followedUsers;

    /**
     * @var Collection<int, self>
     */
    #[ORM\ManyToMany(targetEntity: self::class, mappedBy: 'followedUsers')]
    private Collection $followers;

    #[ORM\Column(length: 255)]
    private ?string $website = null;

    #[ORM\Column(length: 255)]
    private ?string $location = null;

    #[ORM\Column(length: 255)]
    private ?string $banner = null;

    #[ORM\Column(length: 500)]
    private ?string $bio = null;

    #[ORM\Column(nullable: true)]
    private ?bool $isBlocked = null;

    public function __construct()
    {
        $this->posts = new ArrayCollection();
        $this->liked = new ArrayCollection();
        $this->blockedUsers = new ArrayCollection();
        $this->blockers = new ArrayCollection();
        $this->followedUsers = new ArrayCollection();
        $this->followers = new ArrayCollection();
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getAvatar(): ?string
    {
        return $this->avatar;
    }

    public function setAvatar(string $avatar): static
    {
        $this->avatar = $avatar;

        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection<int, Post>
     */
    public function getPosts(): Collection
    {
        return $this->posts;
    }

    public function addPost(Post $post): static
    {
        if (!$this->posts->contains($post)) {
            $this->posts->add($post);
            $post->setUser($this);
        }

        return $this;
    }

    public function removePost(Post $post): static
    {
        if ($this->posts->removeElement($post)) {
            // set the owning side to null (unless already changed)
            if ($post->getUser() === $this) {
                $post->setUser(null);
            }
        }

        return $this;
    }

    public function getApiToken(): ?string
    {
        return $this->apiToken;
    }

    public function setApiToken(?string $apiToken): static
    {
        $this->apiToken = $apiToken;

        return $this;
    }

    public function getVerificationCode(): ?string
    {
        return $this->verification_code;
    }

    public function setVerificationCode(?string $verification_code): static
    {
        $this->verification_code = $verification_code;

        return $this;
    }
    
    public function getIsVerified(): bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): static
    {
        $this->isVerified = $isVerified;

        return $this;
    }

    /**
     * @return Collection<int, Post>
     */
    public function getLiked(): Collection
    {
        return $this->liked;
    }

    public function addLiked(Post $liked): static
    {
        if (!$this->liked->contains($liked)) {
            $this->liked->add($liked);
            $liked->addLike($this);
        }

        return $this;
    }

    public function removeLiked(Post $liked): static
    {
        if ($this->liked->removeElement($liked)) {
            $liked->removeLike($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, self>
     */
    public function getBlockedUsers(): Collection
    {
        return $this->blockedUsers;
    }

    public function addBlockedUser(self $blockedUser): static
    {
        if (!$this->blockedUsers->contains($blockedUser)) {
            $this->blockedUsers->add($blockedUser);
        }

        return $this;
    }

    public function removeBlockedUser(self $blockedUser): static
    {
        $this->blockedUsers->removeElement($blockedUser);

        return $this;
    }

    /**
     * @return Collection<int, self>
     */
    public function getBlockers(): Collection
    {
        return $this->blockers;
    }

    public function addBlocker(self $blocker): static
    {
        if (!$this->blockers->contains($blocker)) {
            $this->blockers->add($blocker);
            $blocker->addBlockedUser($this);
        }

        return $this;
    }

    public function removeBlocker(self $blocker): static
    {
        if ($this->blockers->removeElement($blocker)) {
            $blocker->removeBlockedUser($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, self>
     */
    public function getFollowedUsers(): Collection
    {
        return $this->followedUsers;
    }

    public function addFollowedUser(self $followedUser): static
    {
        if (!$this->followedUsers->contains($followedUser)) {
            $this->followedUsers->add($followedUser);
        }

        return $this;
    }

    public function removeFollowedUser(self $followedUser): static
    {
        $this->followedUsers->removeElement($followedUser);

        return $this;
    }

    /**
     * @return Collection<int, self>
     */
    public function getFollowers(): Collection
    {
        return $this->followers;
    }

    public function addFollower(self $follower): static
    {
        if (!$this->followers->contains($follower)) {
            $this->followers->add($follower);
            $follower->addFollowedUser($this);
        }

        return $this;
    }

    public function removeFollower(self $follower): static
    {
        if ($this->followers->removeElement($follower)) {
            $follower->removeFollowedUser($this);
        }

        return $this;
    }

    public function getWebsite(): ?string
    {
        return $this->website;
    }

    public function setWebsite(string $website): static
    {
        $this->website = $website;

        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(string $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function getBanner(): ?string
    {
        return $this->banner;
    }

    public function setBanner(string $banner): static
    {
        $this->banner = $banner;

        return $this;
    }

    public function getBio(): ?string
    {
        return $this->bio;
    }

    public function setBio(string $bio): static
    {
        $this->bio = $bio;

        return $this;
    }

    public function isBlocked(): ?bool
    {
        return $this->isBlocked;
    }

    public function setIsBlocked(?bool $isBlocked): static
    {
        $this->isBlocked = $isBlocked;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): static
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): static
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }
}

using Microsoft.AspNetCore.Identity;

namespace SocialMedia.Server.Models
{
    public class User : IdentityUser
    {

        public byte[]? ProfilePicture { get; set; }
        public byte[]? BannerPicture { get; set;}
        public string? AboutMe { get; set; }

    }
}

namespace SocialMedia.Server.Models
{
    public class PostRequest
    {
        public string? Content { get; set; }
        public IFormFile? Image { get; set; }
    }
}

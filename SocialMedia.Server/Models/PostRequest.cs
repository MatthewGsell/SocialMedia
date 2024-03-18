namespace SocialMedia.Server.Models
{
    public class PostRequest
    {
        public string? Content { get; set; }
        public string? OriginalAuthor { get; set; }
        public int? OriginalId { get; set; }
        public IFormFile? Image { get; set; }

    }
}

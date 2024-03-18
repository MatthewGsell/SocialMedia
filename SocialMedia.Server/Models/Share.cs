namespace SocialMedia.Server.Models
{
    public class Share
    {
        public int Id { get; set; }

        public int? PostId { get; set; }

        public string? User { get; set; }
    }
}

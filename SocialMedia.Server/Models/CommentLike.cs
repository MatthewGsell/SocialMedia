namespace SocialMedia.Server.Models
{
    public class CommentLike
    {
        public int Id { get; set; }

        public int? CommentId { get; set; }

        public string? User { get; set; }
    }
}

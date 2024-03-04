namespace SocialMedia.Server.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public int PostId { get; set; }
        public string? Content { get; set; }
        public string? Author { get; set; }
        public int Likes { get; set; }
    }
}

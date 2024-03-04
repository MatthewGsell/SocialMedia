namespace SocialMedia.Server.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string? Content { get; set; }
        public string? Author { get; set; }
        public int? Likes { get; set; }
        public int? Comments { get; set; }
        public  int? Shares { get; set; }
        public byte[]? Image { get; set; }
    }
}

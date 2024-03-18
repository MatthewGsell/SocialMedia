namespace SocialMedia.Server.Models
{
    public class Like
    {
        public int Id { get; set; }

        public int? PostId { get; set; }

        public string? User {  get; set; }
    }
}

namespace SocialMedia.Server.Models
{
    public class Message
    {
        public int Id { get; set; } 
        public string? SentFrom { get; set; }    
        public string? SentTo { get; set; }
        public string? Content { get; set; }
    }
}

namespace SocialMedia.Server.Models
{
    public class Notification
    {
        public int Id { get; set; } 
        public string? Notify { get; set; }
        public string? From { get; set; }
        public string? Message { get; set; }
        public string? Link { get; set; }
    }
}

using Microsoft.EntityFrameworkCore;

namespace SocialMedia.Server.Models
{
    public class MainContext : DbContext
    {
        public MainContext(DbContextOptions<MainContext> options) : base(options) { }

        public DbSet<Follow> Follows {  get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Comment> Comments { get; set; }



    }


}

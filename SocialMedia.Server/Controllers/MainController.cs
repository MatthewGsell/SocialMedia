using Azure;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using SocialMedia.Server.Models;
using System.Text.Json.Nodes;

namespace SocialMedia.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MainController : Controller
    {
        [HttpGet("/posts")]
        public async Task<IResult> GetPosts(UserManager<User> userManager, MainContext maindb)
        {
            List<Follow> followlist = new List<Follow>();
            List<Post> postlist = new List<Post>();
            User? user = await userManager.GetUserAsync(HttpContext.User);

            followlist = await maindb.Follows.Where(f => f.User == user.UserName).ToListAsync();
            foreach (Follow f in followlist) { 
            Post singlepost = await maindb.Posts.Where(p => p.Author == f.Follows).SingleAsync();
                postlist.Add(singlepost);
            }
            List<Post> userposts = new List<Post>();
            userposts = await maindb.Posts.Where(p => p.Author == user.UserName).ToListAsync();
            foreach(Post post in userposts)
            {
                postlist.Add(post);
            }


            return Results.Json(new { PostList = postlist });

        }
        [HttpPost("/posts")]
        public async Task<IResult> CreatePost([FromBody] PostRequest newppostrequest, MainContext maindb, UserManager<User> userManager)
        {
            Post newpost = new Post();
            User? user = await userManager.GetUserAsync(HttpContext.User);

            if (user != null) {
                newpost.Author = user.UserName;
                newpost.Content = newppostrequest.Content;
                newpost.Image = newppostrequest.Image;
                newpost.Likes = 0;
                newpost.Comments = 0;
                newpost.Shares = 0;

                maindb.Posts.Add(newpost);

                await maindb.SaveChangesAsync();
                return Results.Ok();
            } else
            {
                return Results.Problem();
            }

           
        }

        [HttpGet("/comments")]
        public async Task<IResult> GetComments(MainContext maindb)
        {
            String postid = HttpContext.Request.Query["post"].ToString();
            int intpostid = int.Parse(postid);

            List<Comment> commentslist = new List<Comment>();

            commentslist = await maindb.Comments.Where(c => c.PostId == intpostid).ToListAsync();

            return Results.Json(new { Commentslist = commentslist });
        }


    }
}

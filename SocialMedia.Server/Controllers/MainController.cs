using Azure;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Microsoft.OpenApi.Validations;
using SocialMedia.Server.Models;
using System.IO;
using System.Text.Json;
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
            List<Posttofront> postlist = new List<Posttofront>();
            User? user = await userManager.GetUserAsync(HttpContext.User);
            if (user != null)
            {
                followlist = await maindb.Follows.Where(f => f.User == user.UserName).ToListAsync();
                foreach (Follow f in followlist)
                {
                    Post singlepost = await maindb.Posts.Where(p => p.Author == f.Follows).SingleAsync();
                    if (singlepost.Image != null)
                    {
                        
                        String imagefile = Convert.ToBase64String(singlepost.Image);
                        Posttofront posttofront = new Posttofront();
                        posttofront.Id = singlepost.Id;
                        posttofront.Author = singlepost.Author;
                        posttofront.Content = singlepost.Content;
                        posttofront.Likes = singlepost.Likes;
                        posttofront.Comments = singlepost.Comments;
                        posttofront.Shares = singlepost.Shares;
                        posttofront.Image = imagefile;
                        postlist.Add(posttofront);

                    } else
                    {
                        Posttofront posttofront = new Posttofront();
                        posttofront.Id = singlepost.Id;
                        posttofront.Author = singlepost.Author;
                        posttofront.Content = singlepost.Content;
                        posttofront.Likes = singlepost.Likes;
                        posttofront.Comments = singlepost.Comments;
                        posttofront.Shares = singlepost.Shares;
                        postlist.Add(posttofront);
                     

                    }

                   
                }
                List<Post> userposts = new List<Post>();
                userposts = await maindb.Posts.Where(p => p.Author == user.UserName).ToListAsync();
                foreach (Post post in userposts)
                {   
                    if (post.Image != null )
                    {
                        String imagefile = Convert.ToBase64String(post.Image);
                        Posttofront posttofront = new Posttofront();
                        posttofront.Id = post.Id;
                        posttofront.Author = post.Author;
                        posttofront.Content = post.Content;
                        posttofront.Likes = post.Likes;
                        posttofront.Comments = post.Comments;
                        posttofront.Shares = post.Shares;
                        posttofront.Image  = imagefile;
                        postlist.Add(posttofront);
                    } else
                    {

                        Posttofront posttofront = new Posttofront();
                        posttofront.Id = post.Id;
                        posttofront.Author = post.Author;
                        posttofront.Content = post.Content;
                        posttofront.Likes = post.Likes;
                        posttofront.Comments = post.Comments;
                        posttofront.Shares = post.Shares;
                        postlist.Add(posttofront);
                    }


                }


                return Results.Json(new { PostList = postlist });
            } else { return Results.Problem(); }
     

        }
        [HttpPost("/posts")]
        public async Task<IResult> CreatePost([FromForm] PostRequest newppostrequest, MainContext maindb, UserManager<User> userManager)
        {
            Post newpost = new Post();
            User? user = await userManager.GetUserAsync(HttpContext.User);

            if (user != null && newppostrequest.Image != null) {



                var memorystream = new MemoryStream();
                newppostrequest.Image.CopyTo(memorystream);
                

                
                newpost.Author = user.UserName;
                newpost.Content = newppostrequest.Content;
                newpost.Image = memorystream.ToArray();
                newpost.Likes = 0;
                newpost.Comments = 0;
                newpost.Shares = 0;

                maindb.Posts.Add(newpost);

                await maindb.SaveChangesAsync();
                return Results.Ok();
            } else if (user != null)
            {
                newpost.Author = user.UserName;
                newpost.Content = newppostrequest.Content;
                newpost.Likes = 0;
                newpost.Comments = 0;
                newpost.Shares = 0;

                maindb.Posts.Add(newpost);

                await maindb.SaveChangesAsync();
                return Results.Ok();
            } 
            else
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


        [HttpPost("/comments")]
        public async Task<IResult> PostComment(MainContext maindb, [FromBody] Comment comment, UserManager<User> userManager)
        {
            User? user = await userManager.GetUserAsync(HttpContext.User);
            if (user != null) {
                comment.Author = user.UserName;
                comment.Likes = 0;
                maindb.Comments.Add(comment);
                await maindb.SaveChangesAsync();
                return Results.Ok();
            } else
            {
                return Results.Problem();
            }
            
        }

    }
}

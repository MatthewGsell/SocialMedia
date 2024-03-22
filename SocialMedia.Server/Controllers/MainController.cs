using Azure;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Client;
using Microsoft.OpenApi.Validations;
using SocialMedia.Server.Models;
using System.ComponentModel.Design;
using System.IO;
using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace SocialMedia.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MainController : Controller
    {








        [HttpDelete("/singlemessages")]
        public async Task<IResult> DeleteMessage(MainContext maindb)
        {
            string messageid = HttpContext.Request.Query["id"].ToString();
            int intmessageid = int.Parse(messageid);

            
            Message messagetodelete = await maindb.Messages.Where(m => m.Id == intmessageid).FirstAsync();

            maindb.Messages.Remove(messagetodelete);
            await maindb.SaveChangesAsync();

            return Results.Ok();

        }


        [HttpPost("/singlemessages")]
        public async Task<IResult> PostSingleMessage(MainContext maindb,  [FromBody] Message newmessage)
        {
            maindb.Messages.Add(newmessage);
            await maindb.SaveChangesAsync();
            return Results.Ok();

         

        }


        

        [HttpGet("/singlemessages")]
        public async Task<IResult> GetSingleMessages(MainContext maindb, UserManager<User> userManager)
        {
            User? user = await userManager.GetUserAsync(HttpContext.User);
            string otherusername = HttpContext.Request.Query["otheruser"].ToString();

            if (user != null)
            {
                List<Message> messages = await maindb.Messages.Where(m => m.SentFrom == user.UserName && m.SentTo == otherusername || m.SentTo == user.UserName && m.SentFrom == otherusername).ToListAsync();


                messages.ForEach((message) =>
                {
                    if(message.SentTo == user.UserName)
                    {
                        message.Read = true;
                    }
                    
                });
                await maindb.SaveChangesAsync();

                return Results.Json(new {Messages = messages});
            } else
            {
                return Results.Problem();
            }
        }



        [HttpGet("/messages")] 
        public async Task<IResult> GetMessages(MainContext maindb, UserManager<User> userManager)
        {
            User? user = await userManager.GetUserAsync(HttpContext.User);

            if (user != null )
            {
                List<Message> messages = await maindb.Messages.Where(m => m.SentFrom == user.UserName || m.SentTo == user.UserName).ToListAsync();

                List<string> usernames = new List<string>();
                List<string> unreadusernames = new List<string>();



                for (int i = 0; i < messages.Count; i ++)
                {
                    if (messages[i].SentFrom == user.UserName || messages[i].Read == true )
                    {
                        usernames.Add(messages[i].SentFrom);
                    } else if (messages[i].Read == true)
                    {
                        usernames.Add(messages[i].SentTo);
                    } else if (messages[i].SentFrom != user.UserName && messages[i].Read == false)
                    {
                        unreadusernames.Add(messages[i].SentFrom);  
                    } else 
                    {
                        unreadusernames.Add(messages[i].SentTo);
                    }
                }

                usernames = usernames.Distinct().ToList();
                unreadusernames = unreadusernames.Distinct().ToList();  

                return Results.Json(new { Messages = usernames, unreadMessages = unreadusernames});

            } else
            {
                return Results.Problem();
            }
        }


        [HttpGet("/notificationcount")]
        public async Task<IResult> GetNotificationCount(MainContext maindb, UserManager<User> userManager)
        {
            User? user = await userManager.GetUserAsync(HttpContext.User);
            if (user != null)
            {

                List<Notification> notifications = await maindb.Notifications.Where(n => n.Notify == user.UserName).ToListAsync();
            
                return Results.Json(new { count = notifications.Count });

            }
            else
            {
                return Results.Problem();
            }
        }



        [HttpGet("/notifications")]
        public async Task<IResult> GetNotifications(MainContext maindb, UserManager<User> userManager)
        {
            User? user = await userManager.GetUserAsync(HttpContext.User);

            if(user != null)
            {
                
                    List<Notification> notifications = await maindb.Notifications.Where(n => n.Notify == user.UserName).ToListAsync();
             

                  
                    return Results.Json(new { Notifications = notifications });
              
            } else
            {
                return Results.Problem();
            }
           
        }

        [HttpDelete("/notifications")]
        public async Task<IResult> DeleteNotifications(MainContext maindb, UserManager<User> userManager)
        {
            User? user = await userManager.GetUserAsync(HttpContext.User);

            if (user != null)
            {

                List<Notification> notifications = await maindb.Notifications.Where(n => n.Notify == user.UserName).ToListAsync();
                notifications.ForEach((notification) =>
                {
                    maindb.Notifications.Remove(notification);
                });

                await maindb.SaveChangesAsync();
                return Results.Ok();

            }
            else
            {
                return Results.Problem();
            }

        }





        [HttpGet("/likecomment")]
        public async Task<IResult> IsCommentLiked(MainContext maindb, UserManager<User> userManager)
        {
            string commentid = HttpContext.Request.Query["commentid"].ToString();
            User? user = await userManager.GetUserAsync(HttpContext.User);

            if (user != null)
            {
                Boolean doeslikeexist = await maindb.CommentsLikes.AnyAsync(l => l.CommentId == Int32.Parse(commentid) && l.User == user.UserName);

                if (doeslikeexist)
                {
                    return Results.Json(new { Isliked = "liked" });
                }
                else
                {
                    return Results.Json(new { isLiked = "" });
                }
            }
            else
            {
                return Results.Problem();
            }

        }



        [HttpPost("/likecomment")]
        public async Task<IResult> LikeOrDislikeComment(MainContext maindb, UserManager<User> userManager)
        {
            string commentid = HttpContext.Request.Query["commentid"].ToString();
            User? user = await userManager.GetUserAsync(HttpContext.User);
            if (user != null)
            {
                Boolean doeslikeexist = await maindb.CommentsLikes.AnyAsync(l => l.CommentId == Int32.Parse(commentid) && l.User == user.UserName);
                if (doeslikeexist)
                {
                    CommentLike like = await maindb.CommentsLikes.Where(l => l.CommentId == Int32.Parse(commentid) && l.User == user.UserName).FirstAsync();
                    maindb.CommentsLikes.Remove(like);
                    Comment comment = await maindb.Comments.Where(c => c.Id == Int32.Parse(commentid)).FirstAsync();
                    comment.Likes = comment.Likes - 1;
                    await maindb.SaveChangesAsync();
                    return Results.Ok();
                }
                else
                {
                
                    CommentLike like = new CommentLike();
                    like.User = user.UserName;
                    like.CommentId = Int32.Parse(commentid);
                    Comment comment = await maindb.Comments.Where(c => c.Id == Int32.Parse(commentid)).FirstAsync();
                    comment.Likes = comment.Likes + 1;
                    maindb.CommentsLikes.Add(like);


                    Notification notification = new Notification();
                    notification.From = user.UserName;
                    notification.Notify = comment.Author;
                    notification.Message = $"{user.UserName} liked your comment";
                    notification.Link = $"/post/{comment.PostId}";
                    maindb.Notifications.Add(notification);

                    await maindb.SaveChangesAsync();
                    return Results.Ok();
                }



            }
            else
            {
                return Results.Problem();
            }









        }





        [HttpGet("/like")]
        public async Task<IResult> IsPostLiked(MainContext maindb, UserManager<User> userManager)
        {
            string postid = HttpContext.Request.Query["postid"].ToString();
            User? user = await userManager.GetUserAsync(HttpContext.User);

            if (user != null)
            {
                Boolean doeslikeexist = await maindb.Likes.AnyAsync(l => l.PostId == Int32.Parse(postid) && l.User == user.UserName);

                if(doeslikeexist)
                {
                    return Results.Json(new { Isliked = "liked" });
                } else
                {
                   return Results.Json(new { isLiked = "" });
                }
            } else
            {
                return Results.Problem();
            }

        }
        
        


        [HttpPost("/like")]
        public async Task<IResult> LikeOrDislikePost(MainContext maindb, UserManager<User> userManager)
        {
            string postid = HttpContext.Request.Query["postid"].ToString();
            User? user = await userManager.GetUserAsync(HttpContext.User);
            if(user != null) {
                Boolean doeslikeexist = await maindb.Likes.AnyAsync(l => l.PostId == Int32.Parse(postid) && l.User == user.UserName);
                if (doeslikeexist)
                {
                    Like like = await maindb.Likes.Where(l => l.PostId == Int32.Parse(postid) && l.User == user.UserName).FirstAsync();
                    maindb.Likes.Remove(like);
                    Post post = await maindb.Posts.Where(p => p.Id == Int32.Parse(postid)).FirstAsync();
                    post.Likes = post.Likes - 1;
                    await maindb.SaveChangesAsync();
                    return Results.Ok();
                }else
                {
                    Like like = new Like();
                    like.User = user.UserName;
                    like.PostId = Int32.Parse(postid);
                    Post post = await maindb.Posts.Where(p => p.Id == Int32.Parse(postid)).FirstAsync();
                    post.Likes = post.Likes + 1;
                    maindb.Likes.Add(like);

                    Notification notification = new Notification();
                    notification.From = user.UserName;
                    notification.Notify = post.Author;
                    notification.Message = $"{user.UserName} liked your post";
                    notification.Link = $"/post/{post.Id}";
                    maindb.Notifications.Add(notification);



                    await maindb.SaveChangesAsync();
                    return Results.Ok();
                }



            } else
            {
                return Results.Problem();
            }









        }




        [HttpGet("/followers")]
        public async Task<IResult> GetFollowers(MainContext maindb)
        {
            string username = HttpContext.Request.Query["username"].ToString();

            List<Follow> followers = await maindb.Follows.Where(f => f.Follows == username ).ToListAsync();

            return Results.Json(new { Followers = followers});

        }
        [HttpGet("/followings")]
        public async Task<IResult> GetFollowing(MainContext maindb)
        {
            string username = HttpContext.Request.Query["username"].ToString();

            List<Follow> following = await maindb.Follows.Where(f => f.User == username).ToListAsync();

            return Results.Json(new { Following = following });

        }





        [HttpGet("/followercounts")]
        public async Task<IResult> GetFollowerCounts(UserManager<User> userManager, MainContext maindb)
        {


            String username = HttpContext.Request.Query["username"].ToString();
            List<Follow> followers = new List<Follow>();    
            List<Follow> following = new List<Follow>();    

                followers = await maindb.Follows.Where(f => f.Follows == username).ToListAsync();
                following = await maindb.Follows.Where(f => f.User == username).ToListAsync();

                return Results.Json(new { Followers = followers.Count, Following = following.Count });
          
        }




        [HttpPost("/follow")]
        public async Task<IResult> Follow(UserManager<User> userManager, MainContext maindb)
        {
            User? user = await userManager.GetUserAsync(HttpContext.User);
            String otherusername = HttpContext.Request.Query["username"].ToString();
            if (user != null) {
                Follow newfollow = new Follow();
                newfollow.User = user.UserName;
                newfollow.Follows = otherusername;
                maindb.Follows.Add(newfollow);

                Notification notification = new Notification();
                notification.From = user.UserName;
                notification.Notify = otherusername;
                notification.Message = $"{user.UserName} followed you";
                notification.Link = $"/userpage/{user.UserName}";
                maindb.Notifications.Add(notification);



                await maindb.SaveChangesAsync();
                return Results.Ok();
            } else
            {
                return Results.Problem();
            }

          


        }

        [HttpDelete("/follow")]
        public async Task<IResult> DeleteFollow(UserManager<User> userManager, MainContext maindb)
        {
            User? user = await userManager.GetUserAsync(HttpContext.User);
            String otherusername = HttpContext.Request.Query["username"].ToString();
            if (user != null)
            {
                Follow followtodelete = new Follow();
                followtodelete = await maindb.Follows.Where(f => f.User == user.UserName && f.Follows == otherusername).FirstAsync();
                maindb.Follows.Remove(followtodelete);
                await maindb.SaveChangesAsync();

                return Results.Ok();
            }
            else
            {
                return Results.Problem();
            }




        }




        [HttpGet("/following")]
        public async Task<IResult> IsFollowing(UserManager<User> userManager, MainContext maindb)
        {
            User? user = await userManager.GetUserAsync(HttpContext.User);
            String otherusername = HttpContext.Request.Query["username"].ToString();

           Boolean isfollowing = false;

            if (user != null) {
                isfollowing = await maindb.Follows.AnyAsync(f => f.User == user.UserName && f.Follows == otherusername);
                if(isfollowing == false)
                {
                    return Results.Json(new { following = false });
                } else
                {
                    return Results.Json(new {following = true});
                }
                
            } else
            {
                return Results.Problem();
            }

            
         


        }

        [HttpGet("/users")]
        public async Task<IResult> GetUsers(UserManager<User> userManager)
        {
            List<User> userlist = new List<User>();

            userlist = await userManager.Users.ToListAsync();

            return Results.Json(new {Userlist = userlist});
        }

        [HttpGet("/singleuser")]
        public async Task<IResult> GetSingleUser(UserManager<User> userManager)
        {
            User user = new User();
            String username = HttpContext.Request.Query["username"].ToString();

            user = await userManager.Users.Where(u => u.UserName == username).FirstAsync();

            return Results.Json(new { User = user });
        }
        [HttpGet("/singleuserposts")]
        public async Task<IResult> GetSingleUserPosts(UserManager<User> userManager, MainContext maindb)
        {
            String username = HttpContext.Request.Query["username"].ToString();

            List<Post> postlist = new List<Post>();
           
          
            postlist = await maindb.Posts.Where(p => p.Author ==  username).Take(100).ToListAsync();


            return Results.Json(new { PostList = postlist });
            
       


        }





        [HttpGet("/posts")]
        public async Task<IResult> GetPosts(UserManager<User> userManager, MainContext maindb)
        {
            
            List<Follow> followlist = new List<Follow>();
            List<Post> postlist = new List<Post>();
            List<Post> orderedpostlist = new List<Post>();
            User? user = await userManager.GetUserAsync(HttpContext.User);
            if (user != null)
            {
                followlist = await maindb.Follows.Where(f => f.User == user.UserName).ToListAsync();
                foreach (Follow follow in followlist)
                {
                    List<Post> followpostlist = new List<Post>();


                    followpostlist = await maindb.Posts.Where(p => p.Author == follow.Follows).ToListAsync();
                   foreach(Post post in followpostlist)
                    {
                        postlist.Add(post);
                    }
                  
                }
                List<Post> userposts = new List<Post>();
                userposts = await maindb.Posts.Where(p => p.Author == user.UserName).ToListAsync();
                foreach (Post post in userposts)
                {   
                 postlist.Add(post);


                }

                orderedpostlist = postlist.OrderBy(p => p.Id).Take(100).ToList();

                return Results.Json(new { PostList = orderedpostlist });
            } else { return Results.Problem(); }
     

        }

        [HttpGet("/singlepost")]
        public async Task<IResult> GetSinglePost(MainContext maindb, UserManager<User> userManager)
        {
            User? user = await userManager.GetUserAsync(HttpContext.User);

            if (user != null)
            {
                String postid = HttpContext.Request.Query["postid"].ToString();

                Post post = await  maindb.Posts.Where(p => p.Id == int.Parse(postid)).FirstAsync();


                return Results.Json(new { Post = post});
            }
            else { return Results.Problem(); }


        }




        [HttpPost("/posts")]
        public async Task<IResult> CreatePost([FromForm] PostRequest newpostrequest, MainContext maindb, UserManager<User> userManager)
        {
            Post newpost = new Post();
            User? user = await userManager.GetUserAsync(HttpContext.User);

            if (user != null && newpostrequest.OriginalAuthor != null)
            {
                Post originalpost = await maindb.Posts.Where(p => p.Id == newpostrequest.OriginalId).FirstAsync();
                if(originalpost.Image != null)
                {
                    

                    originalpost.Shares = originalpost.Shares + 1;

                    newpost.Author = user.UserName;
                    newpost.OriginalAuthor = newpostrequest.OriginalAuthor;
                    newpost.OriginalId = newpostrequest.OriginalId;
                    newpost.Content = originalpost.Content;
                    newpost.Image = originalpost.Image;
                    newpost.Likes = 0;
                    newpost.Comments = 0;
                    newpost.Shares = 0;

                    maindb.Posts.Add(newpost);

                    Notification notification = new Notification();
                    notification.From = user.UserName;
                    notification.Notify = newpostrequest.OriginalAuthor;
                    notification.Message = $"{user.UserName} shared your post";
                    notification.Link = $"/userpage/{user.UserName}";
                    maindb.Notifications.Add(notification);



                    await maindb.SaveChangesAsync();
                    return Results.Ok();
                } else
                {
                    originalpost.Shares = originalpost.Shares + 1;

                    newpost.Author = user.UserName;
                    newpost.OriginalAuthor = newpostrequest.OriginalAuthor;
                    newpost.OriginalId = newpostrequest.OriginalId;
                    newpost.Content = originalpost.Content;
                    newpost.Likes = 0;
                    newpost.Comments = 0;
                    newpost.Shares = 0;

                    maindb.Posts.Add(newpost);

                    Notification notification = new Notification();
                    notification.From = user.UserName;
                    notification.Notify = newpostrequest.OriginalAuthor;
                    notification.Message = $"{user.UserName} shared your post";
                    notification.Link = $"/userpage/{user.UserName}";
                    maindb.Notifications.Add(notification);

                    await maindb.SaveChangesAsync();
                    return Results.Ok();

                }


               
            }
            else if (user != null && newpostrequest.Image != null) {



                var memorystream = new MemoryStream();
                newpostrequest.Image.CopyTo(memorystream);
                

                
                newpost.Author = user.UserName;
                newpost.Content = newpostrequest.Content;
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
                newpost.Content = newpostrequest.Content;
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
        [HttpDelete("/posts")]
        public async Task<IResult> DeletePost(MainContext maindb, [FromBody] DeleteRequest deleteRequest)
        {
            if (deleteRequest.Id == null) { return Results.Problem(); }  
            else {
                Post posttodelete = await maindb.Posts.Where(p => p.Id == Int32.Parse(deleteRequest.Id)).SingleAsync();
                maindb.Posts.Remove(posttodelete);
                await maindb.SaveChangesAsync();
                return Results.Ok();
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
                Post post = await maindb.Posts.Where(p => p.Id == comment.PostId).FirstAsync();
                post.Comments = post.Comments + 1;
                maindb.Comments.Add(comment);

                Notification notification = new Notification();
                notification.From = user.UserName;
                notification.Notify = post.Author;
                notification.Message = $"{user.UserName} commented on your post";
                notification.Link = $"/post/{post.Id}";
                maindb.Notifications.Add(notification);


                await maindb.SaveChangesAsync();
                return Results.Ok();
            } else
            {
                return Results.Problem();
            }
            
        }
        [HttpDelete("/comments")] 
        public async Task<IResult> DeleteComment(MainContext maindb, [FromBody] DeleteRequest deleteRequest)
        {
            if(deleteRequest.Id == null)
            {
                return Results.Problem();
            }else
            {
                Comment commenttodelete = await maindb.Comments.Where(c => c.Id == Int32.Parse(deleteRequest.Id)).SingleAsync();
                Post post = await maindb.Posts.Where(p => p.Id == commenttodelete.PostId).FirstAsync();
                post.Comments = post.Comments - 1;
                maindb.Comments.Remove(commenttodelete);
                await maindb.SaveChangesAsync();
                return Results.Ok();

            }
           
        }
        [HttpPut("/aboutme")]
        public async Task<IResult> UpdateAboutMe(MainContext maindb, [FromForm] PostRequest aboutmerequest, UserManager<User> userManager)
        {
            User? user = await userManager.GetUserAsync(HttpContext.User);
            if (user != null)
            {
                user.AboutMe = aboutmerequest.Content;
                await userManager.UpdateAsync(user);
               return Results.Ok();
            } else
            {
                return Results.Problem();  
            }
        }
        [HttpPut("/profilepicture")]
        public async Task<IResult> UpdateProfilePicture(MainContext maindb, [FromForm] PostRequest imagerequest, UserManager<User> userManager)
        {
            User? user = await userManager.GetUserAsync(HttpContext.User);
            if (user != null && imagerequest.Image != null)
            {
                var memorystream = new MemoryStream();
                imagerequest.Image.CopyTo(memorystream);
                user.ProfilePicture = memorystream.ToArray();
                await userManager.UpdateAsync(user);
                return Results.Ok();
            }
            else
            {
                return Results.Problem();
            }
        }
        [HttpPut("/bannerpicture")]
        public async Task<IResult> UpdateProfileBanner(MainContext maindb, [FromForm] PostRequest imagerequest, UserManager<User> userManager)
        {
            User? user = await userManager.GetUserAsync(HttpContext.User);
            if (user != null && imagerequest.Image != null)
            {


                var memorystream = new MemoryStream();
                imagerequest.Image.CopyTo(memorystream);
                user.BannerPicture = memorystream.ToArray();
                await userManager.UpdateAsync(user);
                return Results.Ok();
            }
            else
            {
                return Results.Problem();
            }
        }

    }
}

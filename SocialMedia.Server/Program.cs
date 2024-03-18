using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using Microsoft.Identity.Client;
using SocialMedia.Server.Models;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Cors.Infrastructure;
using SocialMedia.Server.Hubs;

var builder = WebApplication.CreateBuilder(args);



// Add services to the container.


builder.Services.AddSignalR();

builder.Services.AddDbContext<UserContext>(options =>
{
    options.UseSqlServer("Server=DESKTOP-GCC7A7J;Database=UserDB; TrustServerCertificate=True; Integrated Security=True;");
});
builder.Services.AddDbContext<MainContext>(options =>
{
    options.UseSqlServer("Server=DESKTOP-GCC7A7J;Database=MainDb; TrustServerCertificate=True; Integrated Security=True;");
});
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<User>().AddEntityFrameworkStores<UserContext>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapIdentityApi<User>();

app.MapPost("/signup", async (UserManager<User> userManager) =>
{

    HttpContextAccessor accessor = new HttpContextAccessor();
    StreamReader reader = new StreamReader(accessor.HttpContext.Request.Body);
    var result = await reader.ReadToEndAsync();
    var resultdictionary = JsonSerializer.Deserialize<Dictionary<string, string>>(result);
    var user = new User();

    await userManager.SetUserNameAsync(user, resultdictionary["username"]);



    var usercreated = await userManager.CreateAsync(user, resultdictionary["password"]);

    if (usercreated.Succeeded)
    {
        return Results.Ok();
    }
    else
    {
        return Results.Problem();
    }

});




app.MapGet("/logout", async (SignInManager<User> signInManager) =>
{

    await signInManager.SignOutAsync();
    return Results.Ok();

}).RequireAuthorization();


app.MapGet("/pingauth",async (UserManager<User> userManager) =>
{
    HttpContextAccessor accessor = new HttpContextAccessor();
    var currentuser = await userManager.GetUserAsync(accessor.HttpContext.User);
    if (currentuser != null)
    {
        return Results.Json(new { CurrentUser = currentuser }); 
    } else
    {
        return Results.Problem();
    }




   
}).RequireAuthorization();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.MapHub<MessageHub>("/messages");


app.Run();

using Microsoft.AspNetCore.SignalR;
using Microsoft.Identity.Client;

namespace SocialMedia.Server.Hubs
{
    public class MessageHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            
            return base.OnConnectedAsync();
        }

        public async Task JoinUserRoom(string username)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, username);
        }


        public  Task TriggerRender(string groupname) {
            return Clients.Group(groupname).SendAsync("ReRender");
        }


        

       
    }
}

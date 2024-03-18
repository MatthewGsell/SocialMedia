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

        public async Task SendMessage()
        {
            await Clients.All.SendAsync("ReceiveMessage", "this is a dumb message");
        }
    }
}

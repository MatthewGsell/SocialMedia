using Microsoft.AspNetCore.SignalR;

namespace SocialMedia.Server.Hubs
{
    public class MessageHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }
    }
}

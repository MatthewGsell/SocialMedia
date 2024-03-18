using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialMedia.Server.Migrations.User
{
    /// <inheritdoc />
    public partial class addedbannerpicture : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "BannerPicture",
                table: "AspNetUsers",
                type: "varbinary(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BannerPicture",
                table: "AspNetUsers");
        }
    }
}

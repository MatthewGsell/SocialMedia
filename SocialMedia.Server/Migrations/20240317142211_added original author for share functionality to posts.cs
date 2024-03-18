using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialMedia.Server.Migrations
{
    /// <inheritdoc />
    public partial class addedoriginalauthorforsharefunctionalitytoposts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OriginalAuthor",
                table: "Posts",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OriginalAuthor",
                table: "Posts");
        }
    }
}

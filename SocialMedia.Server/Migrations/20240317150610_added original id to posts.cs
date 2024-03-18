using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialMedia.Server.Migrations
{
    /// <inheritdoc />
    public partial class addedoriginalidtoposts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OriginalId",
                table: "Posts",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OriginalId",
                table: "Posts");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UseItApi.Migrations
{
    /// <inheritdoc />
    public partial class AddNewFieldsToTool : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Tools",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Tools",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Price",
                table: "Tools",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Tools");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Tools");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Tools");
        }
    }
}

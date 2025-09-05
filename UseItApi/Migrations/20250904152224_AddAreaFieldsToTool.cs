using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UseItApi.Migrations
{
    /// <inheritdoc />
    public partial class AddAreaFieldsToTool : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Area",
                table: "Tools",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PostalCode",
                table: "Tools",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Area",
                table: "Tools");

            migrationBuilder.DropColumn(
                name: "PostalCode",
                table: "Tools");
        }
    }
}

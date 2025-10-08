using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UseItApi.Migrations
{
    /// <inheritdoc />
    public partial class AddToolBrandModelDeposit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Brand",
                table: "Tools",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Deposit",
                table: "Tools",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Model",
                table: "Tools",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Brand",
                table: "Tools");

            migrationBuilder.DropColumn(
                name: "Deposit",
                table: "Tools");

            migrationBuilder.DropColumn(
                name: "Model",
                table: "Tools");
        }
    }
}

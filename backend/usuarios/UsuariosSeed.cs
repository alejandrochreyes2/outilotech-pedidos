namespace UsuariosAPI.Data
{
    public static class UsuariosSeed
    {
        public static List<Usuario> Usuarios = new List<Usuario>
        {
            new Usuario { Email = "admin@admin.com", Password = "admin", Role = "admin" },
            new Usuario { Email = "user@user.com", Password = "user", Role = "user" }
        };
    }

    public class Usuario
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }
}
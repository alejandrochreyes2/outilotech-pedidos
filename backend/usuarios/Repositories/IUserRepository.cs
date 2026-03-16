using UsuariosAPI.Models;

namespace UsuariosAPI.Repositories
{
    public interface IUserRepository
    {
        Task<ApplicationUser?> GetByEmailAsync(string email);
        Task<IdentityResult> CreateAsync(ApplicationUser user, string password);
        Task<bool> CheckPasswordAsync(ApplicationUser user, string password);
        Task<IList<string>> GetRolesAsync(ApplicationUser user);
    }
}

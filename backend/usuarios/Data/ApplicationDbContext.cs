using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using UsuariosAPI.Models;

namespace UsuariosAPI.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<ApplicationUser>(entity => { entity.ToTable(name: "usuarios"); });
            builder.Entity<Microsoft.AspNetCore.Identity.IdentityRole>(entity => { entity.ToTable(name: "roles"); });
            builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserRole<string>>(entity => { entity.ToTable("usuarios_roles"); });
            builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserClaim<string>>(entity => { entity.ToTable("usuarios_claims"); });
            builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserLogin<string>>(entity => { entity.ToTable("usuarios_logins"); });
            builder.Entity<Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>>(entity => { entity.ToTable("roles_claims"); });
            builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserToken<string>>(entity => { entity.ToTable("usuarios_tokens"); });
        }
    }
}

using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Model;

[ExcludeFromCodeCoverage]
public class IdentityContext(DbContextOptions<IdentityContext> options) : IdentityDbContext<IdentityUser>(options)
{
    
}
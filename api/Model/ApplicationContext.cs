using api.Model.Entity;
using Microsoft.EntityFrameworkCore;

namespace api.Model;

public class ApplicationContext : DbContext
{
    public virtual DbSet<TimeFrame> TimeFrames { get; set; }
    public virtual DbSet<Project> Projects { get; set; }

    public ApplicationContext()
    {
    }

    public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
    {
    }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        base.ConfigureConventions(configurationBuilder);

        configurationBuilder
            .Properties<string>()
            .HaveMaxLength(256);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TimeFrame>(entity =>
        {
            entity.HasOne(e => e.Project)
                .WithMany()
                .HasForeignKey(e => e.ProjectId)
                .OnDelete(DeleteBehavior.NoAction);
        });
    }
}
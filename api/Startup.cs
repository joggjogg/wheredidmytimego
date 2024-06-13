using api.Model;
using api.Services;
using api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api;

public class Startup
{
    public Startup(IConfiguration configuration, IWebHostEnvironment env)
    {
        Configuration = configuration;
        Environment = env;
    }

   private IConfiguration Configuration { get; }
    private IWebHostEnvironment Environment { get; }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddDbContext<ApplicationContext>(options =>
        {
            options.UseNpgsql(Configuration.GetConnectionString("Default"));
        });

        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        services.AddScoped<ITimeFrameService, TimeFrameService>();
        services.AddScoped<IProjectService, ProjectService>();
    }

    public void Configure(IApplicationBuilder app, IServiceScopeFactory scopeFactory)
    {
        if (Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseForwardedHeaders();
        app.UseResponseCaching();
        app.UseRouting();
        app.UseAuthorization();
        app.UseHttpsRedirection();
        
        app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        using var scope = scopeFactory.CreateScope();
        ApplyMigrations(scope.ServiceProvider.GetRequiredService<ApplicationContext>());
    }

    public void ApplyMigrations(ApplicationContext applicationContext)
    {
        if (applicationContext.Database.GetPendingMigrations().Any())
        {
            applicationContext.Database.Migrate();
        }
    }
}
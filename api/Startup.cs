using System.Text.Json.Serialization;
using api.Model;
using api.Services;
using api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
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
        services.AddDbContext<IdentityContext>(options =>
        {
            options.UseNpgsql(Configuration.GetConnectionString("Identity"));
        });

        services.AddAuthorization();
        services.AddIdentityApiEndpoints<IdentityUser>()
            .AddEntityFrameworkStores<IdentityContext>();

        services.AddCors(builder =>
        {
            builder.AddDefaultPolicy(policy =>
            {
                policy
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
                if (Environment.IsDevelopment())
                    policy.SetIsOriginAllowed(origin => true);
                else
                {
                    policy.WithOrigins("https://wheredidmytimego.io");
                }
            });
        });
        services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        });
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

        app.UseCors();
        app.UseForwardedHeaders();
        app.UseResponseCaching();
        app.UseRouting();
        app.UseHttpsRedirection();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapIdentityApi<IdentityUser>();

        });
        using var scope = scopeFactory.CreateScope();
        ApplyMigrations(scope.ServiceProvider.GetRequiredService<ApplicationContext>(),
            scope.ServiceProvider.GetRequiredService<IdentityContext>());
    }

    public void ApplyMigrations(ApplicationContext applicationContext, IdentityContext identityContext)
    {
        if (applicationContext.Database.GetPendingMigrations().Any())
        {
            applicationContext.Database.Migrate();
        }

        if (identityContext.Database.GetPendingMigrations().Any())
        {
            identityContext.Database.Migrate();
        }
    }
}
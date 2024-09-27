using System.Data.Common;
using api.Model;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace api.test.TestInfrastructure;

public class ApplicationContextFixture: IAsyncLifetime
{
    private TestContainerSetup Setup { get; }
    internal DbConnection Connection { get; set; } = null!;

    public ApplicationContextFixture()
    {
        Setup = new();
    }
    
    public async Task InitializeAsync()
    {
        await Setup.PostgreSqlContainer.StartAsync();
        Connection = new NpgsqlConnection(Setup.PostgreSqlContainer.GetConnectionString() + ";Include Error Detail=true");
        await Connection.OpenAsync();
        await using var context = CreateContext();
        await context.Database.EnsureCreatedAsync();
    }
    
    private ApplicationContext CreateContext(DbTransaction? transaction = null)
    {
        var context =
            new ApplicationContext(new DbContextOptionsBuilder<ApplicationContext>().UseNpgsql(Connection).Options);

        if (transaction != null)
        {
            context.Database.UseTransaction(transaction);
        }

        return context;
    }

    public async Task DisposeAsync()
    {
        await Setup.PostgreSqlContainer.DisposeAsync();
    }
}
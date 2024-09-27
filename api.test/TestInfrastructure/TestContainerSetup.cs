using Testcontainers.PostgreSql;

namespace api.test.TestInfrastructure;

public class TestContainerSetup
{
    public readonly PostgreSqlContainer PostgreSqlContainer = new PostgreSqlBuilder()
        .WithImage("postgres:15")
        .WithDatabase("postgres")
        .WithUsername("testcontainers")
        .WithPassword("testcontainers")
        .WithStartupCallback((_, _) => Task.Delay(3000))
        .Build();
}
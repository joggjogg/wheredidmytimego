using System.Data.Common;
using api.Model;
using Microsoft.EntityFrameworkCore;
using api.test.Extensions;

namespace api.test.TestInfrastructure;

public class ContextBuilder
{
    private DbConnection? Connection { get; set; }
    private DbTransaction? Transaction { get; set; }

    public ContextBuilder WithConnection(DbConnection connection)
    {
        Connection = connection;
        return this;
    }

    public ContextBuilder WithTransaction(DbTransaction transaction)
    {
        Transaction = transaction;
        return this;
    }

    public async Task<ApplicationContext> CreateAsync()
    {
        ArgumentNullException.ThrowIfNull(Connection);
        var options = new DbContextOptionsBuilder<ApplicationContext>().UseNpgsql(Connection).Options;
        var context = new ApplicationContext(options);

        if (Transaction != null)
        {
            await context.Database.UseTransactionAsync(Transaction);
        }

        await ClearDatabaseAsync(context);

        return context;
    }

    private static async Task ClearDatabaseAsync(ApplicationContext context)
    {
        await context.DeleteAllDataAsync();
    }
}
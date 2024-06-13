using api.Model;
using Z.EntityFramework.Plus;

namespace api.integrationTests.Extensions;

public static class ApplicationContextExtensions
{
    public static async Task DeleteAllDataAsync(this ApplicationContext context)
    {
        await context.TimeFrames.DeleteAsync();

        context.ChangeTracker.Clear();
    }
}
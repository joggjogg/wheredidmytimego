using api.Model;
using Z.EntityFramework.Plus;

namespace api.integrationTests.Extensions;

public static class ApplicationContextExtensions
{
    public static async Task DeleteAllDataAsync(this ApplicationContext context)
    {
        await context.TimeFrames.DeleteAsync();
        await context.Projects.DeleteAsync();

        context.ChangeTracker.Clear();
    }
}
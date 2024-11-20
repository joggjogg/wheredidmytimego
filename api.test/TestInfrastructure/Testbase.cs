using api.Model;
using api.Model.Entity;
using api.test.Extensions;

namespace api.test.TestInfrastructure;

public abstract class TestBase(ApplicationContextFixture fixture)
    : IClassFixture<ApplicationContextFixture>, IAsyncLifetime
{
    private readonly ContextBuilder _context = new ContextBuilder().WithConnection(fixture.Connection);
    protected ApplicationContext Db = null!;

    public virtual async Task InitializeAsync()
    {
        Db = await _context.CreateAsync();
        var testData = CreateTestData();
        await testData.SeedAsync();
    }

    public async Task DisposeAsync()
    {
        await Db.DisposeAsync();
    }

    protected async Task ResetToBaseStateAsync()
    {
        await Db.DeleteAllDataAsync();
        var testData = CreateBaseTestData();
        await testData.SeedAsync();
    }

    private TestDataBuilder CreateBaseTestData()
    {
        var builder = new TestDataBuilder(Db);

        builder.WithProjects(new List<Project>()
        {
            new()
            {
                ProjectId = 100,
                ProjectName = "Lottery-admin",
                ProjectDescription = "Admin app for Elise",
            }
        });

        builder.WithTimeFrames(new List<TimeFrame>()
        {
            new()
            {
                TimeFrameId = 100,
                ProjectId = 100,
                TimeFrameStart = DateTime.Parse("2024-10-30 10:00:00").ToUniversalTime(),
                TimeFrameEnd = DateTime.Parse("2024-10-30 14:00:00").ToUniversalTime(),
            },
            new()
            {
                TimeFrameId = 101,
                ProjectId = 100,
                TimeFrameStart = DateTime.Parse("2024-10-31 14:00:00").ToUniversalTime(),
                TimeFrameEnd = DateTime.Parse("2024-10-31 15:00:00").ToUniversalTime(),
            },
        });

        return builder;
    }

    protected virtual TestDataBuilder CreateTestData()
    {
        return CreateBaseTestData();
    }
}
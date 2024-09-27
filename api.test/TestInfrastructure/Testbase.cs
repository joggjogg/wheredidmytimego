using api.Model;
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

        return builder;
    }

    protected virtual TestDataBuilder CreateTestData()
    {
        return CreateBaseTestData();
    }
}
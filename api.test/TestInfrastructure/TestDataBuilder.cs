using api.Model;
using api.Model.Entity;

namespace api.integrationTests.TestInfrastructure;

public class TestDataBuilder(ApplicationContext db)
{
    public async Task SeedAsync()
    {
        await db.SaveChangesAsync();
    }

    public TestDataBuilder WithTimeFrames(IEnumerable<TimeFrame> timeFrames)
    {
        db.TimeFrames.AddRange(timeFrames);
        return this;
    }

    public TestDataBuilder WithProjects(IEnumerable<Project> projects)
    {
        db.Projects.AddRange(projects);
        return this;
    }
}
using api.Model.DTO;
using api.Model.Entity;
using api.Model.Request;
using api.Services;
using api.test.TestInfrastructure;

namespace api.test.Services;

public class ProjectServiceTest(ApplicationContextFixture fixture) : TestBase(fixture)
{
    public ProjectService _sut = null!;

    public override async Task InitializeAsync()
    {
        await base.InitializeAsync();
        _sut = new ProjectService(Db);
    }

    [Fact]
    public async Task Get_ReturnsAllProjects()
    {
        Db.Projects.Add(new Project()
        {
            ProjectId = 1,
            ProjectName = "Where Did My Time Go?",
            ProjectDescription = "Prove to myself I can achieve anything"
        });
        Db.Projects.Add(new Project()
        {
            ProjectId = 2,
            ProjectName = "Preaz",
            ProjectDescription = "Tailor made massage planner"
        });
        await Db.SaveChangesAsync();

        var actual = await _sut.Get();

        Assert.Collection(actual,
            project =>
            {
                Assert.IsType<Project>(project);
                Assert.Equal(1, project.ProjectId);
            }, project =>
            {
                Assert.IsType<Project>(project);
                Assert.Equal(2, project.ProjectId);
            });
    }

    [Fact]
    public async Task Create_WithValidData_ReturnsProject()
    {
        await ResetToBaseStateAsync();
        const int projectId = 1;
        var project = new ProjectPostRequest()
        {
            ProjectName = "Where Did My Time Go?",
            ProjectDescription = "Prove to myself I can achieve anything"
        };

        var actual = await _sut.Create(project);

        var created = Assert.IsType<Project>(actual);
        Assert.Equal(projectId, created.ProjectId);
    }

    [Fact]
    public async Task Get_WithValidId_ReturnsProject()
    {
        await ResetToBaseStateAsync();
        const int projectId = 1;
        Db.Projects.Add(new Project()
        {
            ProjectId = 1,
            ProjectName = "Where Did My Time Go?",
            ProjectDescription = "Prove to myself I can achieve anything"
        });
        await Db.SaveChangesAsync();

        var actual = await _sut.Get(projectId);

        var project = Assert.IsType<Project>(actual);
        Assert.Equal(projectId, actual.ProjectId);
    }

    [Fact]
    public async Task Get_WithInvalidId_ReturnsNull()
    {
        await ResetToBaseStateAsync();
        const int projectId = -1;

        var actual = await _sut.Get(projectId);
        
        Assert.Null(actual);
    }
}
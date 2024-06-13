using api.Controllers;
using api.Model.DTO;
using api.Model.Entity;
using api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace api.test.Controllers;

public class ProjectControllerTest
{
    private readonly Mock<IProjectService> _projectServiceMock;
    private readonly ProjectController _sut;

    public ProjectControllerTest()
    {
        _projectServiceMock = new();
        _sut = new ProjectController(_projectServiceMock.Object);
    }

    [Fact]
    public async Task Get_ReturnsOkObjectResult()
    {
        Project[] projects = [new Project()];
        _projectServiceMock.Setup(m => m.Get()).ReturnsAsync(projects);

        var actual = await _sut.Get();

        var okObjectResult = Assert.IsType<OkObjectResult>(actual);
        Assert.IsAssignableFrom<IEnumerable<Project>>(okObjectResult.Value);
    }

    [Fact]
    public async Task Post_ReturnsCreatedObjectResult()
    {
        var project = new ProjectCreateDTO();
        _projectServiceMock.Setup(m => m.Create(project)).ReturnsAsync(new Project());

        var actual = await _sut.Post(project);

        var createdObjectResult = Assert.IsType<CreatedResult>(actual);
        Assert.IsType<Project>(createdObjectResult.Value);
    }
}
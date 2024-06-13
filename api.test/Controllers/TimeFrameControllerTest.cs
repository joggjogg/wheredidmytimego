using api.Controllers;
using api.Model.DTO;
using api.Model.Entity;
using api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace api.test.Controllers;

public class TimeFrameControllerTest
{
    private readonly Mock<ITimeFrameService> _timeFrameServiceMock;
    private readonly TimeFrameController _sut;

    public TimeFrameControllerTest()
    {
        _timeFrameServiceMock = new();
        _sut = new(_timeFrameServiceMock.Object);
    }

    [Fact]
    public async Task Get_ReturnsOkObjectResult()
    {
        TimeFrame[] timeFrames = [new TimeFrame()];
        _timeFrameServiceMock.Setup(m => m.Get()).ReturnsAsync(timeFrames);
        
        var actual = await _sut.Get();

        var okObjectResult = Assert.IsType<OkObjectResult>(actual);
        Assert.IsAssignableFrom<IEnumerable<TimeFrame>>(okObjectResult.Value);
    }

    [Fact]
    public async Task Post_WithValidData_ReturnsCreatedResult()
    {
        var data = new TimeFrameCreateDTO()
        {
            TimeFrameStart = DateTime.Parse("2024-06-12 10:52:32"),
            TzName = "Europe/Luxembourg"
        };
        _timeFrameServiceMock.Setup(m => m.Create(data)).ReturnsAsync(new TimeFrame());

        var actual = await _sut.Post(data);

        var createdObjectResult = Assert.IsType<CreatedResult>(actual);
        Assert.IsType<TimeFrame>(createdObjectResult.Value);
    }

    [Fact]
    public async Task Patch_WithValidData_ReturnsOkObjectResult()
    {
        const int timeFrameId = 1;
        var data = new TimeFramePatchDTO()
        {
            TimeFrameEnd = DateTime.Parse("2024-06-12 15:32:52"),
            TzName = "Europe/Luxembourg"
        };
        _timeFrameServiceMock.Setup(m => m.Patch(timeFrameId, data)).ReturnsAsync(new TimeFrame());

        var actual = await _sut.Patch(timeFrameId, data);

        var okObjectResult = Assert.IsType<OkObjectResult>(actual);
        Assert.IsType<TimeFrame>(okObjectResult.Value);
    }
}
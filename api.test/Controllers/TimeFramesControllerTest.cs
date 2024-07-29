using api.Controllers;
using api.Model.DTO;
using api.Model.Entity;
using api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace api.test.Controllers;

public class TimeFramesControllerTest
{
    private readonly Mock<ITimeFrameService> _timeFrameServiceMock;
    private readonly TimeFramesController _sut;

    public TimeFramesControllerTest()
    {
        _timeFrameServiceMock = new();
        _sut = new(_timeFrameServiceMock.Object);
    }

    [Fact]
    public async Task Get_ReturnsOkObjectResult()
    {
        TimeFrame[] timeFrames = [new TimeFrame()];
        _timeFrameServiceMock.Setup(m => m.GetTimeFrames()).ReturnsAsync(timeFrames);

        var actual = await _sut.Get();

        var okObjectResult = Assert.IsType<OkObjectResult>(actual);
        Assert.IsAssignableFrom<IEnumerable<TimeFrame>>(okObjectResult.Value);
    }

    [Fact]
    public async Task Post_WithValidData_ReturnsCreatedResult()
    {
        var data = new TimeFramePostRequest()
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
        var data = new TimeFramePatchRequest()
        {
            TimeFrameEnd = DateTime.Parse("2024-06-12 15:32:52"),
            TzName = "Europe/Luxembourg"
        };
        _timeFrameServiceMock.Setup(m => m.Patch(timeFrameId, data)).ReturnsAsync(new TimeFrame());

        var actual = await _sut.Patch(timeFrameId, data);

        var okObjectResult = Assert.IsType<OkObjectResult>(actual);
        Assert.IsType<TimeFrame>(okObjectResult.Value);
    }

    [Fact]
    public async Task Post_WithRunningTimeFrame_ReturnsConflictObjectResult()
    {
        var data = new TimeFramePostRequest()
        {
            TimeFrameStart = DateTime.Parse("2024-06-12 10:52:32"),
            TzName = "Europe/Luxembourg"
        };
        _timeFrameServiceMock.Setup(m => m.HasActiveTimeFrame()).ReturnsAsync(true);

        var actual = await _sut.Post(data);

        Assert.IsType<ConflictObjectResult>(actual);
    }

    [Fact]
    public async Task GetActiveTimeFrame_WithActiveTimeFrame_ReturnsOk()
    {
        var activeTimeFrame = new TimeFrame()
        {
            TimeFrameId = 1,
            TimeFrameStart = DateTime.Parse("2024-06-12 10:52:32"),
        };
        _timeFrameServiceMock.Setup(m => m.GetActiveTimeFrame()).ReturnsAsync(activeTimeFrame);

        var actual = await _sut.GetActiveTimeFrame();

        var timeFrame = Assert.IsType<OkObjectResult>(actual);
        Assert.IsType<TimeFrame>(timeFrame.Value);
    }

    [Fact]
    public async Task GetActiveTimeFrame_WithNoActiveTimeFrame_ReturnsNotFound()
    {
        _timeFrameServiceMock.Setup(m => m.GetActiveTimeFrame()).ReturnsAsync((TimeFrame)null);
        
        var actual = await _sut.GetActiveTimeFrame();

        Assert.IsType<NotFoundResult>(actual);
    }

    [Fact]
    public async Task GetTimeFrame_WithValidTimeFrameId_ReturnsOkObjectResult()
    {
        const int timeFrameId = 1;
        var timeFrame = new TimeFrame()
        {
            TimeFrameId = 1,
            TimeFrameStart = DateTime.Parse("2024-06-12 10:52:32"),
        };
        _timeFrameServiceMock.Setup(m => m.GetTimeFrames(timeFrameId)).ReturnsAsync(timeFrame);

        var actual = await _sut.GetTimeFrame(timeFrameId);

        var okObjectResult = Assert.IsType<OkObjectResult>(actual);
        Assert.IsType<TimeFrame>(okObjectResult.Value);
    }

    [Fact]
    public async Task GetTimeFrame_WithNonValidTimeFrameId_ReturnsNotFoundResult()
    {
        const int timeFrameId = -1;
        _timeFrameServiceMock.Setup(m => m.GetTimeFrames(timeFrameId)).ReturnsAsync((TimeFrame)null);

        var actual = await _sut.GetTimeFrame(timeFrameId);
        
        Assert.IsType<NotFoundResult>(actual);
    }
}
using api.Exceptions;
using api.integrationTests.TestInfrastructure;
using api.Model.DTO;
using api.Model.Entity;
using api.Services;

namespace api.integrationTests.Services;

public class TimeFrameServiceTest(ApplicationContextFixture fixture) : TestBase(fixture)
{
    private TimeFrameService _sut = null!;

    public override async Task InitializeAsync()
    {
        await base.InitializeAsync();
        _sut = new TimeFrameService(Db);
    }

    [Fact]
    public async Task Get_ReturnsAllTimeFrames()
    {
        Db.TimeFrames.Add(new TimeFrame()
        {
            TimeFrameId = 1,
            TimeFrameStart = DateTime.Parse("2024-06-11 10:00:00").ToUniversalTime(),
            TimeFrameEnd = DateTime.Parse("2024-06-11 14:32:23").ToUniversalTime(),
        });
        Db.TimeFrames.Add(new TimeFrame()
        {
            TimeFrameId = 2,
            TimeFrameStart = DateTime.Parse("2024-06-12 09:41:00").ToUniversalTime(),
            TimeFrameEnd = DateTime.Parse("2024-06-12 16:32:23").ToUniversalTime(),
        });
        await Db.SaveChangesAsync();

        var actual = await _sut.Get();

        Assert.Collection(actual,
            frame =>
            {
                Assert.IsType<TimeFrame>(frame);
                Assert.Equal(1, frame.TimeFrameId);
            },
            frame =>
            {
                Assert.IsType<TimeFrame>(frame);
                Assert.Equal(2, frame.TimeFrameId);
            });
    }

    [Fact]
    public async Task Create_WithValidTimeFrame_CreatesTimeFrame()
    {
        await ResetToBaseStateAsync();
        var timeFrame = new TimeFrameCreateDTO()
        {
            TimeFrameStart = DateTime.Parse("2024-06-11 10:00:00"),
            TzName = "Eastern Standard Time"
        };

        var actual = await _sut.Create(timeFrame);

        Assert.IsType<TimeFrame>(actual);
        Assert.Equal(1, actual.TimeFrameId);
    }

    [Fact]
    public async Task Create_WithInvalidTimeZone_ThrowsTimeZoneNotFoundException()
    {
        await ResetToBaseStateAsync();
        var timeFrame = new TimeFrameCreateDTO()
        {
            TimeFrameStart = DateTime.Parse("2024-06-11 10:00:00"),
            TzName = "European Bozo Time"
        };

        await Assert.ThrowsAsync<TimeZoneNotFoundException>(async () => await _sut.Create(timeFrame));
    }

    [Fact]
    public async Task Create_WithValidTimeZone_CorrectlyConvertsToUtc()
    {
        await ResetToBaseStateAsync();
        var timeFrame = new TimeFrameCreateDTO()
        {
            TimeFrameStart = DateTime.Parse("2024-06-12 10:52:32"),
            TzName = "Europe/Luxembourg"
        };

        var actual = await _sut.Create(timeFrame);
        var expected = DateTime.Parse("2024-06-12 08:52:32");

        Assert.Equal(expected, actual.TimeFrameStart);
    }

    [Fact]
    public async Task End_WithLaterTimeFrameEndThanTimeFrameStart_CorrectlyConvertsToUtc()
    {
        await ResetToBaseStateAsync();
        Db.TimeFrames.Add(new TimeFrame()
        {
            TimeFrameId = 1,
            TimeFrameStart = DateTime.Parse("2024-06-11 10:00:00").ToUniversalTime()
        });
        await Db.SaveChangesAsync();
        const int timeFrameId = 1;
        var data = new TimeFramePatchDTO()
        {
            TimeFrameEnd = DateTime.Parse("2024-06-11 11:00:00"),
            TzName = "Europe/Luxembourg"
        };

        var actual = await _sut.Patch(timeFrameId, data);
        var expected = DateTime.Parse("2024-06-11 09:00:00");

        var timeFrame = Assert.IsType<TimeFrame>(actual);
        Assert.Equal(expected, timeFrame.TimeFrameEnd);
    }

    [Fact]
    public async Task End_WithLaterTimeFrameStartThanTimeFrameEnd_ThrowsInvalidTimeFrameException()
    {
        await ResetToBaseStateAsync();
        Db.TimeFrames.Add(new TimeFrame()
        {
            TimeFrameId = 1,
            TimeFrameStart = DateTime.Parse("2024-06-11 10:00:00").ToUniversalTime()
        });
        await Db.SaveChangesAsync();
        const int timeFrameId = 1;
        var data = new TimeFramePatchDTO()
        {
            TimeFrameEnd = DateTime.Parse("2024-06-11 09:59:59"),
            TzName = "Europe/Luxembourg"
        };

        await Assert.ThrowsAsync<InvalidTimeFrameException>(async () => await _sut.Patch(timeFrameId, data));
    }

    [Fact]
    public async Task End_WithNonExistingTimeFrameId_ThrowsInvalidOperationException()
    {
        await ResetToBaseStateAsync();
        const int timeFrameId = 1;
        var data = new TimeFramePatchDTO()
        {
            TimeFrameEnd = DateTime.Parse("2024-06-11 09:59:59"),
            TzName = "Europe/Luxembourg"
        };

        await Assert.ThrowsAsync<InvalidOperationException>(async () => await _sut.Patch(timeFrameId, data));
    }

    [Fact]
    public async Task HasRunningTimeFrame_WithRunningTimeFrame_ReturnsTrue()
    {
        await ResetToBaseStateAsync();
        Db.TimeFrames.Add(new TimeFrame()
        {
            TimeFrameId = 1,
            TimeFrameStart = DateTime.Parse("2024-06-11 10:00:00").ToUniversalTime()
        });
        await Db.SaveChangesAsync();

        var result = await _sut.HasRunningTimeFrame();
        
        Assert.True(result);
    }

    [Fact]
    public async Task HasRunningTimeFrame_WithEndedTimeFrame_ReturnsFalse()
    {
        await ResetToBaseStateAsync();
        Db.TimeFrames.Add(new TimeFrame()
        {
            TimeFrameId = 1,
            TimeFrameStart = DateTime.Parse("2024-06-11 10:00:00").ToUniversalTime(),
            TimeFrameEnd = DateTime.Parse("2024-06-11 12:00:00").ToUniversalTime()
        });
        await Db.SaveChangesAsync();

        var result = await _sut.HasRunningTimeFrame();
        
        Assert.False(result);
    }
}
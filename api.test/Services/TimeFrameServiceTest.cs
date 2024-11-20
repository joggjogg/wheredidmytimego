using api.Exceptions;
using api.Model.DTO;
using api.Model.Entity;
using api.Model.Parameters;
using api.Services;
using api.test.TestInfrastructure;
using Microsoft.EntityFrameworkCore;

namespace api.test.Services;

public class TimeFrameServiceTest(ApplicationContextFixture fixture) : TestBase(fixture)
{
    private TimeFrameService _sut = null!;

    public override async Task InitializeAsync()
    {
        await base.InitializeAsync();
        _sut = new TimeFrameService(Db);
    }

    [Fact]
    public async Task GetTimeFrames_WithValidParameters_ReturnsTimeFramesWithinParameters()
    {
        var timeFrameParameters = new TimeFrameParameters()
        {
            DateFrom = DateTime.Parse("2024-05-01 10:00:00"),
            DateTo = DateTime.Parse("2024-12-31 10:00:00"),
            TzName = "Europe/Luxembourg",
        };

        var actual = await _sut.GetTimeFrames(timeFrameParameters);

        Assert.Collection(actual,
            frame =>
            {
                Assert.IsType<TimeFrame>(frame);
                Assert.Equal(100, frame.TimeFrameId);
            },
            frame =>
            {
                Assert.IsType<TimeFrame>(frame);
                Assert.Equal(101, frame.TimeFrameId);
            });
    }

    [Fact]
    public async Task Create_WithValidTimeFrame_CreatesTimeFrame()
    {
        await ResetToBaseStateAsync();
        var timeFrame = new TimeFramePostRequest()
        {
            TimeFrameStart = DateTime.Parse("2024-06-11 10:00:00"),
            TzName = "Eastern Standard Time"
        };

        var actual = await _sut.Create(timeFrame);

        Assert.IsType<TimeFrame>(actual);
    }

    [Fact]
    public async Task Create_WithInvalidTimeZone_ThrowsTimeZoneNotFoundException()
    {
        await ResetToBaseStateAsync();
        var timeFrame = new TimeFramePostRequest()
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
        var timeFrame = new TimeFramePostRequest()
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
            TimeFrameStart = DateTime.Parse("2024-06-11 00:00:00").ToUniversalTime()
        });
        await Db.SaveChangesAsync();
        const int timeFrameId = 1;
        var data = new TimeFramePatchRequest()
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
        var data = new TimeFramePatchRequest()
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
        var data = new TimeFramePatchRequest()
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

        var result = await _sut.HasActiveTimeFrame();
        
        Assert.True(result);
    }

    [Fact]
    public async Task HasActiveTimeFrame_WithEndedTimeFrame_ReturnsFalse()
    {
        await ResetToBaseStateAsync();
        Db.TimeFrames.Add(new TimeFrame()
        {
            TimeFrameId = 1,
            TimeFrameStart = DateTime.Parse("2024-06-11 10:00:00").ToUniversalTime(),
            TimeFrameEnd = DateTime.Parse("2024-06-11 12:00:00").ToUniversalTime()
        });
        await Db.SaveChangesAsync();

        var result = await _sut.HasActiveTimeFrame();
        
        Assert.False(result);
    }

    [Fact]
    public async Task GetRunningTimeFrame_ReturnsTimeFrameWithNoTimeFrameEnd()
    {
        await ResetToBaseStateAsync();
        Db.TimeFrames.Add(new TimeFrame()
        {
            TimeFrameId = 1,
            TimeFrameStart = DateTime.Parse("2024-06-11 10:00:00").ToUniversalTime(),
            TimeFrameEnd = DateTime.Parse("2024-06-11 12:00:00").ToUniversalTime()
        });
        Db.TimeFrames.Add(new TimeFrame()
        {
            TimeFrameId = 2,
            TimeFrameStart = DateTime.Parse("2024-06-11 10:00:00").ToUniversalTime(),
        });
        await Db.SaveChangesAsync();

        var result = await _sut.GetActiveTimeFrame();
        const int expected = 2;
        
        Assert.Equal(expected, result!.TimeFrameId);
        Assert.Null(result.TimeFrameEnd);
    }

    [Fact]
    public async Task GetTimeFrame_WithValidTimeFrameId_ReturnsTimeFrame()
    {
        await ResetToBaseStateAsync();
        const int timeFrameId = 1;
        Db.TimeFrames.Add(new TimeFrame()
        {
            TimeFrameId = 1,
            TimeFrameStart = DateTime.Parse("2024-06-11 10:00:00").ToUniversalTime(),
            TimeFrameEnd = DateTime.Parse("2024-06-11 12:00:00").ToUniversalTime()
        });
        await Db.SaveChangesAsync();

        var result = await _sut.GetTimeFrames(timeFrameId);

        var timeFrame = Assert.IsType<TimeFrame>(result);
        Assert.Equal(timeFrameId, timeFrame.TimeFrameId);
    }
    
    [Fact]
    public async Task GetTimeFrame_WithInValidTimeFrameId_ReturnsNull()
    {
        await ResetToBaseStateAsync();
        const int timeFrameId = 1;

        var result = await _sut.GetTimeFrames(timeFrameId);

        Assert.Null(result);
    }

    [Fact]
    public async Task GetTimeFrameStatistics_WithParameters_ReturnsTimeFrameStatistics()
    {
        var timeFrameParameters = new TimeFrameParameters()
        {
            DateFrom = DateTime.Parse("2024-08-01"),
            DateTo = DateTime.Parse("2024-12-31"),
            TzName = "Europe/Amsterdam",
            ProjectId = 100,
        };

        var actual = await _sut.GetTimeFrameStatistics(timeFrameParameters);
        
        Assert.Equal("5", actual.Hours);
    }

    // [Fact]
    // public async Task Delete_WithValidTimeFrameId_DeletesTimeFrame()
    // {
    //     await ResetToBaseStateAsync();
    //     const int timeFrameId = 1;
    //     Db.TimeFrames.Add(new TimeFrame()
    //     {
    //         TimeFrameId = 1,
    //         TimeFrameStart = DateTime.Parse("2024-06-11 10:00:00").ToUniversalTime(),
    //         TimeFrameEnd = DateTime.Parse("2024-06-11 12:00:00").ToUniversalTime()
    //     });
    //     await Db.SaveChangesAsync();
    //
    //     await _sut.Delete(timeFrameId);
    //
    //     Assert.Null(Db.TimeFrames.FirstOrDefaultAsync(t => t.TimeFrameId == timeFrameId));
    // }
}
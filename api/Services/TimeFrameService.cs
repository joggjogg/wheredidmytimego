using System.Globalization;
using api.Exceptions;
using api.Model;
using api.Model.DTO;
using api.Model.Entity;
using api.Model.Parameters;
using api.Model.Response;
using api.Services.Interfaces;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Serilog;
using TimeZoneConverter;
using ILogger = Serilog.ILogger;

#nullable enable

namespace api.Services;

public class TimeFrameService(ApplicationContext applicationContext) : ITimeFrameService
{
    private readonly ILogger _logger = Log.ForContext<TimeFrameService>();
    private readonly DbSet<TimeFrame> _timeFrameRepository = applicationContext.Set<TimeFrame>();

    public async Task<IEnumerable<TimeFrame>> GetTimeFrames(TimeFrameParameters timeFrameParameters)
    {
        return await CreateQueryable(timeFrameParameters)
            .Include(t => t.Project)
            .AsSingleQuery()
            .ToListAsync();
    }

    private IQueryable<TimeFrame> CreateQueryable(TimeFrameParameters timeFrameParameters)
    {
        var query = _timeFrameRepository.AsQueryable();

        if (timeFrameParameters is { DateFrom: not null, DateTo: not null, TzName: not null })
        {
            try
            {
                var dateFromUtc = ToUniversalTime(timeFrameParameters.DateFrom.Value, timeFrameParameters.TzName);
                var dateToUtc = ToUniversalTime(timeFrameParameters.DateTo.Value, timeFrameParameters.TzName);

                query = query.Where(t => t.TimeFrameStart >= dateFromUtc && t.TimeFrameStart <= dateToUtc);
            }
            catch (TimeZoneNotFoundException)
            {
                _logger.Error("Time zone not found when converting local timezone to UTC: {timeZone}",
                    timeFrameParameters.TzName);
                throw;
            }
        }

        if (timeFrameParameters.ProjectId.HasValue)
        {
            query = query.Where(t => t.ProjectId == timeFrameParameters.ProjectId.Value);
        }

        return query.OrderBy(t => t.TimeFrameStart);
    }

    public async Task<TimeFrame?> GetActiveTimeFrame()
    {
        return await _timeFrameRepository.Where(t => t.TimeFrameEnd == null)
            .Include(t => t.Project)
            .FirstOrDefaultAsync();
    }

    public async Task<TimeFrame?> GetTimeFrames(int timeFrameId)
    {
        return await _timeFrameRepository
            .Where(t => t.TimeFrameId == timeFrameId)
            .Include(t => t.Project)
            .FirstOrDefaultAsync(t => t.TimeFrameId == timeFrameId);
    }

    public async Task<TimeFrameStatisticsResponse> GetTimeFrameStatistics(TimeFrameParameters parameters)
    {
        var timeFrames = await CreateQueryable(parameters)
            .Include(e => e.Project)
            .AsSingleQuery()
            .ToListAsync();

        var timeSpan = timeFrames
            .Select(e =>
            {
                var timeSpan = e.TimeFrameEnd.Value - e.TimeFrameStart;
                return timeSpan;
            })
            .Aggregate(new TimeSpan(), ((total, next) => total.Add(next)));

        var statistics = new TimeFrameStatisticsResponse()
        {
            Hours = Math.Round(timeSpan.TotalHours, MidpointRounding.ToZero).ToString(CultureInfo.InvariantCulture),
            Minutes = timeSpan.Minutes.ToString(),
            Seconds = timeSpan.Seconds.ToString(),
        };

        if (parameters.ProjectId is not null)
        {
            statistics.ProjectId = parameters.ProjectId.Value;
        }

        if (parameters.DateFrom is not null)
        {
            statistics.TimeFrameFrom = DateOnly.FromDateTime(parameters.DateFrom.Value);
        }

        if (parameters.DateTo is not null)
        {
            statistics.TimeFrameFrom = DateOnly.FromDateTime(parameters.DateTo.Value);
        }

        return statistics;
    }

    public async Task<TimeFrame> Create(TimeFramePostRequest timeFrame)
    {
        try
        {
            var universalTime = ToUniversalTime(timeFrame.TimeFrameStart, timeFrame.TzName);
            timeFrame.TimeFrameStart = universalTime;

            var entity = timeFrame.Adapt<TimeFrame>();
            var entry = _timeFrameRepository.Add(entity);
            await applicationContext.SaveChangesAsync();
            return entry.Entity;
        }
        catch (TimeZoneNotFoundException)
        {
            _logger.Error("Time zone not found when converting local timezone to UTC: {timeZone}", timeFrame.TzName);
            throw;
        }
    }

    public async Task<TimeFrame> Patch(int timeFrameId, TimeFramePatchRequest timeFrame)
    {
        try
        {
            var entity = await _timeFrameRepository.FirstAsync(t => t.TimeFrameId == timeFrameId);

            if (timeFrame is { TimeFrameEnd: not null, TzName: not null })
            {
                var universalTime = ToUniversalTime(timeFrame.TimeFrameEnd.Value, timeFrame.TzName);
                if (universalTime < entity.TimeFrameStart)
                {
                    throw new InvalidTimeFrameException(
                        $"TimeFrameEnd {universalTime.ToShortDateString()} cannot be before TimeFrameStart {entity.TimeFrameStart.ToShortDateString()}");
                }

                entity.TimeFrameEnd = universalTime;
            }

            if (timeFrame.ProjectId != null)
            {
                entity.ProjectId = timeFrame.ProjectId.Value;
            }

            if (timeFrame.Description != null)
            {
                entity.Description = timeFrame.Description;
            }

            var entry = _timeFrameRepository.Attach(entity);
            entry.State = EntityState.Modified;
            await applicationContext.SaveChangesAsync();
            return entry.Entity;
        }
        catch (Exception e)
        {
            _logger.Error(e.Message);
            throw;
        }
    }

    private static DateTime ToUniversalTime(DateTime dateTime, string tzName)
    {
        return TimeZoneInfo.ConvertTimeToUtc(dateTime,
            TZConvert.GetTimeZoneInfo(tzName));
    }

    public async Task<bool> HasActiveTimeFrame()
    {
        return await _timeFrameRepository.Where(t => t.TimeFrameEnd == null).AnyAsync();
    }

    public async Task Delete(int timeFrameId)
    {
        _timeFrameRepository.Attach(new TimeFrame() { TimeFrameId = timeFrameId }).State = EntityState.Deleted;
        await applicationContext.SaveChangesAsync();
    }
}
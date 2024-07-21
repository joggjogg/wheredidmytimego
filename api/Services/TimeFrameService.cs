using api.Exceptions;
using api.Model;
using api.Model.DTO;
using api.Model.Entity;
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

    public async Task<IEnumerable<TimeFrame>> GetTimeFrame()
    {
        return await _timeFrameRepository.ToListAsync();
    }

    public async Task<TimeFrame?> GetActiveTimeFrame()
    {
        return await _timeFrameRepository.FirstOrDefaultAsync(t => t.TimeFrameEnd == null);
    }

    public async Task<TimeFrame?> GetTimeFrame(int timeFrameId)
    {
        return await _timeFrameRepository.FirstOrDefaultAsync(t => t.TimeFrameId == timeFrameId);
    }

    public async Task<TimeFrame> Create(TimeFrameCreateDTO timeFrame)
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

    public async Task<TimeFrame> Patch(int timeFrameId, TimeFramePatchDTO timeFrame)
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
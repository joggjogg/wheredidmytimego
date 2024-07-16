#nullable enable
using api.Model.DTO;
using api.Model.Entity;

namespace api.Services.Interfaces;

public interface ITimeFrameService
{
    Task<IEnumerable<TimeFrame>> GetTimeFrame();
    Task<TimeFrame?> GetTimeFrame(int timeFrameId);
    Task<TimeFrame?> GetActiveTimeFrame();
    Task<TimeFrame> Create(TimeFrameCreateDTO timeFrame);
    Task<TimeFrame> Patch(int timeFrameId, TimeFramePatchDTO timeFrame);
    Task<bool> HasActiveTimeFrame();
}
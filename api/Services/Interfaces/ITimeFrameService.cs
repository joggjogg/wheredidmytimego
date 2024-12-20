#nullable enable
using api.Model.DTO;
using api.Model.Entity;
using api.Model.Parameters;
using api.Model.Response;

namespace api.Services.Interfaces;

public interface ITimeFrameService
{
    Task<IEnumerable<TimeFrame>> GetTimeFrames(TimeFrameParameters parameters);
    Task<TimeFrame?> GetTimeFrames(int timeFrameId);
    Task<TimeFrame?> GetActiveTimeFrame();
    Task<TimeFrameStatisticsResponse> GetTimeFrameStatistics(TimeFrameParameters parameters);
    Task<TimeFrame> Create(TimeFramePostRequest timeFrame);
    Task<TimeFrame> Patch(int timeFrameId, TimeFramePatchRequest timeFrame);
    Task<bool> HasActiveTimeFrame();
    Task Delete(int timeFrameId);
}
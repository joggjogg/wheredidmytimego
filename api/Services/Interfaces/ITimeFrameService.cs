using api.Model.DTO;
using api.Model.Entity;

namespace api.Services.Interfaces;

public interface ITimeFrameService
{
    Task<IEnumerable<TimeFrame>> Get();
    Task<TimeFrame> Create(TimeFrameCreateDTO timeFrame);
    Task<TimeFrame> Patch(int timeFrameId, TimeFramePatchDTO timeFrame);
    Task<bool> HasRunningTimeFrame();
}
using api.Model.Parameters;
using api.Services;
using api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
public class StatisticsController : ControllerBase
{
    private readonly ITimeFrameService _timeFrameService;

    public StatisticsController(ITimeFrameService timeFrameService)
    {
        _timeFrameService = timeFrameService;
    }

    [HttpGet("statistics/timeframes")]
    public async Task<IActionResult> Get([FromQuery]TimeFrameParameters parameters)
    {
        var statistics = await _timeFrameService.GetTimeFrameStatistics(parameters);
        return Ok(statistics);
    }
}
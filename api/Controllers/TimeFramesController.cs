using api.Model.DTO;
using api.Model.Parameters;
using api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("/timeframes")]
public class TimeFramesController : ControllerBase
{
    private readonly ITimeFrameService _timeFrameService;

    public TimeFramesController(ITimeFrameService timeFrameService)
    {
        _timeFrameService = timeFrameService;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] TimeFrameParameters parameters)
    {
        var data = await _timeFrameService.GetTimeFrames(parameters);
        return Ok(data);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActiveTimeFrame()
    {
        var timeFrame = await _timeFrameService.GetActiveTimeFrame();
        if (timeFrame == null)
        {
            return NotFound();
        }

        return Ok(timeFrame);
    }

    [HttpGet("{timeFrameId:int}")]
    public async Task<IActionResult> GetTimeFrame(int timeFrameId)
    {
        var timeFrame = await _timeFrameService.GetTimeFrames(timeFrameId);
        if (timeFrame == null)
        {
            return NotFound();
        }

        return Ok(timeFrame);
    }
    

    [HttpPost]
    public async Task<IActionResult> Post(TimeFramePostRequest data)
    {
        if (await _timeFrameService.HasActiveTimeFrame())
        {
            return Conflict(error: "There is already a TimeFrame active");
        }

        var entity = await _timeFrameService.Create(data);
        return Created($"/timeframes/{entity.TimeFrameId}", entity);
    }

    [HttpPatch("{timeFrameId:int}")]
    public async Task<IActionResult> Patch(int timeFrameId, TimeFramePatchRequest data)
    {
        var entity = await _timeFrameService.Patch(timeFrameId, data);
        return Ok(entity);
    }

    [HttpDelete("{timeFrameId:int}")]
    public async Task<IActionResult> Delete(int timeFrameId)
    {
        await _timeFrameService.Delete(timeFrameId);
        return Ok();
    }
}
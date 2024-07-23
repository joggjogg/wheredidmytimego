using api.Model.DTO;
using api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("[controller]")]
public class TimeFramesController : ControllerBase
{
    private readonly ITimeFrameService _timeFrameService;

    public TimeFramesController(ITimeFrameService timeFrameService)
    {
        _timeFrameService = timeFrameService;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var data = await _timeFrameService.GetTimeFrames();
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
    public async Task<IActionResult> Post(TimeFrameCreateDTO data)
    {
        if (await _timeFrameService.HasActiveTimeFrame())
        {
            return Conflict(error: "There is already a TimeFrame active");
        }

        var entity = await _timeFrameService.Create(data);
        return Created($"/timeframes/{entity.TimeFrameId}", entity);
    }

    [HttpPatch("{timeFrameId:int}")]
    public async Task<IActionResult> Patch(int timeFrameId, TimeFramePatchDTO data)
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
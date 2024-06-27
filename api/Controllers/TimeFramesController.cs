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
        var data = await _timeFrameService.Get();
        return Ok(data);
    }

    [HttpPost]
    public async Task<IActionResult> Post(TimeFrameCreateDTO data)
    {
        var entity = await _timeFrameService.Create(data);
        return Created($"/timeframes/{entity.TimeFrameId}", entity);
    }

    [HttpPatch("{timeFrameId:int}")]
    public async Task<IActionResult> Patch(int timeFrameId, TimeFramePatchDTO data)
    {
        var entity = await _timeFrameService.Patch(timeFrameId, data);
        return Ok(entity);
    }
}
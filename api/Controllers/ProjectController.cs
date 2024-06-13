using api.Model.DTO;
using api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("[controller]")]
public class ProjectController: ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var projects = await _projectService.Get();
        return Ok(projects);
    }

    [HttpPost]
    public async Task<IActionResult> Post(ProjectCreateDTO project)
    {
        var created = await _projectService.Create(project);
        return Created($"/projects{created.ProjectId}", created);
    }
}
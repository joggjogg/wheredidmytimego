using api.Model.DTO;
using api.Model.Request;
using api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("/projects")]
public class ProjectsController: ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var projects = await _projectService.Get();
        return Ok(projects);
    }

    [HttpGet("{projectId:int}")]
    public async Task<IActionResult> Get(int projectId)
    {
        var project = await _projectService.Get(projectId);
        if (project == null)
        {
            return NotFound();
        }

        return Ok(project);
    }

    [HttpPost]
    public async Task<IActionResult> Post(ProjectPostRequest project)
    {
        var created = await _projectService.Create(project);
        return Created($"/projects{created.ProjectId}", created);
    }
}
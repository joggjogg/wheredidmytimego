using api.Model;
using api.Model.DTO;
using api.Model.Entity;
using api.Services.Interfaces;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Serilog;
using ILogger = Serilog.ILogger;

namespace api.Services;

public class ProjectService: IProjectService
{
    private readonly ILogger _logger;
    private readonly ApplicationContext _applicationContext;
    private readonly DbSet<Project> _projectRepository;

    public ProjectService(ApplicationContext applicationContext)
    {
        _logger = Log.ForContext<ProjectService>();
        _applicationContext = applicationContext;
        _projectRepository = applicationContext.Set<Project>();
    }

    public async Task<IEnumerable<Project>> Get()
    {
        return await _projectRepository.ToListAsync();
    }

    public async Task<Project> Create(ProjectCreateDTO project)
    {
        var entity = project.Adapt<Project>();
        var entry = _projectRepository.Add(entity);
        await _applicationContext.SaveChangesAsync();
        
        return entry.Entity;
    }
}
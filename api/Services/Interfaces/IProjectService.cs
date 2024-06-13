using api.Model.DTO;
using api.Model.Entity;

namespace api.Services.Interfaces;

public interface IProjectService
{
    Task<IEnumerable<Project>> Get();
    Task<Project> Create(ProjectCreateDTO project);
}
#nullable enable
using api.Model.Entity;
using api.Model.Parameters;
using api.Model.Request;

namespace api.Services.Interfaces;

public interface IProjectService
{
    Task<IEnumerable<Project>> Get();
    Task<Project?> Get(int projectId);
    Task<Project> Create(ProjectPostRequest project);
}
#nullable enable
namespace api.Model.DTO;

public class ProjectCreateDTO
{
    public string ProjectName { get; set; }
    public string? ProjectDescription { get; set; }
}
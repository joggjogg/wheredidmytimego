#nullable enable
namespace api.Model.DTO;

public class ProjectPostRequest
{
    public string ProjectName { get; set; }
    public string? ProjectDescription { get; set; }
}
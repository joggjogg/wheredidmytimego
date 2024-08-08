#nullable enable

namespace api.Model.Request;

public class ProjectPostRequest
{
    public string? ProjectName { get; set; }
    public string? ProjectDescription { get; set; }
}
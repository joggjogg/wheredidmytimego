#nullable enable
using System.ComponentModel.DataAnnotations;

namespace api.Model.Entity;

public class Project
{
    [Key] public int ProjectId { get; set; }
    [Required] public string ProjectName { get; set; }
    public string? ProjectDescription { get; set; }
    public IEnumerable<TimeFrame> TimeFrames { get; } = new List<TimeFrame>();
}
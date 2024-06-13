#nullable enable
namespace api.Model.DTO;

public class TimeFramePatchDTO
{
    public DateTime? TimeFrameEnd { get; set; }
    public string? TzName { get; set; }
    public int? ProjectId { get; set; }
    public string? Description { get; set; }
}
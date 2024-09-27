#nullable enable
namespace api.Model.Parameters;

public class TimeFrameParameters
{
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
    public string TzName { get; set; }
    public int? ProjectId { get; set; }
}
#nullable enable
namespace api.Model.Response;

public record TimeFrameStatisticsResponse()
{
    public int ProjectId { get; set; }
    public DateOnly? TimeFrameFrom { get; set; }
    public DateOnly? TimeFrameTo { get; set; }
    public string Days { get; set; }
    public string Hours { get; set; }
    public string Minutes { get; set; }
    public string Seconds { get; set; }
}
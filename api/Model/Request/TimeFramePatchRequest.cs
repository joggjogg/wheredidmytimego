#nullable enable
using System.Text.Json.Serialization;
using api.JsonConverters;

namespace api.Model.DTO;

public class TimeFramePatchRequest
{
    [JsonConverter(typeof(DateTimeConverterUsingDateTimeParse))]
    public DateTime? TimeFrameEnd { get; set; }
    public string? TzName { get; set; }
    public int? ProjectId { get; set; }
    public string? Description { get; set; }
}
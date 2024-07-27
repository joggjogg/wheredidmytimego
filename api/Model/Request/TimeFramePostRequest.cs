using System.Text.Json.Serialization;
using api.JsonConverters;

namespace api.Model.DTO;

public class TimeFramePostRequest
{
    [JsonConverter(typeof(DateTimeConverterUsingDateTimeParse))]
    public DateTime TimeFrameStart { get; set; }
    public string TzName { get; set; }
}
using System.Text.Json.Serialization;
using api.JsonConverters;

namespace api.Model.DTO;

public class TimeFrameBaseDTO
{
    [JsonConverter(typeof(DateTimeConverterUsingDateTimeParse))]
    public DateTime TimeFrameStart { get; set; }
}
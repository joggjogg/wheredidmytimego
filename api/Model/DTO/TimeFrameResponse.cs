namespace api.Model.DTO;

public class TimeFrameResponse: TimeFrameBaseDTO
{
    public int TimeFrameId { get; set; }
    public DateTime? TimeFrameEnd { get; set; }
}
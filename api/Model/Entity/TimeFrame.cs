using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Model.Entity;

public class TimeFrame
{
    [Key] public int TimeFrameId { get; set; }
    [Required] public DateTime TimeFrameStart { get; set; }
    public DateTime? TimeFrameEnd { get; set; }
    [Column(TypeName = "text")]
    public string? Description { get; set; }
}
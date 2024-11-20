using TimeZoneConverter;

namespace api.Extensions;

public static class DateExtensions
{
    public static DateTime StartOfDay(this DateTime date)
    {
        return date.Date;
    }

    public static DateTime EndOfDay(this DateTime date)
    {
        return date.Date.AddDays(1).AddTicks(-1);
    }
    
    public static DateTime FromZonedToUniversalTime(this DateTime dateTime, string tzName)
    {
        return TimeZoneInfo.ConvertTimeToUtc(dateTime,
            TZConvert.GetTimeZoneInfo(tzName));
    }
}
namespace api.Exceptions;

public class InvalidTimeFrameException : Exception
{
    public InvalidTimeFrameException() : base()
    {
    }

    public InvalidTimeFrameException(string message) : base(message)
    {
    }
}
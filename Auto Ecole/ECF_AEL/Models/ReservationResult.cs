namespace ECF_AEL.Models
{
    public class ReservationResult
    {
        public bool Success { get; set; }
        public string? Erreur { get; set; }

        public static ReservationResult Ok() => new() { Success = true };
        public static ReservationResult Fail(string erreur) => new() { Success = false, Erreur = erreur };
    }
}

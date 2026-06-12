using ECF_AEL.Models;

namespace ECF_AEL.Metier
{
    public interface ICalendrierMetier
    {
        List<Calendrier> GetAllCreneaux();
        (bool Success, string? Erreur) CreateCreneau(DateTime dateHeure);
        (bool Success, string? Erreur) CreateManyCreneaux(List<DateTime> dates);
        (bool Success, string? Erreur) DeleteCreneau(DateTime dateHeure);
    }
}

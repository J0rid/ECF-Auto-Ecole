using ECF_AEL.Models;

namespace ECF_AEL.Metier
{
    public interface ICalendrierMetier
    {
        List<Calendrier> GetAll();
        (bool Success, string? Erreur) Create(DateTime dateHeure);
        (bool Success, string? Erreur) CreateMany(List<DateTime> dates);
        (bool Success, string? Erreur) Delete(DateTime dateHeure);
    }
}

using ECF_AEL.Models;

namespace ECF_AEL.Repository
{
    public interface ICalendrierRepository
    {
        List<Calendrier> GetAllCreneaux();
        bool CreneauExiste(DateTime dateHeure);
        bool CreneauADesLecons(DateTime dateHeure);
        void CreateCreneau(DateTime dateHeure);
        void DeleteCreneau(DateTime dateHeure);
    }
}

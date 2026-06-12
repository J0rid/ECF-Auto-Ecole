using ECF_AEL.Models;
using ECF_AEL.Repository;

namespace ECF_AEL.Metier
{
    public class CalendrierMetier : ICalendrierMetier
    {
        private readonly ICalendrierRepository _calendrierRepository;

        public CalendrierMetier(ICalendrierRepository calendrierRepository)
        {
            _calendrierRepository = calendrierRepository;
        }

        public List<Calendrier> GetAllCreneaux() => _calendrierRepository.GetAllCreneaux();

        public (bool Success, string? Erreur) CreateCreneau(DateTime dateHeure)
        {
            if (_calendrierRepository.CreneauExiste(dateHeure))
                return (false, "Ce créneau existe déjà dans le calendrier.");

            _calendrierRepository.CreateCreneau(dateHeure);
            return (true, null);
        }

        public (bool Success, string? Erreur) CreateManyCreneaux(List<DateTime> dates)
        {
            List<DateTime> doublons = dates.Where(d => _calendrierRepository.CreneauExiste(d)).ToList();
            if (doublons.Count > 0)
            {
                string liste = string.Join(", ", doublons.Select(d => d.ToString("yyyy-MM-dd HH:mm")));
                return (false, $"Créneaux déjà existants : {liste}");
            }

            foreach (DateTime date in dates)
                _calendrierRepository.CreateCreneau(date);

            return (true, null);
        }

        public (bool Success, string? Erreur) DeleteCreneau(DateTime dateHeure)
        {
            if (!_calendrierRepository.CreneauExiste(dateHeure))
                return (false, "Ce créneau n'existe pas.");

            if (_calendrierRepository.CreneauADesLecons(dateHeure))
                return (false, "Impossible de supprimer ce créneau : une leçon y est associée.");

            _calendrierRepository.DeleteCreneau(dateHeure);
            return (true, null);
        }
    }
}

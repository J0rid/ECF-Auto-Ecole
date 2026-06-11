using ECF_AEL.Models;
using ECF_AEL.Repository;

namespace ECF_AEL.Metier
{
    public class LeconMetier : ILeconMetier
    {
        private readonly ILeconRepository _leconRepository;

        public LeconMetier(ILeconRepository leconRepository)
        {
            _leconRepository = leconRepository;
        }

        public List<LeconDetail> GetAll() => _leconRepository.GetAllLecons();

        public List<LeconDetail> GetByEleve(int eleveId) => _leconRepository.GetLeconsByEleve(eleveId);

        public ReservationResult Reserver(Lecon lecon)
        {
            if (!_leconRepository.CreneauExiste(lecon.DateHLecon))
                return ReservationResult.Fail("Ce créneau n'existe pas dans le calendrier.");

            if (!_leconRepository.MoniteurEstActif(lecon.MoniteurId))
                return ReservationResult.Fail("Ce moniteur est inactif.");

            if (!_leconRepository.MoniteurEstDisponible(lecon.MoniteurId, lecon.DateHLecon))
                return ReservationResult.Fail("Ce moniteur est déjà réservé sur ce créneau.");

            if (!_leconRepository.EleveEstDisponible(lecon.EleveId, lecon.DateHLecon))
                return ReservationResult.Fail("Cet élève a déjà une leçon sur ce créneau.");

            if (!_leconRepository.VehiculeEstDisponible(lecon.ModeleLecon, lecon.DateHLecon))
                return ReservationResult.Fail("Aucun véhicule de ce modèle n'est disponible sur ce créneau.");

            _leconRepository.CreateLecon(lecon);
            return ReservationResult.Ok();
        }

        public bool Annuler(string modeleLecon, DateTime dateHLecon, int eleveId, int moniteurId)
            => _leconRepository.DeleteLecon(modeleLecon, dateHLecon, eleveId, moniteurId);
    }
}

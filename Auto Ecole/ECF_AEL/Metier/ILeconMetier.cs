using ECF_AEL.Models;

namespace ECF_AEL.Metier
{
    public interface ILeconMetier
    {
        List<LeconDetail> GetAll();
        List<LeconDetail> GetByEleve(int eleveId);
        ReservationResult Reserver(Lecon lecon);
        bool Annuler(string modeleLecon, DateTime dateHLecon, int eleveId, int moniteurId);
    }
}

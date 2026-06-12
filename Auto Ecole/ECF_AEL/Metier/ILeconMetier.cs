using ECF_AEL.Models;

namespace ECF_AEL.Metier
{
    public interface ILeconMetier
    {
        List<LeconDetail> GetAllLecons();
        List<LeconDetail> GetLeconsByEleve(int eleveId);
        ReservationResult ReserverLecon(Lecon lecon);
        bool AnnulerLecon(string modeleLecon, DateTime dateHLecon, int eleveId, int moniteurId);
    }
}

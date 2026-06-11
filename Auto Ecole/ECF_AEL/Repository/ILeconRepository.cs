using ECF_AEL.Models;

namespace ECF_AEL.Repository
{
    public interface ILeconRepository
    {
        List<LeconDetail> GetAllLecons();
        List<LeconDetail> GetLeconsByEleve(int eleveId);
        void CreateLecon(Lecon lecon);
        bool DeleteLecon(string modeleLecon, DateTime dateHLecon, int eleveId, int moniteurId);
        bool CreneauExiste(DateTime dateHeure);
        bool MoniteurEstActif(int moniteurId);
        bool MoniteurEstDisponible(int moniteurId, DateTime dateHeure);
        bool EleveEstDisponible(int eleveId, DateTime dateHeure);
        bool VehiculeEstDisponible(string modeleLecon, DateTime dateHeure);
    }
}

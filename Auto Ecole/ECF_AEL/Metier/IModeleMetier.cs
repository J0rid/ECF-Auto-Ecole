using ECF_AEL.Models;

namespace ECF_AEL.Metier
{
    public interface IModeleMetier
    {
        List<Modele> GetAllModeles();
        void CreateModele(Modele modele);
        bool DeleteModele(string modeleVehicule);
    }
}

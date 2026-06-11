using ECF_AEL.Models;

namespace ECF_AEL.Repository
{
    public interface IModeleRepository
    {
        List<Modele> GetAllModeles();
        Modele? GetModeleByNom(string modeleVehicule);
        void CreateModele(Modele modele);
        void DeleteModele(string modeleVehicule);
    }
}

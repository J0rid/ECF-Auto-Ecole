using ECF_AEL.Models;

namespace ECF_AEL.Metier
{
    public interface IModeleMetier
    {
        List<Modele> GetAll();
        void Create(Modele modele);
        bool Delete(string modeleVehicule);
    }
}

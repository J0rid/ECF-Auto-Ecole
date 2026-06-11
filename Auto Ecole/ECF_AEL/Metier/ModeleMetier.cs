using ECF_AEL.Models;
using ECF_AEL.Repository;

namespace ECF_AEL.Metier
{
    public class ModeleMetier : IModeleMetier
    {
        private readonly IModeleRepository _modeleRepository;

        public ModeleMetier(IModeleRepository modeleRepository)
        {
            _modeleRepository = modeleRepository;
        }

        public List<Modele> GetAll() => _modeleRepository.GetAllModeles();

        public void Create(Modele modele) => _modeleRepository.CreateModele(modele);

        public bool Delete(string modeleVehicule)
        {
            if (_modeleRepository.GetModeleByNom(modeleVehicule) == null) return false;
            _modeleRepository.DeleteModele(modeleVehicule);
            return true;
        }
    }
}

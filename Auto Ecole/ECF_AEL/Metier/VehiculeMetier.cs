using ECF_AEL.Models;
using ECF_AEL.Repository;

namespace ECF_AEL.Metier
{
    public class VehiculeMetier : IVehiculeMetier
    {
        private readonly IVehiculeRepository _vehiculeRepository;

        public VehiculeMetier(IVehiculeRepository vehiculeRepository)
        {
            _vehiculeRepository = vehiculeRepository;
        }

        public List<VehiculeDetail> GetAll() => _vehiculeRepository.GetAllVehicules();

        public VehiculeDetail? GetByImmat(string noImmat) => _vehiculeRepository.GetVehiculeByImmat(noImmat);

        public void Create(Vehicule vehicule)
        {
            vehicule.Etat = true;
            _vehiculeRepository.CreateVehicule(vehicule);
        }

        public bool Update(Vehicule vehicule)
        {
            if (_vehiculeRepository.GetVehiculeByImmat(vehicule.NoImmat) == null) return false;
            _vehiculeRepository.UpdateVehicule(vehicule);
            return true;
        }

        public bool Activer(string noImmat)
        {
            if (_vehiculeRepository.GetVehiculeByImmat(noImmat) == null) return false;
            _vehiculeRepository.SetEtatVehicule(noImmat, true);
            return true;
        }

        public bool Desactiver(string noImmat)
        {
            if (_vehiculeRepository.GetVehiculeByImmat(noImmat) == null) return false;
            _vehiculeRepository.SetEtatVehicule(noImmat, false);
            return true;
        }

        public bool Delete(string noImmat)
        {
            if (_vehiculeRepository.GetVehiculeByImmat(noImmat) == null) return false;
            _vehiculeRepository.DeleteVehicule(noImmat);
            return true;
        }
    }
}

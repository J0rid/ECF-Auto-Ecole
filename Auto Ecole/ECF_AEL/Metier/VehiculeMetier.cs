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

        public List<VehiculeDetail> GetAllVehicules() => _vehiculeRepository.GetAllVehicules();

        public VehiculeDetail? GetVehiculeByImmat(string noImmat) => _vehiculeRepository.GetVehiculeByImmat(noImmat);

        public void CreateVehicule(Vehicule vehicule)
        {
            vehicule.Etat = true;
            _vehiculeRepository.CreateVehicule(vehicule);
        }

        public bool UpdateVehicule(Vehicule vehicule)
        {
            if (_vehiculeRepository.GetVehiculeByImmat(vehicule.NoImmat) == null) return false;
            _vehiculeRepository.UpdateVehicule(vehicule);
            return true;
        }

        public bool ActiverVehicule(string noImmat)
        {
            if (_vehiculeRepository.GetVehiculeByImmat(noImmat) == null) return false;
            _vehiculeRepository.SetEtatVehicule(noImmat, true);
            return true;
        }

        public bool DesactiverVehicule(string noImmat)
        {
            if (_vehiculeRepository.GetVehiculeByImmat(noImmat) == null) return false;
            _vehiculeRepository.SetEtatVehicule(noImmat, false);
            return true;
        }

        public bool DeleteVehicule(string noImmat)
        {
            if (_vehiculeRepository.GetVehiculeByImmat(noImmat) == null) return false;
            _vehiculeRepository.DeleteVehicule(noImmat);
            return true;
        }
    }
}

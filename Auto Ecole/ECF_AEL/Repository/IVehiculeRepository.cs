using ECF_AEL.Models;

namespace ECF_AEL.Repository
{
    public interface IVehiculeRepository
    {
        List<VehiculeDetail> GetAllVehicules();
        VehiculeDetail? GetVehiculeByImmat(string noImmat);
        void CreateVehicule(Vehicule vehicule);
        void UpdateVehicule(Vehicule vehicule);
        void SetEtatVehicule(string noImmat, bool etat);
        void DeleteVehicule(string noImmat);
    }
}

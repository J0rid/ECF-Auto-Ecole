using ECF_AEL.Models;

namespace ECF_AEL.Metier
{
    public interface IVehiculeMetier
    {
        List<VehiculeDetail> GetAllVehicules();
        VehiculeDetail? GetVehiculeByImmat(string noImmat);
        void CreateVehicule(Vehicule vehicule);
        bool UpdateVehicule(Vehicule vehicule);
        bool ActiverVehicule(string noImmat);
        bool DesactiverVehicule(string noImmat);
        bool DeleteVehicule(string noImmat);
    }
}

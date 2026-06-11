using ECF_AEL.Models;

namespace ECF_AEL.Metier
{
    public interface IVehiculeMetier
    {
        List<VehiculeDetail> GetAll();
        VehiculeDetail? GetByImmat(string noImmat);
        void Create(Vehicule vehicule);
        bool Update(Vehicule vehicule);
        bool Activer(string noImmat);
        bool Desactiver(string noImmat);
        bool Delete(string noImmat);
    }
}
